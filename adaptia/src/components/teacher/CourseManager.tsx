import React from 'react';
import { useApp } from '../../context/AppContext';
import { Course, LearningStyle } from '../../types';
import { LEARNING_STYLES } from '../../data/learningStylesData';
import {
  BookOpen,
  PlusCircle,
  Share2,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Trash2,
  Copy,
  Check
} from 'lucide-react';

export const CourseManager: React.FC<{ onNavigateToStudio: () => void }> = ({ onNavigateToStudio }) => {
  const {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    setIsCreateCourseModalOpen,
    setShareModalCourse,
    getStudentsByCourse,
    getTopicsByCourse,
    getCourseProgressStats,
    startJoinFlow,
    deleteCourse
  } = useApp();

  return (
    <div className="space-y-6">
      {/* Header with Create Course button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Mis Cursos y Aulas Virtuales
          </h2>
          <p className="text-xs text-slate-500">
            Administra tus cursos escolares y comparte el enlace de inscripción único con tus alumnos
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateCourseModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Crear Nuevo Curso</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => {
          const enrolledStudents = getStudentsByCourse(course.id);
          const courseTopics = getTopicsByCourse(course.id);
          const stats = getCourseProgressStats(course.id);
          const isSelected = selectedCourseId === course.id;

          return (
            <div
              key={course.id}
              className={`rounded-xl bg-white border transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:border-indigo-200 ${
                isSelected ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-slate-200'
              }`}
            >
              {/* Card Top Banner */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-100 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    {course.grade}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {course.code}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{course.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                </div>
              </div>

              {/* Stats & VARK Distribution */}
              <div className="p-5 space-y-4 flex-1">
                {/* Metric badges */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 text-[10px] font-bold uppercase block">Alumnos</span>
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mt-0.5">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      {enrolledStudents.length}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 text-[10px] font-bold uppercase block">Temas</span>
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mt-0.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      {stats.totalPublishedTopics}
                    </span>
                  </div>
                </div>

                {/* VARK styles distribution mini bar */}
                {enrolledStudents.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Estilos VARK detectados:</span>
                      <span>{enrolledStudents.length} alumnos</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      {(Object.keys(LEARNING_STYLES) as LearningStyle[]).map((styleKey) => {
                        const count = stats.stylesCount[styleKey] || 0;
                        const pct = (count / enrolledStudents.length) * 100;
                        if (pct === 0) return null;
                        return (
                          <div
                            key={styleKey}
                            style={{
                              width: `${pct}%`,
                              backgroundColor: LEARNING_STYLES[styleKey].color
                            }}
                            title={`${LEARNING_STYLES[styleKey].name}: ${count}`}
                            className="h-full"
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setShareModalCourse(course)}
                  className="px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Enlace Único</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      onNavigateToStudio();
                    }}
                    className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <span>Crear Tema</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {courses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteCourse(course.id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Eliminar curso"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
