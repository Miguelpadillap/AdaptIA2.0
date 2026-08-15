import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, LearningStyle } from '../../types';
import { LEARNING_STYLES } from '../../data/learningStylesData';
import {
  TrendingUp,
  Award,
  Clock,
  Users,
  CheckCircle2,
  BookOpen,
  Eye,
  Headphones,
  Flame,
  FileText,
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar,
  X,
  Target
} from 'lucide-react';

export const AnalyticsProgress: React.FC = () => {
  const {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    students,
    topics,
    progressList,
    getCourseProgressStats,
    getStudentsByCourse,
  } = useApp();

  const [courseFilter, setCourseFilter] = useState<string>(selectedCourseId || courses[0]?.id || 'all');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  const activeCourse = courses.find((c) => c.id === courseFilter);
  const relevantStudents = courseFilter === 'all'
    ? students
    : getStudentsByCourse(courseFilter);

  const relevantTopics = courseFilter === 'all'
    ? topics.filter((t) => t.status === 'published')
    : topics.filter((t) => t.courseId === courseFilter && t.status === 'published');

  const stats = courseFilter !== 'all' && activeCourse
    ? getCourseProgressStats(activeCourse.id)
    : {
        totalStudents: students.length,
        stylesCount: students.reduce(
          (acc, s) => {
            acc[s.learningStyle] = (acc[s.learningStyle] || 0) + 1;
            return acc;
          },
          { visual: 0, auditivo: 0, kinestesico: 0, lectoescritura: 0 } as Record<LearningStyle, number>
        ),
        averageScore: 92,
        completionRate: 85,
        totalPublishedTopics: relevantTopics.length,
      };

  const getStyleIcon = (style: LearningStyle) => {
    switch (style) {
      case 'visual': return <Eye className="w-4 h-4 text-sky-600" />;
      case 'auditivo': return <Headphones className="w-4 h-4 text-purple-600" />;
      case 'kinestesico': return <Flame className="w-4 h-4 text-orange-600" />;
      case 'lectoescritura': return <FileText className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Course Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Seguimiento Académico Personalizado en Tiempo Real
          </h2>
          <p className="text-xs text-slate-500">
            Monitorea el progreso, desempeño en autoevaluaciones y estilos de aprendizaje de tus alumnos
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Filtrar por Curso:</span>
          <select
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              if (e.target.value !== 'all') {
                setSelectedCourseId(e.target.value);
              }
            }}
            className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-md shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
          >
            <option value="all">Todos los Cursos</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.grade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Alumnos Inscritos</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalStudents}</div>
          <p className="text-[11px] text-slate-500">Con diagnóstico VARK completado</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tasa de Finalización</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.completionRate}%</div>
          <p className="text-[11px] text-slate-500">De los recursos publicados</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Promedio Quizzes</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.averageScore}%</div>
          <p className="text-[11px] text-slate-500">Dominio conceptual evaluado</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Recursos Publicados</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalPublishedTopics}</div>
          <p className="text-[11px] text-slate-500">Adaptados a 4 estilos</p>
        </div>
      </div>

      {/* Learning Styles Distribution Bar */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Distribución de Estilos de Aprendizaje en el Grupo
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Total diagnosticados: {relevantStudents.length}
          </span>
        </div>

        {/* Horizontal multi-color bar */}
        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          {(Object.keys(LEARNING_STYLES) as LearningStyle[]).map((styleKey) => {
            const count = stats.stylesCount[styleKey] || 0;
            const pct = relevantStudents.length > 0 ? (count / relevantStudents.length) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={styleKey}
                style={{ width: `${pct}%`, backgroundColor: LEARNING_STYLES[styleKey].color }}
                title={`${LEARNING_STYLES[styleKey].name}: ${count} (${Math.round(pct)}%)`}
                className="h-full transition-all"
              />
            );
          })}
        </div>

        {/* Legend grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {(Object.keys(LEARNING_STYLES) as LearningStyle[]).map((styleKey) => {
            const styleMeta = LEARNING_STYLES[styleKey];
            const count = stats.stylesCount[styleKey] || 0;
            const pct = relevantStudents.length > 0 ? Math.round((count / relevantStudents.length) * 100) : 0;
            return (
              <div key={styleKey} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: styleMeta.color }}
                >
                  {getStyleIcon(styleKey)}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{styleMeta.name}</span>
                  <span className="text-xs text-slate-500 font-medium">{count} alumnos ({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            Progreso Individual de Estudiantes ({relevantStudents.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">Actualizado en tiempo real</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Estudiante</th>
                <th className="py-3 px-4">Estilo Dominante</th>
                <th className="py-3 px-4">Temas Completados</th>
                <th className="py-3 px-4">Promedio Quizzes</th>
                <th className="py-3 px-4">Tiempo de Estudio</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {relevantStudents.map((student) => {
                const styleMeta = LEARNING_STYLES[student.learningStyle];
                const studentProgress = progressList.filter((p) => p.studentId === student.id);
                const completedCount = studentProgress.filter((p) => p.completed).length;
                const totalMinutes = studentProgress.reduce((sum, p) => sum + (p.timeSpentMinutes || 0), 0);

                let avgScore = 0;
                let countWithScore = 0;
                studentProgress.forEach((p) => {
                  if (p.quizTotal > 0) {
                    avgScore += (p.quizScore / p.quizTotal) * 100;
                    countWithScore += 1;
                  }
                });
                const finalAvg = countWithScore > 0 ? Math.round(avgScore / countWithScore) : 100;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            Inscrito: {new Date(student.enrolledAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: `${styleMeta.color}15`,
                          color: styleMeta.color,
                          border: `1px solid ${styleMeta.color}30`
                        }}
                      >
                        {getStyleIcon(student.learningStyle)}
                        {styleMeta.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{
                              width: `${relevantTopics.length > 0 ? (completedCount / relevantTopics.length) * 100 : 100}%`
                            }}
                          />
                        </div>
                        <span className="font-semibold text-slate-900">
                          {completedCount}/{relevantTopics.length || 1}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-xs ${
                          finalAvg >= 80
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : finalAvg >= 60
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {finalAvg}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {totalMinutes || 15} min
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentForModal(student)}
                        className="px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
                      >
                        Ver Diagnóstico
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Diagnostic Modal */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentForModal.avatar}
                  alt={selectedStudentForModal.name}
                  className="w-10 h-10 rounded-full border border-white/20 object-cover"
                />
                <div>
                  <h3 className="font-bold text-sm">{selectedStudentForModal.name}</h3>
                  <p className="text-xs text-slate-400">
                    Ficha Pedagógica de Aprendizaje Adaptativo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Dominant style badge */}
              <div
                className="p-4 rounded-lg border flex items-start gap-3"
                style={{
                  borderColor: `${LEARNING_STYLES[selectedStudentForModal.learningStyle].color}40`,
                  backgroundColor: `${LEARNING_STYLES[selectedStudentForModal.learningStyle].color}10`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: LEARNING_STYLES[selectedStudentForModal.learningStyle].color }}
                >
                  {getStyleIcon(selectedStudentForModal.learningStyle)}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Estilo de Aprendizaje Predominante
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {LEARNING_STYLES[selectedStudentForModal.learningStyle].name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {LEARNING_STYLES[selectedStudentForModal.learningStyle].description}
                  </p>
                </div>
              </div>

              {/* Breakdown percentages */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Desglose del Test Diagnóstico VARK:
                </h5>
                <div className="space-y-2">
                  {(Object.keys(LEARNING_STYLES) as LearningStyle[]).map((styleKey) => {
                    const pct = selectedStudentForModal.profile?.percentages[styleKey] || 0;
                    const styleMeta = LEARNING_STYLES[styleKey];
                    return (
                      <div key={styleKey} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700">{styleMeta.name}</span>
                          <span className="font-bold text-slate-900">{pct}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: styleMeta.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Teaching Tips for this student */}
              <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
                <p className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Recomendaciones Didácticas para el Docente:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-indigo-900/90">
                  {LEARNING_STYLES[selectedStudentForModal.learningStyle].tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
