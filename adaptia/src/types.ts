export type LearningStyle = 'visual' | 'auditivo' | 'kinestesico' | 'lectoescritura';

export interface LearningStyleInfo {
  id: LearningStyle;
  name: string;
  shortName: string;
  tagline: string;
  color: string;
  bgLight: string;
  borderLight: string;
  textAccent: string;
  iconName: string;
  description: string;
  tips: string[];
}

export interface QuizQuestionOption {
  text: string;
  style: LearningStyle;
  icon?: string;
}

export interface DiagnosticQuestion {
  id: number;
  scenario: string;
  question: string;
  category: string;
  options: QuizQuestionOption[];
}

export interface LearningStyleScores {
  visual: number;
  auditivo: number;
  kinestesico: number;
  lectoescritura: number;
}

export interface LearningStyleProfile {
  dominantStyle: LearningStyle;
  secondaryStyle: LearningStyle;
  scores: LearningStyleScores;
  percentages: Record<LearningStyle, number>;
  totalQuestions: number;
  diagnosedAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  school?: string;
  apiKey?: string;
  avatar: string;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  enrolledCourseIds: string[];
  learningStyle: LearningStyle;
  profile: LearningStyleProfile;
  enrolledAt: string;
}

export interface Course {
  id: string;
  code: string; // e.g. "BIO-7A-44"
  name: string; // e.g. "Biología y Ciencias Naturales"
  grade: string; // e.g. "7° Básico / Secundaria"
  description?: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
  accentColor: string;
}

export interface VisualStep {
  stepNumber: number;
  title: string;
  desc: string;
  iconName: string;
  color: string;
}

export interface DialogueTurn {
  speaker: string;
  text: string;
}

export interface CornellNote {
  cue: string;
  notes: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface SelfQuizItem {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ModificationHistoryItem {
  id: string;
  timestamp: string;
  prompt: string;
  replySummary: string;
}

export interface VisualStyleResource {
  title: string;
  summary: string;
  keyConcepts: string[];
  coreContent: string;
  visualSteps: VisualStep[];
  diagramAscii?: string;
  selfQuiz: SelfQuizItem[];
  practicalApplication: string;
}

export interface AuditivoStyleResource {
  title: string;
  summary: string;
  keyConcepts: string[];
  coreContent: string;
  podcastTitle: string;
  durationEst: string;
  dialogue: DialogueTurn[];
  listenTip?: string;
  mnemonicRhyme?: string;
  selfQuiz: SelfQuizItem[];
  practicalApplication: string;
}

export interface KinestesicoStyleResource {
  title: string;
  summary: string;
  keyConcepts: string[];
  coreContent: string;
  experimentName: string;
  materialsNeeded: string[];
  stepByStepActions: string[];
  challengeTask: string;
  selfQuiz: SelfQuizItem[];
  practicalApplication: string;
}

export interface LectoescrituraStyleResource {
  title: string;
  summary: string;
  keyConcepts: string[];
  coreContent: string;
  analyticalText: string;
  cornellNotes: CornellNote[];
  glossary: GlossaryTerm[];
  selfQuiz: SelfQuizItem[];
  practicalApplication: string;
}

export interface TopicStyles {
  visual: VisualStyleResource;
  auditivo: AuditivoStyleResource;
  kinestesico: KinestesicoStyleResource;
  lectoescritura: LectoescrituraStyleResource;
}

export interface TopicResource {
  id: string;
  courseId: string;
  teacherId: string;
  topicTitle: string;
  specificFocus: string; // The teacher's specific approach/div
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  styles: TopicStyles;
  modificationHistory?: Record<LearningStyle, ModificationHistoryItem[]>;
}

export interface StudentProgress {
  studentId: string;
  courseId: string;
  topicId: string;
  completed: boolean;
  quizScore: number; // e.g. 3
  quizTotal: number; // e.g. 3
  quizAnswers: Record<number, number>;
  timeSpentMinutes: number;
  lastAccessed: string;
  studentNotes?: string;
}

export type ActiveRole = 'teacher' | 'student' | 'join_flow';
