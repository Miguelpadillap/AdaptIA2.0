import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentJoinFlow } from './components/student/StudentJoinFlow';
import { ApiKeyModal } from './components/ApiKeyModal';
import { CreateCourseModal } from './components/teacher/CreateCourseModal';
import { ShareCourseModal } from './components/common/ShareCourseModal';
import { LEARNING_STYLES } from './data/learningStylesData';
import { Sparkles, GraduationCap, Heart, ExternalLink } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeRole, startJoinFlow } = useApp();

  // Check URL params for course invitation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (joinCode) {
      startJoinFlow(joinCode);
    }
  }, [startJoinFlow]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeRole === 'teacher' && <TeacherDashboard />}
        {activeRole === 'student' && <StudentDashboard />}
        {activeRole === 'student_join' && <StudentJoinFlow />}
      </main>

      {/* Global Modals */}
      <ApiKeyModal />
      <CreateCourseModal />
      <ShareCourseModal />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              adaptIA
            </span>
            <span className="text-slate-400">|</span>
            <span>Plataforma Pedagógica de Aprendizaje Adaptativo con IA</span>
          </div>

          <div className="flex items-center gap-3.5 text-[11px] font-medium">
            <span className="text-sky-600 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-500" />Visual</span>
            <span className="text-purple-600 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" />Auditivo</span>
            <span className="text-amber-600 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Kinestésico</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Lectoescritura</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
