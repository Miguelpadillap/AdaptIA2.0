import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LearningStyle, TopicResource } from '../../types';
import { LEARNING_STYLES } from '../../data/learningStylesData';
import { askAITutor } from '../../services/geminiService';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  Eye,
  Headphones,
  Flame,
  FileText,
  Volume2,
  VolumeX,
  Layers,
  Send,
  MessageSquare,
  CheckSquare,
  Square,
  Award,
  Clock,
  ChevronRight,
  GraduationCap,
  HelpCircle,
  RotateCw,
  X,
  Lightbulb,
  Check
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    activeStudent,
    students,
    setActiveStudentId,
    courses,
    topics,
    progressList,
    updateStudentProgress,
    getStudentProgressForTopic,
    teacher,
  } = useApp();

  const student = activeStudent || students[0];
  const enrolledCourses = courses.filter((c) =>
    student ? student.enrolledCourseIds.includes(c.id) : true
  );

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    enrolledCourses[0]?.id || courses[0]?.id || ''
  );

  const courseTopics = topics.filter(
    (t) => t.courseId === selectedCourseId && t.status === 'published'
  );

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    courseTopics[0]?.id || null
  );

  const activeTopic = topics.find((t) => t.id === selectedTopicId) || courseTopics[0];

  // Active learning style strictly locked to student's dominant style
  const activeStyleTab: LearningStyle = student?.learningStyle || 'visual';

  // Student quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Kinesthetic checklist state
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});

  // Audio synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // AI Tutor state
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [isTutorThinking, setIsTutorThinking] = useState(false);
  const [tutorChat, setTutorChat] = useState<Array<{ sender: 'student' | 'tutor'; text: string }>>([
    {
      sender: 'tutor',
      text: `¡Hola ${student?.name.split(' ')[0] || ''}! Soy tu Tutor IA adaptado a tu estilo de aprendizaje ${student?.learningStyle.toUpperCase() || 'PERSONALIZADO'}. ¿Tienes alguna duda sobre este tema?`,
    },
  ]);

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No hay estudiante activo seleccionado.</p>
      </div>
    );
  }

  const studentStyleMeta = LEARNING_STYLES[student.learningStyle];
  const activeStyleData = activeTopic?.styles[activeStyleTab];
  const currentTopicProgress = activeTopic
    ? getStudentProgressForTopic(student.id, activeTopic.id)
    : undefined;

  const handleSelectTopic = (tId: string) => {
    setSelectedTopicId(tId);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setCheckedActions({});
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleSelectQuizOption = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleGradeQuiz = () => {
    if (!activeStyleData?.selfQuiz || !activeTopic) return;
    let score = 0;
    const total = activeStyleData.selfQuiz.length;

    activeStyleData.selfQuiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    // Save student progress in real-time
    updateStudentProgress(
      student.id,
      activeTopic.courseId,
      activeTopic.id,
      score,
      total,
      quizAnswers,
      true,
      8
    );

    if (score >= total - 1) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handlePlayAudio = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuestion.trim()) return;

    const q = tutorQuestion.trim();
    setTutorChat((prev) => [...prev, { sender: 'student', text: q }]);
    setTutorQuestion('');
    setIsTutorThinking(true);

    const answer = await askAITutor({
      studentName: student.name,
      learningStyle: student.learningStyle,
      topicTitle: activeTopic?.topicTitle || 'Tema General',
      question: q,
      resourceContext: activeStyleData || {},
      apiKey: teacher.apiKey,
    });

    setIsTutorThinking(false);
    setTutorChat((prev) => [...prev, { sender: 'tutor', text: answer }]);
  };

  const toggleAction = (idx: number) => {
    setCheckedActions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-2xs"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portal del Estudiante</span>
              <span
                className="px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5"
                style={{
                  backgroundColor: `${studentStyleMeta.color}15`,
                  color: studentStyleMeta.color,
                  border: `1px solid ${studentStyleMeta.color}30`
                }}
              >
                {student.learningStyle === 'visual' && <Eye className="w-3.5 h-3.5" />}
                {student.learningStyle === 'auditivo' && <Headphones className="w-3.5 h-3.5" />}
                {student.learningStyle === 'kinestesico' && <Flame className="w-3.5 h-3.5" />}
                {student.learningStyle === 'lectoescritura' && <FileText className="w-3.5 h-3.5" />}
                Estilo {studentStyleMeta.name}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">¡Hola, {student.name}!</h2>
            <p className="text-xs text-slate-500">
              Tus recursos están adaptados a tu forma única de procesar la información.
            </p>
          </div>
        </div>

        {/* Switch active student if testing different profiles */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Cambiar Estudiante:</span>
          <select
            value={student.id}
            onChange={(e) => setActiveStudentId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({LEARNING_STYLES[s.learningStyle].shortName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {enrolledCourses.map((course) => (
          <button
            key={course.id}
            onClick={() => {
              setSelectedCourseId(course.id);
              const firstTopic = topics.find((t) => t.courseId === course.id && t.status === 'published');
              if (firstTopic) handleSelectTopic(firstTopic.id);
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold border transition-all flex items-center gap-2 ${
              selectedCourseId === course.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{course.name}</span>
            <span className="text-[10px] opacity-80">({course.grade})</span>
          </button>
        ))}
      </div>

      {/* Main Content Layout: Sidebar of Topics + Topic Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Topics list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Temas Publicados ({courseTopics.length})</span>
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </h3>

            {courseTopics.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                El docente aún no ha publicado temas en este curso.
              </p>
            ) : (
              <div className="space-y-2">
                {courseTopics.map((topic) => {
                  const isSelected = activeTopic?.id === topic.id;
                  const progress = getStudentProgressForTopic(student.id, topic.id);

                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic.id)}
                      className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-600 shadow-2xs ring-1 ring-indigo-600'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className={`font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-900'}`}>
                          {topic.topicTitle}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {topic.styles[student.learningStyle]?.title}
                        </p>
                      </div>

                      {progress?.completed ? (
                        <span className="p-1 rounded bg-emerald-100 text-emerald-700 shrink-0" title="Completado">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="p-1 rounded bg-slate-200 text-slate-400 shrink-0">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Student's Study Tips Box */}
          <div className="p-5 rounded-xl bg-indigo-50/60 border border-indigo-200/70 text-xs space-y-3">
            <h4 className="font-bold text-indigo-950 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              Tus Consejos de Estudio ({studentStyleMeta.shortName}):
            </h4>
            <ul className="space-y-1.5 text-indigo-900/90 list-disc pl-4">
              {studentStyleMeta.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Reader: Active Topic Adapted Content */}
        <div className="lg:col-span-8 space-y-6">
          {activeTopic && activeStyleData ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Reader Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    Unidad Didáctica Adaptativa
                  </span>
                  {currentTopicProgress?.completed && (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tema Completado ({currentTopicProgress.quizScore}/{currentTopicProgress.quizTotal} pts)
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{activeTopic.topicTitle}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{activeStyleData.summary}</p>

                {/* Exclusive Learning Style Badge for this Student */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                    style={{
                      borderColor: `${studentStyleMeta.color}35`,
                      backgroundColor: `${studentStyleMeta.color}10`,
                      color: studentStyleMeta.color,
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: studentStyleMeta.color }} />
                    <span>Contenido Adaptado Exclusivamente para tu Estilo: <strong>{studentStyleMeta.name}</strong></span>
                  </div>
                </div>
              </div>

              {/* Reader Body */}
              <div className="p-6 space-y-6">
                {/* Visual View */}
                {activeStyleTab === 'visual' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        Esquema y Pasos Visuales
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeTopic.styles.visual.visualSteps?.map((step, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-lg bg-sky-50/50 border border-sky-200/70 space-y-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded bg-sky-600 text-white text-xs font-bold flex items-center justify-center">
                                {step.stepNumber || idx + 1}
                              </span>
                              <h5 className="font-bold text-slate-900 text-xs">{step.title}</h5>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {activeTopic.styles.visual.diagramAscii && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Mapa Conceptual Gráfico
                        </h4>
                        <pre className="p-4 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                          {activeTopic.styles.visual.diagramAscii}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Auditivo View */}
                {activeStyleTab === 'auditivo' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-slate-900 text-white space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Headphones className="w-5 h-5 text-purple-300" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-purple-300">Podcast Educativo</span>
                            <h4 className="font-bold text-sm text-white">
                              {activeTopic.styles.auditivo.podcastTitle}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const scriptText = activeTopic.styles.auditivo.dialogue
                            ?.map((d) => `${d.speaker}: ${d.text}`)
                            .join('. ');
                          handlePlayAudio(scriptText || '');
                        }}
                        className="px-3.5 py-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
                      >
                        {isPlayingAudio ? (
                          <>
                            <VolumeX className="w-4 h-4" />
                            Detener Voz
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" />
                            Escuchar Narración en Voz Alta
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Transcripción del Diálogo Pedagógico
                      </h4>
                      <div className="space-y-2">
                        {activeTopic.styles.auditivo.dialogue?.map((turn, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border text-xs leading-relaxed ${
                              turn.speaker.toLowerCase().includes('prof')
                                ? 'bg-purple-50/70 border-purple-200 text-purple-950'
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <strong className="block font-bold text-slate-900 mb-0.5">
                              🎙️ {turn.speaker}:
                            </strong>
                            <p className="text-slate-700">{turn.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {activeTopic.styles.auditivo.mnemonicRhyme && (
                      <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                        <p className="font-bold">🎵 Rima Mnemotécnica para memorizar:</p>
                        <p className="italic text-amber-800 mt-0.5">{activeTopic.styles.auditivo.mnemonicRhyme}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Kinestesico View */}
                {activeStyleTab === 'kinestesico' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 space-y-2.5">
                      <h4 className="font-bold text-orange-950 text-sm flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-600" />
                        {activeTopic.styles.kinestesico.experimentName}
                      </h4>
                      <div>
                        <p className="text-xs font-semibold text-orange-900 mb-1">Materiales requeridos:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {activeTopic.styles.kinestesico.materialsNeeded?.map((mat, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-white border border-orange-200 text-orange-900 text-xs rounded font-medium"
                            >
                              🧪 {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Lista Interactiva de Acciones (Marca las que completes):
                      </h4>
                      <div className="space-y-2">
                        {activeTopic.styles.kinestesico.stepByStepActions?.map((act, i) => {
                          const isDone = !!checkedActions[i];
                          return (
                            <div
                              key={i}
                              onClick={() => toggleAction(i)}
                              className={`p-3 rounded-lg border text-xs flex items-start gap-3 cursor-pointer transition-all ${
                                isDone
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 line-through text-slate-400'
                                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                              }`}
                            >
                              {isDone ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              )}
                              <span className="leading-relaxed">{act}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Lectoescritura View */}
                {activeStyleTab === 'lectoescritura' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        Notas Cornell & Conceptos Estructurados
                      </h4>
                      <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                        {activeTopic.styles.lectoescritura.cornellNotes?.map((cn, i) => (
                          <div key={i} className="grid grid-cols-1 md:grid-cols-3 text-xs">
                            <div className="p-3 bg-slate-50 font-bold text-slate-800 border-r border-slate-100">
                              ❓ {cn.cue}
                            </div>
                            <div className="p-3 md:col-span-2 bg-white text-slate-700 leading-relaxed">
                              {cn.notes}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {activeTopic.styles.lectoescritura.glossary && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Glosario Técnico
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {activeTopic.styles.lectoescritura.glossary.map((g, i) => (
                            <div key={i} className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-200 text-xs">
                              <span className="font-bold text-emerald-950 block mb-0.5">📖 {g.term}</span>
                              <p className="text-slate-700 leading-relaxed">{g.definition}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Interactive Self-Quiz */}
                {activeStyleData.selfQuiz && (
                  <div className="pt-6 border-t border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                        Autoevaluación Adaptativa ({activeStyleData.selfQuiz.length} preguntas)
                      </h4>
                      {quizSubmitted && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                          Tu Puntaje: {quizScore} / {activeStyleData.selfQuiz.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      {activeStyleData.selfQuiz.map((q, qIndex) => {
                        const selectedOption = quizAnswers[q.id];
                        const isCorrect = selectedOption === q.correctAnswer;

                        return (
                          <div
                            key={q.id}
                            className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5 text-xs"
                          >
                            <p className="font-bold text-slate-900">
                              {qIndex + 1}. {q.question}
                            </p>

                            <div className="space-y-1.5">
                              {q.options.map((opt, oIndex) => {
                                const isChosen = selectedOption === oIndex;
                                let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400';

                                if (quizSubmitted) {
                                  if (oIndex === q.correctAnswer) {
                                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                                  } else if (isChosen && !isCorrect) {
                                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                                  }
                                } else if (isChosen) {
                                  btnStyle = 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold ring-1 ring-indigo-500/30';
                                }

                                return (
                                  <button
                                    key={oIndex}
                                    type="button"
                                    onClick={() => handleSelectQuizOption(q.id, oIndex)}
                                    className={`w-full p-2.5 rounded-md border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="font-mono font-bold text-slate-500">
                                        {String.fromCharCode(65 + oIndex)})
                                      </span>
                                      <span>{opt}</span>
                                    </span>
                                    {quizSubmitted && oIndex === q.correctAnswer && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div
                                className={`p-2.5 rounded-md text-xs ${
                                  isCorrect
                                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                                }`}
                              >
                                <p className="font-bold">
                                  {isCorrect ? '✅ ¡Respuesta Correcta!' : '⚠️ Explicación:'}
                                </p>
                                <p className="mt-0.5">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!quizSubmitted && (
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleGradeQuiz}
                          disabled={
                            Object.keys(quizAnswers).length < activeStyleData.selfQuiz.length
                          }
                          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-xs transition-all"
                        >
                          Calificar Autoevaluación y Guardar Progreso
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500 text-xs">Selecciona un tema para comenzar a estudiar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Tutor Button & Drawer */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isTutorOpen ? (
          <button
            type="button"
            onClick={() => setIsTutorOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-lg flex items-center gap-2 text-xs font-bold border border-slate-700 transition-transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tutor IA ({studentStyleMeta.shortName})</span>
          </button>
        ) : (
          <div className="w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <div>
                  <h4 className="font-bold text-xs">Tutor IA Adaptativo</h4>
                  <p className="text-[10px] text-slate-400">
                    Explicaciones para estilo {studentStyleMeta.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTutorOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat message list */}
            <div className="p-3.5 space-y-2.5 h-64 overflow-y-auto bg-slate-50 text-xs">
              {tutorChat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-lg ${
                      msg.sender === 'student'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-2xs leading-relaxed'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTutorThinking && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-500 p-2 rounded-lg text-xs flex items-center gap-2">
                    <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    <span>Pensando...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleAskTutor} className="p-2.5 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={tutorQuestion}
                onChange={(e) => setTutorQuestion(e.target.value)}
                placeholder="Escribe tu duda..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isTutorThinking || !tutorQuestion.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-md"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
