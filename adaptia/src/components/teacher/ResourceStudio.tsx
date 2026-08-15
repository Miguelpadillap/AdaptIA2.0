import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LearningStyle, TopicResource, TopicStyles } from '../../types';
import { LEARNING_STYLES } from '../../data/learningStylesData';
import { generateAdaptiveLearningResources, refineResourceWithAI } from '../../services/geminiService';
import {
  Sparkles,
  BookOpen,
  Send,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  RotateCw,
  Eye,
  Headphones,
  Flame,
  FileText,
  Volume2,
  VolumeX,
  MessageSquare,
  History,
  Layers,
  ArrowRight,
  Lightbulb,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

export const ResourceStudio: React.FC = () => {
  const {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    createTopicResource,
    updateTopicResourceStyle,
    publishTopicResource,
    topics,
    teacher,
  } = useApp();

  // Form states
  const [courseId, setCourseId] = useState<string>(selectedCourseId || courses[0]?.id || '');
  const [topicTitle, setTopicTitle] = useState('');
  const [specificFocus, setSpecificFocus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Active created / inspected topic
  const [activeTopicId, setActiveTopicId] = useState<string | null>(topics[0]?.id || null);
  const [activeStyleTab, setActiveStyleTab] = useState<LearningStyle>('visual');

  // "Cajita de Cambios" state
  const [changeInstruction, setChangeInstruction] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [refinementSuccessMsg, setRefinementSuccessMsg] = useState<string | null>(null);

  // Audio synthesis state for Auditivo preview
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Copy URL states
  const [copiedStyle, setCopiedStyle] = useState<string | null>(null);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState(false);

  const activeTopic = topics.find((t) => t.id === activeTopicId) || topics[0];
  const targetCourse = courses.find((c) => c.id === (activeTopic?.courseId || courseId)) || courses[0];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim()) return;

    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    setIsGenerating(true);
    setGenerationStep('Analizando enfoque pedagógico y nivel escolar...');

    try {
      setTimeout(() => setGenerationStep('Adaptando lenguaje VARK (Visual, Auditivo, Kinestésico, Lectoescritura)...'), 800);
      setTimeout(() => setGenerationStep('Generando autodiagnósticos y experimentos prácticos con Gemini...'), 1600);

      const result = await generateAdaptiveLearningResources({
        topic: topicTitle.trim(),
        grade: course.grade,
        specificFocus: specificFocus.trim() || 'Explicación completa con conceptos clave y ejemplos interactivos',
        courseName: course.name,
        apiKey: teacher.apiKey,
      });

      if (result.success && result.data) {
        const newTopic = createTopicResource(
          course.id,
          topicTitle.trim(),
          specificFocus.trim(),
          result.data.styles,
          false
        );
        setActiveTopicId(newTopic.id);
        setActiveStyleTab('visual');
        setTopicTitle('');
        setSpecificFocus('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleRefineWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeInstruction.trim() || !activeTopic) return;

    setIsRefining(true);
    setRefinementSuccessMsg(null);

    const currentStyleResource = activeTopic.styles[activeStyleTab];
    const course = courses.find((c) => c.id === activeTopic.courseId);

    const result = await refineResourceWithAI({
      topic: activeTopic.topicTitle,
      grade: course?.grade || 'General',
      style: activeStyleTab,
      currentResource: currentStyleResource,
      teacherInstruction: changeInstruction.trim(),
      apiKey: teacher.apiKey,
    });

    setIsRefining(false);

    if (result.success && result.updatedResource) {
      updateTopicResourceStyle(
        activeTopic.id,
        activeStyleTab,
        result.updatedResource,
        changeInstruction.trim(),
        result.changeSummary || 'Contenido adaptado según instrucciones.'
      );
      setRefinementSuccessMsg(result.changeSummary || '¡Modificación aplicada con éxito!');
      setChangeInstruction('');
      setTimeout(() => setRefinementSuccessMsg(null), 5000);
    }
  };

  const handlePublish = () => {
    if (!activeTopic) return;
    publishTopicResource(activeTopic.id);
    setPublishSuccessMsg(true);
    setTimeout(() => setPublishSuccessMsg(false), 4000);
  };

  const handleCopyStyleUrl = (style: LearningStyle) => {
    if (!activeTopic) return;
    const origin = window.location.origin;
    const styleUrl = `${origin}/recurso/${activeTopic.id}?estilo=${style}&curso=${activeTopic.courseId}`;
    navigator.clipboard.writeText(styleUrl);
    setCopiedStyle(style);
    setTimeout(() => setCopiedStyle(null), 2500);
  };

  // Text-to-speech for Auditory dialogue
  const handlePlayAudioNarration = (text: string) => {
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

  const activeStyleData = activeTopic?.styles[activeStyleTab];
  const styleInfo = LEARNING_STYLES[activeStyleTab];

  return (
    <div className="space-y-6">
      {/* Top Creation Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Estudio de Creación de Recursos Adaptativos
        </h2>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Topic Title */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Nombre del Tema <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                placeholder="Ej: Las Leyes de Newton y Fuerzas Cotidianas"
                className="w-full border border-slate-200 p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 transition-all"
              />
            </div>

            {/* Course Selector */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Curso al que va dirigido <span className="text-rose-500">*</span>
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full border border-slate-200 p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 transition-all font-medium bg-white"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.grade})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Explicit pedagogical focus div requested by user */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-500 uppercase block">
                Enfoque Pedagógico Específico y Abordaje del Tema
              </label>
              <span className="text-[10px] text-slate-400">¿Qué parte específica quieres tratar y cómo?</span>
            </div>
            <textarea
              rows={3}
              required
              value={specificFocus}
              onChange={(e) => setSpecificFocus(e.target.value)}
              placeholder="Especifica aquí la parte exacta del tema que deseas tratar (ej: 'Hacer énfasis en la primera ley de inercia y la tercera ley de acción-reacción, usar ejemplos de deportes como patinaje y fútbol, e incluir preguntas para reflexionar en clase')."
              className="w-full border border-slate-200 p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400 transition-all resize-y"
            />
          </div>

          {/* Quick presets for focus */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-medium text-slate-400">Ejemplos rápidos:</span>
            {[
              'Enfocarse en aplicaciones cotidianas y experimentos simples',
              'Comparar causas y consecuencias con analogías reales',
              'Explicar conceptos abstractos con lenguaje paso a paso para principiantes'
            ].map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSpecificFocus(preset)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
              >
                + {preset}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating || !topicTitle.trim()}
              className="w-full py-3 bg-slate-900 text-white rounded-md text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 shadow-sm disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>{generationStep || 'Generando adaptaciones con Gemini...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Generar Recursos Adaptativos para los 4 Estilos (VARK)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Topics Selector / List if multiple */}
      {topics.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Unidad Didáctica Seleccionada
              </h3>
              <p className="text-xs text-slate-500">
                Revisa cada adaptación por estilo, aplica modificaciones con IA y publica para tus alumnos
              </p>
            </div>

            {/* Quick Topic Pill selector */}
            <div className="flex flex-wrap gap-1.5">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTopicId(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
                    activeTopicId === t.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate max-w-[160px]">{t.topicTitle}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      t.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {activeTopic && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Unit Title Bar */}
              <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {targetCourse.name} • {targetCourse.grade}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 ${
                        activeTopic.status === 'published'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTopic.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {activeTopic.status === 'published' ? 'Publicado para Estudiantes' : 'Borrador en Revisión'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{activeTopic.topicTitle}</h3>
                  <p className="text-xs text-slate-600 italic">
                    Enfoque: "{activeTopic.specificFocus}"
                  </p>
                </div>

                {/* Publish Button */}
                <div className="flex items-center gap-3">
                  {publishSuccessMsg && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      ¡Publicado para tus estudiantes!
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handlePublish}
                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-all ${
                      activeTopic.status === 'published'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {activeTopic.status === 'published' ? 'Actualizar Publicación' : 'Publicar para Estudiantes'}
                  </button>
                </div>
              </div>

              {/* 4 Learning Styles URL Tabs (as requested) */}
              <div className="p-5 bg-slate-50/50 border-b border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  URLs Adaptadas por Estilo de Aprendizaje VARK:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(Object.keys(LEARNING_STYLES) as LearningStyle[]).map((styleKey) => {
                    const styleMeta = LEARNING_STYLES[styleKey];
                    const isSelected = activeStyleTab === styleKey;
                    const styleUrl = `${window.location.origin}/recurso/${activeTopic.id}?estilo=${styleKey}`;

                    return (
                      <div
                        key={styleKey}
                        onClick={() => setActiveStyleTab(styleKey)}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-white border-indigo-600 shadow-xs ring-1 ring-indigo-600'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: styleMeta.color }}
                            />
                            <span className="text-xs font-bold text-slate-900">
                              {styleMeta.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyStyleUrl(styleKey);
                            }}
                            title="Copiar URL específica"
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            {copiedStyle === styleKey ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* URL snippet */}
                        <div className="text-[10px] font-mono text-slate-500 truncate bg-slate-50 p-1.5 rounded border border-slate-100 mb-2 select-all">
                          {styleUrl}
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                          {activeTopic.styles[styleKey]?.summary || styleMeta.tagline}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Style Preview Content */}
              {activeStyleData && (
                <div className="p-6 space-y-6">
                  {/* Style Header Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-2xs"
                        style={{ backgroundColor: styleInfo.color }}
                      >
                        {activeStyleTab === 'visual' && <Eye className="w-5 h-5" />}
                        {activeStyleTab === 'auditivo' && <Headphones className="w-5 h-5" />}
                        {activeStyleTab === 'kinestesico' && <Flame className="w-5 h-5" />}
                        {activeStyleTab === 'lectoescritura' && <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Recurso Adaptado: {styleInfo.name}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">{activeStyleData.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyStyleUrl(activeStyleTab)}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        {copiedStyle === activeStyleTab ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            URL Copiada
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-slate-500" />
                            Copiar Enlace
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Visual Style Content */}
                  {activeStyleTab === 'visual' && (
                    <div className="space-y-6">
                      {/* Visual Steps Roadmap */}
                      {activeTopic.styles.visual.visualSteps && (
                        <div className="space-y-3">
                          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-indigo-600" />
                            Secuencia Visual de Aprendizaje
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {activeTopic.styles.visual.visualSteps.map((step, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-xs"
                              >
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="w-5 h-5 rounded bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                                    {step.stepNumber || idx + 1}
                                  </span>
                                  <span className="text-xs font-bold text-slate-900 truncate">
                                    {step.title}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ASCII / Graphic representation */}
                      {activeTopic.styles.visual.diagramAscii && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Diagrama de Flujo Conceptual
                          </h5>
                          <pre className="p-4 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                            {activeTopic.styles.visual.diagramAscii}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Auditivo Style Content */}
                  {activeStyleTab === 'auditivo' && (
                    <div className="space-y-6">
                      {/* Audio player simulator with Web Speech voice synthesis */}
                      <div className="p-4 rounded-lg bg-slate-900 text-white space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded bg-purple-500/20 text-purple-300">
                              <Headphones className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">Podcast Educativo Sonoro</p>
                              <h5 className="font-bold text-sm text-white">
                                {activeTopic.styles.auditivo.podcastTitle || 'Episodio Sonoro'}
                              </h5>
                            </div>
                          </div>
                          <span className="text-xs font-mono text-purple-200 bg-white/10 px-2 py-0.5 rounded">
                            {activeTopic.styles.auditivo.durationEst || '3:00 min'}
                          </span>
                        </div>

                        {/* Dialogue script player */}
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              const scriptText = activeTopic.styles.auditivo.dialogue
                                .map((d) => `${d.speaker}: ${d.text}`)
                                .join('. ');
                              handlePlayAudioNarration(scriptText);
                            }}
                            className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                              isPlayingAudio
                                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            }`}
                          >
                            {isPlayingAudio ? (
                              <>
                                <VolumeX className="w-4 h-4" />
                                Detener Narración
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-4 h-4" />
                                Reproducir con Voz IA (Web Speech)
                              </>
                            )}
                          </button>
                          <span className="text-[11px] text-slate-300">
                            {isPlayingAudio ? 'Reproduciendo audio...' : 'Escucha el guion con síntesis de voz en español'}
                          </span>
                        </div>
                      </div>

                      {/* Dialogue transcript */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Guion de Diálogo & Conversación Pedagógica
                        </h5>
                        <div className="space-y-2">
                          {activeTopic.styles.auditivo.dialogue?.map((turn, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border text-xs leading-relaxed ${
                                turn.speaker.toLowerCase().includes('prof')
                                  ? 'bg-purple-50/60 border-purple-200 text-purple-950'
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

                      {/* Mnemonic rhyme */}
                      {activeTopic.styles.auditivo.mnemonicRhyme && (
                        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">Rima Mnemotécnica para Memorización Sonora:</p>
                            <p className="italic text-amber-800 mt-0.5">{activeTopic.styles.auditivo.mnemonicRhyme}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Kinestesico Style Content */}
                  {activeStyleTab === 'kinestesico' && (
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 text-orange-950 space-y-2.5">
                        <div className="flex items-center gap-2 font-bold text-sm text-orange-900">
                          <Flame className="w-4 h-4 text-orange-600" />
                          {activeTopic.styles.kinestesico.experimentName || 'Laboratorio Experimental'}
                        </div>

                        {/* Materials */}
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-orange-900">Materiales y Variables Requeridas:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {activeTopic.styles.kinestesico.materialsNeeded?.map((mat, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-white border border-orange-200 text-orange-800 text-xs font-medium"
                              >
                                🧪 {mat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Step by step action protocol */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Protocolo de Acción Paso a Paso
                        </h5>
                        <div className="space-y-2">
                          {activeTopic.styles.kinestesico.stepByStepActions?.map((act, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-3 text-xs"
                            >
                              <span className="w-5 h-5 rounded bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                                {i + 1}
                              </span>
                              <p className="text-slate-700 leading-relaxed">{act}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lectoescritura Style Content */}
                  {activeStyleTab === 'lectoescritura' && (
                    <div className="space-y-6">
                      {/* Cornell Notes */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          Sistema de Notas Cornell
                        </h5>
                        <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                          {activeTopic.styles.lectoescritura.cornellNotes?.map((cn, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-3 text-xs">
                              <div className="p-3 bg-slate-50 font-semibold text-slate-800 border-r border-slate-100">
                                ❓ {cn.cue}
                              </div>
                              <div className="p-3 md:col-span-2 bg-white text-slate-700 leading-relaxed">
                                {cn.notes}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Glossary */}
                      {activeTopic.styles.lectoescritura.glossary && (
                        <div className="space-y-3">
                          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Glosario Terminológico Esencial
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {activeTopic.styles.lectoescritura.glossary.map((g, i) => (
                              <div key={i} className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-200 text-xs">
                                <span className="font-bold text-emerald-900 block mb-0.5">📖 {g.term}</span>
                                <p className="text-slate-700 leading-relaxed">{g.definition}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Self-assessment quiz preview */}
                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                      Preguntas de Autoevaluación Adaptadas ({activeStyleData.selfQuiz?.length || 0})
                    </h5>
                    <div className="space-y-3">
                      {activeStyleData.selfQuiz?.map((q, idx) => (
                        <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                          <p className="font-bold text-slate-900">{idx + 1}. {q.question}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className={`p-2 rounded border text-xs ${
                                  oIdx === q.correctAnswer
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                                    : 'bg-white border-slate-200 text-slate-600'
                                }`}
                              >
                                <span className="font-mono font-bold mr-1.5">{String.fromCharCode(65 + oIdx)})</span>
                                {opt}
                                {oIdx === q.correctAnswer && <span className="ml-1 text-[10px] text-emerald-600 font-bold">(Correcta)</span>}
                              </div>
                            ))}
                          </div>
                          <p className="text-[11px] text-slate-500 italic pt-1">
                            💡 Retroalimentación: {q.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explicit "Cajita de Cambios" required by user */}
                  <div className="pt-6 border-t border-slate-200">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-indigo-600" />
                          <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                            Cajita de Cambios con IA ({styleInfo.name})
                          </h5>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Gemini AI
                        </span>
                      </div>

                      {refinementSuccessMsg && (
                        <div className="p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{refinementSuccessMsg}</span>
                        </div>
                      )}

                      <form onSubmit={handleRefineWithAI} className="space-y-2">
                        <div className="flex gap-2">
                          <textarea
                            rows={2}
                            value={changeInstruction}
                            onChange={(e) => setChangeInstruction(e.target.value)}
                            placeholder={`Dile a la IA qué cambiar en la versión ${styleInfo.shortName} (ej: "Haz el lenguaje más accesible para 10 años", "Agrega una analogía con autos", "Añade una 4ta pregunta de opción múltiple")...`}
                            className="flex-1 text-xs p-2.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                          />
                          <button
                            type="submit"
                            disabled={isRefining || !changeInstruction.trim()}
                            className="p-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-md flex flex-col items-center justify-center gap-1 shadow-xs transition-colors shrink-0 px-4"
                          >
                            {isRefining ? (
                              <RotateCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            <span className="text-[10px] font-bold">{isRefining ? 'Ajustando...' : 'Aplicar'}</span>
                          </button>
                        </div>

                        {/* Revision History if available */}
                        {activeTopic.modificationHistory?.[activeStyleTab] &&
                          activeTopic.modificationHistory[activeStyleTab].length > 0 && (
                            <div className="pt-2 border-t border-slate-200 space-y-1.5">
                              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                                <History className="w-3 h-3 text-indigo-600" />
                                Historial de modificaciones ({activeTopic.modificationHistory[activeStyleTab].length}):
                              </span>
                              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                                {activeTopic.modificationHistory[activeStyleTab].map((h) => (
                                  <div
                                    key={h.id}
                                    className="text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200 flex items-start justify-between gap-2"
                                  >
                                    <div>
                                      <span className="text-indigo-900 font-semibold">"{h.prompt}"</span>
                                      <p className="text-slate-500 text-[10px]">{h.replySummary}</p>
                                    </div>
                                    <span className="text-[9px] text-slate-400 shrink-0">
                                      {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
