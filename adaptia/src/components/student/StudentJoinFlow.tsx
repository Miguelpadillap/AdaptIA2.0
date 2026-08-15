import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DIAGNOSTIC_QUESTIONS, calculateLearningStyleProfile } from '../../data/quizQuestions';
import { LEARNING_STYLES } from '../../data/learningStylesData';
import { LearningStyle, LearningStyleProfile } from '../../types';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Eye,
  Headphones,
  Flame,
  FileText,
  User,
  School,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

export const StudentJoinFlow: React.FC = () => {
  const {
    joiningCourseCode,
    courses,
    getCourseByCode,
    registerAndEnrollStudent,
    setActiveRole,
    setActiveStudentId,
  } = useApp();

  // Find course to join
  const targetCourse = joiningCourseCode
    ? getCourseByCode(joiningCourseCode) || courses[0]
    : courses[0];

  // Steps: 'intro' -> 'quiz' -> 'result'
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [studentName, setStudentName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  );

  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, LearningStyle>>({});
  const [diagnosedProfile, setDiagnosedProfile] = useState<LearningStyleProfile | null>(null);

  const currentQ = DIAGNOSTIC_QUESTIONS[currentQIndex];
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;

  const avatarsList = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  ];

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    setStep('quiz');
  };

  const handleSelectAnswer = (style: LearningStyle) => {
    const updatedAnswers = { ...answers, [currentQ.id]: style };
    setAnswers(updatedAnswers);

    if (currentQIndex < totalQuestions - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Finished all questions!
      const profile = calculateLearningStyleProfile(updatedAnswers);
      setDiagnosedProfile(profile);

      // Register and auto-enroll
      const { student } = registerAndEnrollStudent(
        studentName.trim(),
        updatedAnswers,
        targetCourse.id,
        selectedAvatar
      );
      setActiveStudentId(student.id);

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.error(e);
      }

      setStep('result');
    }
  };

  const handleEnterCourse = () => {
    setActiveRole('student');
  };

  const getStyleIcon = (style: LearningStyle) => {
    switch (style) {
      case 'visual': return <Eye className="w-5 h-5 text-sky-600" />;
      case 'auditivo': return <Headphones className="w-5 h-5 text-purple-600" />;
      case 'kinestesico': return <Flame className="w-5 h-5 text-orange-600" />;
      case 'lectoescritura': return <FileText className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Intro Step */}
      {step === 'intro' && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-2.5 bg-indigo-50 text-indigo-600 rounded-lg mb-1">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded mb-2">
                {targetCourse.grade} • Código: {targetCourse.code}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              ¡Bienvenido a {targetCourse.name}!
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Tu profesor <strong>{targetCourse.teacherName}</strong> te ha invitado a esta clase. Antes de empezar, descubriremos tu estilo de aprendizaje para que todo el material se adapte a ti.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleStartQuiz} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Escribe tu Nombre y Apellido <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ej: Daniel Sánchez"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Avatar picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Elige tu Avatar de Estudiante
              </label>
              <div className="flex items-center gap-2.5">
                {avatarsList.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                      selectedAvatar === av
                        ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-105'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-200/60 text-xs text-indigo-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Test Diagnóstico Rápido (8 preguntas cortas)</p>
                <p className="text-indigo-900/80 mt-0.5">
                  No hay respuestas correctas o incorrectas. Solo elige la opción que mejor represente tu manera de aprender.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!studentName.trim()}
              className="w-full py-2.5 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <span>Comenzar Test Diagnóstico VARK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Quiz Questions Step */}
      {step === 'quiz' && currentQ && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-5 animate-in fade-in duration-200">
          {/* Progress header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Pregunta {currentQIndex + 1} de {totalQuestions}</span>
              <span>{Math.round(((currentQIndex + 1) / totalQuestions) * 100)}% completado</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question scenario */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
              {currentQ.category}
            </span>
            <p className="text-xs font-medium text-slate-500">{currentQ.scenario}</p>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-1">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAnswer(option.style)}
                className="w-full p-3.5 text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-500 hover:shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs text-slate-800 transition-all flex items-start gap-3 group"
              >
                <span className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center shrink-0 group-hover:border-indigo-600 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors mt-0.5 text-[11px]">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-relaxed font-medium text-slate-800 group-hover:text-slate-900">
                  {option.text}
                </span>
              </button>
            ))}
          </div>

          {currentQIndex > 0 && (
            <div className="pt-2 flex justify-start">
              <button
                type="button"
                onClick={() => setCurrentQIndex(currentQIndex - 1)}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Pregunta anterior</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Result Celebration Step */}
      {step === 'result' && diagnosedProfile && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-1.5">
            <div
              className="w-12 h-12 rounded-lg mx-auto flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: LEARNING_STYLES[diagnosedProfile.dominantStyle].color }}
            >
              {getStyleIcon(diagnosedProfile.dominantStyle)}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ¡Diagnóstico VARK Completado con Éxito!
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              {studentName}, tu estilo principal es:{' '}
              <span style={{ color: LEARNING_STYLES[diagnosedProfile.dominantStyle].color }}>
                {LEARNING_STYLES[diagnosedProfile.dominantStyle].name}
              </span>
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {LEARNING_STYLES[diagnosedProfile.dominantStyle].description}
            </p>
          </div>

          {/* Breakdown bars */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5 text-left">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Tu Perfil de Aprendizaje Personalizado:
            </h4>
            <div className="space-y-2">
              {(Object.keys(LEARNING_STYLES) as LearningStyle[]).map((styleKey) => {
                const pct = diagnosedProfile.percentages[styleKey] || 0;
                const meta = LEARNING_STYLES[styleKey];
                return (
                  <div key={styleKey} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                        {meta.name}
                      </span>
                      <span className="font-bold text-slate-900">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: meta.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enrolled Confirmation */}
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Inscripción Completada</p>
                <p className="text-emerald-900">
                  Estás registrado en <strong>{targetCourse.name}</strong> con el Prof. {targetCourse.teacherName}.
                </p>
              </div>
            </div>
          </div>

          {/* Launch Student Portal */}
          <button
            type="button"
            onClick={handleEnterCourse}
            className="w-full py-2.5 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Entrar a Mi Aula y Ver Recursos Adaptados</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
