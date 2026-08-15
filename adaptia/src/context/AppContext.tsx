import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Teacher,
  Student,
  Course,
  TopicResource,
  StudentProgress,
  ActiveRole,
  LearningStyle,
  LearningStyleProfile,
  TopicStyles
} from '../types';
import {
  INITIAL_TEACHER,
  INITIAL_COURSES,
  INITIAL_STUDENTS,
  INITIAL_TOPICS,
  INITIAL_PROGRESS
} from '../data/seedData';
import { calculateLearningStyleProfile } from '../data/quizQuestions';
import {
  db,
  testFirebaseConnection,
  saveCourseToFirestore,
  deleteCourseFromFirestore,
  saveTopicToFirestore,
  deleteTopicFromFirestore,
  saveStudentToFirestore,
  saveProgressToFirestore,
  syncTeacherToFirestore,
  handleFirestoreError,
  OperationType
} from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface AppContextType {
  // Current user & role state
  activeRole: ActiveRole;
  setActiveRole: (role: ActiveRole) => void;
  teacher: Teacher;
  updateTeacher: (data: Partial<Teacher>) => void;
  activeStudent: Student | null;
  setActiveStudentId: (studentId: string | null) => void;

  // Courses
  courses: Course[];
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  createCourse: (grade: string, name: string, description?: string) => Course;
  deleteCourse: (courseId: string) => void;
  getCourseById: (courseId: string) => Course | undefined;
  getCourseByCode: (code: string) => Course | undefined;

  // Students & Diagnostics
  students: Student[];
  registerAndEnrollStudent: (
    name: string,
    quizAnswers: Record<number, LearningStyle>,
    courseId?: string,
    avatarUrl?: string
  ) => { student: Student; profile: LearningStyleProfile };
  getStudentsByCourse: (courseId: string) => Student[];

  // Topics & Adaptive Resources
  topics: TopicResource[];
  createTopicResource: (
    courseId: string,
    topicTitle: string,
    specificFocus: string,
    styles: TopicStyles,
    publishImmediately?: boolean
  ) => TopicResource;
  updateTopicResourceStyle: (
    topicId: string,
    style: LearningStyle,
    updatedStyleResource: any,
    prompt: string,
    replySummary: string
  ) => void;
  publishTopicResource: (topicId: string) => void;
  deleteTopicResource: (topicId: string) => void;
  getTopicsByCourse: (courseId: string) => TopicResource[];

  // Progress tracking
  progressList: StudentProgress[];
  updateStudentProgress: (
    studentId: string,
    courseId: string,
    topicId: string,
    quizScore: number,
    quizTotal: number,
    quizAnswers: Record<number, number>,
    completed: boolean,
    timeSpentMinutes?: number,
    notes?: string
  ) => void;
  getStudentProgressForTopic: (studentId: string, topicId: string) => StudentProgress | undefined;
  getCourseProgressStats: (courseId: string) => {
    totalStudents: number;
    stylesCount: Record<LearningStyle, number>;
    averageScore: number;
    completionRate: number;
    totalPublishedTopics: number;
  };

  // Join link handling
  joiningCourseCode: string | null;
  setJoiningCourseCode: (code: string | null) => void;
  startJoinFlow: (courseCodeOrId: string) => void;

  // Global modals
  isApiKeyModalOpen: boolean;
  setIsApiKeyModalOpen: (open: boolean) => void;
  isCreateCourseModalOpen: boolean;
  setIsCreateCourseModalOpen: (open: boolean) => void;
  shareModalCourse: Course | null;
  setShareModalCourse: (course: Course | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TEACHER: 'adaptia_teacher_v1',
  COURSES: 'adaptia_courses_v1',
  STUDENTS: 'adaptia_students_v1',
  TOPICS: 'adaptia_topics_v1',
  PROGRESS: 'adaptia_progress_v1',
  ACTIVE_STUDENT_ID: 'adaptia_active_student_id_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states or fallback to seed data
  const [teacher, setTeacher] = useState<Teacher>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHER);
      return saved ? JSON.parse(saved) : INITIAL_TEACHER;
    } catch {
      return INITIAL_TEACHER;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [topics, setTopics] = useState<TopicResource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOPICS);
      return saved ? JSON.parse(saved) : INITIAL_TOPICS;
    } catch {
      return INITIAL_TOPICS;
    }
  });

  const [progressList, setProgressList] = useState<StudentProgress[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
    } catch {
      return INITIAL_PROGRESS;
    }
  });

  const [activeRole, setActiveRole] = useState<ActiveRole>('teacher');
  const [activeStudentId, setActiveStudentId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID) || 'student-1';
    } catch {
      return 'student-1';
    }
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(courses[0]?.id || null);
  const [joiningCourseCode, setJoiningCourseCode] = useState<string | null>(null);

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState<boolean>(false);
  const [shareModalCourse, setShareModalCourse] = useState<Course | null>(null);

  // Test connection & setup live listeners
  useEffect(() => {
    testFirebaseConnection();

    // Live sync for courses
    const unsubCourses = onSnapshot(
      collection(db, 'courses'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteCourses = snapshot.docs.map((doc) => doc.data() as Course);
          setCourses(remoteCourses);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'courses');
      }
    );

    // Live sync for topics
    const unsubTopics = onSnapshot(
      collection(db, 'topics'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteTopics = snapshot.docs.map((doc) => doc.data() as TopicResource);
          setTopics(remoteTopics);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'topics');
      }
    );

    // Live sync for students
    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteStudents = snapshot.docs.map((doc) => doc.data() as Student);
          setStudents(remoteStudents);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'students');
      }
    );

    // Live sync for student progress
    const unsubProgress = onSnapshot(
      collection(db, 'progress'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteProgress = snapshot.docs.map((doc) => doc.data() as StudentProgress);
          setProgressList(remoteProgress);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'progress');
      }
    );

    return () => {
      unsubCourses();
      unsubTopics();
      unsubStudents();
      unsubProgress();
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(teacher));
  }, [teacher]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressList));
  }, [progressList]);

  useEffect(() => {
    if (activeStudentId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, activeStudentId);
    }
  }, [activeStudentId]);

  // Check URL query parameters for ?join=COURSE_CODE
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const joinParam = params.get('join') || params.get('curso') || params.get('c');
      if (joinParam) {
        setJoiningCourseCode(joinParam);
        setActiveRole('join_flow');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateTeacher = (data: Partial<Teacher>) => {
    setTeacher((prev) => {
      const updated = { ...prev, ...data };
      syncTeacherToFirestore(updated);
      return updated;
    });
  };

  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0] || null;

  const createCourse = (grade: string, name: string, description?: string): Course => {
    // Generate clean slug / code
    const cleanPrefix = name
      .substring(0, 4)
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase() || 'CRS';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const code = `${cleanPrefix}-${grade.replace(/[^0-9]/g, '') || 'G'}-${randomSuffix}`;
    
    const colors = ['#0284c7', '#7c3aed', '#059669', '#d97706', '#dc2626', '#4f46e5'];
    const accentColor = colors[courses.length % colors.length];

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      code,
      name: name.trim(),
      grade: grade.trim(),
      description: description?.trim() || `Clase de ${name.trim()} para ${grade.trim()}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      createdAt: new Date().toISOString(),
      accentColor,
    };

    setCourses((prev) => [newCourse, ...prev]);
    setSelectedCourseId(newCourse.id);
    saveCourseToFirestore(newCourse);
    return newCourse;
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setTopics((prev) => prev.filter((t) => t.courseId !== courseId));
    setProgressList((prev) => prev.filter((p) => p.courseId !== courseId));
    if (selectedCourseId === courseId) {
      const remaining = courses.filter((c) => c.id !== courseId);
      setSelectedCourseId(remaining[0]?.id || null);
    }
    deleteCourseFromFirestore(courseId);
  };

  const getCourseById = (courseId: string) => courses.find((c) => c.id === courseId);
  const getCourseByCode = (code: string) =>
    courses.find((c) => c.code.toLowerCase() === code.toLowerCase() || c.id === code);

  const registerAndEnrollStudent = (
    name: string,
    quizAnswers: Record<number, LearningStyle>,
    courseId?: string,
    avatarUrl?: string
  ) => {
    const profile = calculateLearningStyleProfile(quizAnswers);
    const fallbackAvatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
    ];
    const chosenAvatar = avatarUrl || fallbackAvatars[Math.floor(Math.random() * fallbackAvatars.length)];

    const targetCourseIds = courseId ? [courseId] : [courses[0]?.id || 'course-bio-8'];

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: name.trim() || 'Estudiante',
      avatar: chosenAvatar,
      enrolledCourseIds: targetCourseIds,
      learningStyle: profile.dominantStyle,
      profile,
      enrolledAt: new Date().toISOString(),
    };

    setStudents((prev) => [newStudent, ...prev]);
    setActiveStudentId(newStudent.id);
    saveStudentToFirestore(newStudent);
    return { student: newStudent, profile };
  };

  const getStudentsByCourse = (courseId: string) => {
    return students.filter((s) => s.enrolledCourseIds.includes(courseId));
  };

  const createTopicResource = (
    courseId: string,
    topicTitle: string,
    specificFocus: string,
    styles: TopicStyles,
    publishImmediately: boolean = false
  ): TopicResource => {
    const now = new Date().toISOString();
    const newTopic: TopicResource = {
      id: `topic-${Date.now()}`,
      courseId,
      teacherId: teacher.id,
      topicTitle: topicTitle.trim(),
      specificFocus: specificFocus.trim(),
      status: publishImmediately ? 'published' : 'draft',
      createdAt: now,
      updatedAt: now,
      publishedAt: publishImmediately ? now : undefined,
      styles,
      modificationHistory: {
        visual: [],
        auditivo: [],
        kinestesico: [],
        lectoescritura: []
      }
    };

    setTopics((prev) => [newTopic, ...prev]);
    saveTopicToFirestore(newTopic);
    return newTopic;
  };

  const updateTopicResourceStyle = (
    topicId: string,
    style: LearningStyle,
    updatedStyleResource: any,
    prompt: string,
    replySummary: string
  ) => {
    const now = new Date().toISOString();
    let updatedTopic: TopicResource | null = null;

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;

        const currentHist = t.modificationHistory?.[style] || [];
        const newHistItem = {
          id: `mod-${Date.now()}`,
          timestamp: now,
          prompt,
          replySummary,
        };

        const res: TopicResource = {
          ...t,
          updatedAt: now,
          styles: {
            ...t.styles,
            [style]: updatedStyleResource,
          },
          modificationHistory: {
            ...t.modificationHistory,
            [style]: [newHistItem, ...currentHist],
          },
        };
        updatedTopic = res;
        return res;
      })
    );

    if (updatedTopic) {
      saveTopicToFirestore(updatedTopic);
    }
  };

  const publishTopicResource = (topicId: string) => {
    const now = new Date().toISOString();
    let updatedTopic: TopicResource | null = null;

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const res: TopicResource = { ...t, status: 'published', updatedAt: now, publishedAt: now };
          updatedTopic = res;
          return res;
        }
        return t;
      })
    );

    if (updatedTopic) {
      saveTopicToFirestore(updatedTopic);
    }
  };

  const deleteTopicResource = (topicId: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
    setProgressList((prev) => prev.filter((p) => p.topicId !== topicId));
    deleteTopicFromFirestore(topicId);
  };

  const getTopicsByCourse = (courseId: string) => {
    return topics.filter((t) => t.courseId === courseId);
  };

  const updateStudentProgress = (
    studentId: string,
    courseId: string,
    topicId: string,
    quizScore: number,
    quizTotal: number,
    quizAnswers: Record<number, number>,
    completed: boolean,
    timeSpentMinutes: number = 5,
    notes?: string
  ) => {
    const now = new Date().toISOString();
    let updatedOrNewProgress: StudentProgress | null = null;

    setProgressList((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.studentId === studentId && p.topicId === topicId
      );

      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const updated: StudentProgress = {
          ...existing,
          completed: completed || existing.completed,
          quizScore: Math.max(quizScore, existing.quizScore || 0),
          quizTotal,
          quizAnswers: { ...existing.quizAnswers, ...quizAnswers },
          timeSpentMinutes: (existing.timeSpentMinutes || 0) + timeSpentMinutes,
          lastAccessed: now,
          studentNotes: notes !== undefined ? notes : existing.studentNotes,
        };
        updatedOrNewProgress = updated;
        const nextList = [...prev];
        nextList[existingIndex] = updated;
        return nextList;
      } else {
        const created: StudentProgress = {
          studentId,
          courseId,
          topicId,
          completed,
          quizScore,
          quizTotal,
          quizAnswers,
          timeSpentMinutes,
          lastAccessed: now,
          studentNotes: notes || '',
        };
        updatedOrNewProgress = created;
        return [created, ...prev];
      }
    });

    if (updatedOrNewProgress) {
      saveProgressToFirestore(updatedOrNewProgress);
    }
  };

  const getStudentProgressForTopic = (studentId: string, topicId: string) => {
    return progressList.find((p) => p.studentId === studentId && p.topicId === topicId);
  };

  const getCourseProgressStats = (courseId: string) => {
    const courseStudents = getStudentsByCourse(courseId);
    const courseTopics = getTopicsByCourse(courseId).filter((t) => t.status === 'published');
    const totalStudents = courseStudents.length;

    const stylesCount: Record<LearningStyle, number> = {
      visual: 0,
      auditivo: 0,
      kinestesico: 0,
      lectoescritura: 0,
    };

    courseStudents.forEach((s) => {
      if (stylesCount[s.learningStyle] !== undefined) {
        stylesCount[s.learningStyle] += 1;
      }
    });

    const relevantProgress = progressList.filter((p) => p.courseId === courseId);
    const totalCompletions = relevantProgress.filter((p) => p.completed).length;
    const possibleCompletions = totalStudents * (courseTopics.length || 1);
    const completionRate = possibleCompletions > 0 ? Math.round((totalCompletions / possibleCompletions) * 100) : 0;

    let scoreSum = 0;
    let scoreCount = 0;
    relevantProgress.forEach((p) => {
      if (p.quizTotal > 0) {
        scoreSum += (p.quizScore / p.quizTotal) * 100;
        scoreCount += 1;
      }
    });
    const averageScore = scoreCount > 0 ? Math.round(scoreSum / scoreCount) : 0;

    return {
      totalStudents,
      stylesCount,
      averageScore,
      completionRate,
      totalPublishedTopics: courseTopics.length,
    };
  };

  const startJoinFlow = (courseCodeOrId: string) => {
    setJoiningCourseCode(courseCodeOrId);
    setActiveRole('join_flow');
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        teacher,
        updateTeacher,
        activeStudent,
        setActiveStudentId,
        courses,
        selectedCourseId,
        setSelectedCourseId,
        createCourse,
        deleteCourse,
        getCourseById,
        getCourseByCode,
        students,
        registerAndEnrollStudent,
        getStudentsByCourse,
        topics,
        createTopicResource,
        updateTopicResourceStyle,
        publishTopicResource,
        deleteTopicResource,
        getTopicsByCourse,
        progressList,
        updateStudentProgress,
        getStudentProgressForTopic,
        getCourseProgressStats,
        joiningCourseCode,
        setJoiningCourseCode,
        startJoinFlow,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        isCreateCourseModalOpen,
        setIsCreateCourseModalOpen,
        shareModalCourse,
        setShareModalCourse,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
