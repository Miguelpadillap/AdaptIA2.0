import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TeacherAuthModal } from './teacher/TeacherAuthModal';
import {
  Sparkles,
  Key,
  GraduationCap,
  PlusCircle,
  User,
  School,
  CheckCircle,
  Cpu,
  BookOpen,
  Share2
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    teacher,
    setIsApiKeyModalOpen,
    setIsCreateCourseModalOpen,
    startJoinFlow,
    courses,
  } = useApp();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveRole('teacher')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
              <span className="text-white font-bold text-lg leading-none">A</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-indigo-900">
                adaptIA
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                Pedagógico
              </span>
            </div>
          </div>
        </div>

        {/* Center Role Navigation Pill */}
        <nav className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveRole('teacher')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeRole === 'teacher'
                ? 'bg-white text-indigo-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Docente</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole('student')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeRole === 'student'
                ? 'bg-white text-indigo-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <School className="w-3.5 h-3.5 text-indigo-600" />
            <span>Estudiante</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (courses.length > 0) {
                startJoinFlow(courses[0].code);
              }
            }}
            className={`hidden sm:flex px-3 py-1.5 rounded-md text-xs font-semibold items-center gap-1.5 transition-all ${
              activeRole === 'student_join'
                ? 'bg-white text-indigo-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Simular Enlace</span>
          </button>
        </nav>

        {/* Right Actions: API Key, Create Course & Teacher Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* API Key Status Pill */}
          <button
            type="button"
            onClick={() => setIsApiKeyModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-2 shadow-2xs transition-colors"
            title="Administrar API Key de Gemini"
          >
            <Key className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">
              {teacher.apiKey ? 'API Key Docente' : 'Configurar API Key'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                teacher.apiKey ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-amber-400'
              }`}
            />
          </button>

          {/* Quick Create Course Button (if teacher) */}
          {activeRole === 'teacher' && (
            <button
              type="button"
              onClick={() => setIsCreateCourseModalOpen(true)}
              className="hidden lg:flex px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold items-center gap-1.5 shadow-sm transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Crear Curso</span>
            </button>
          )}

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-slate-200 mx-1"></div>

          {/* Teacher Profile / Auth */}
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2.5 p-1 pl-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-none truncate max-w-[130px]">
                {teacher.name}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {teacher.apiKey ? 'API Key: Activa' : 'API Key: Inactiva'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">
              {teacher.name ? teacher.name.charAt(0) : 'P'}
            </div>
          </button>
        </div>
      </div>

      <TeacherAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};
