import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseManager } from './CourseManager';
import { ResourceStudio } from './ResourceStudio';
import { AnalyticsProgress } from './AnalyticsProgress';
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  Users,
  PlusCircle,
  Share2,
  HelpCircle,
  GraduationCap
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    courses,
    topics,
    students,
    setIsCreateCourseModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'studio' | 'courses' | 'analytics'>('studio');

  return (
    <div className="space-y-6">
      {/* Top Banner / Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'studio'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Estudio de Recursos con IA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'courses'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mis Cursos ({courses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Seguimiento en Tiempo Real</span>
          </button>
        </div>

        {/* Quick summary chips */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>{courses.length} Cursos</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>{students.length} Alumnos</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-700 font-bold">{topics.filter((t) => t.status === 'published').length} Temas Publicados</span>
          </span>
        </div>
      </div>

      {/* Render Active Tab */}
      {activeTab === 'studio' && <ResourceStudio />}
      {activeTab === 'courses' && (
        <CourseManager onNavigateToStudio={() => setActiveTab('studio')} />
      )}
      {activeTab === 'analytics' && <AnalyticsProgress />}
    </div>
  );
};
