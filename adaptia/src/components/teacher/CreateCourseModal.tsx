import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, GraduationCap, Sparkles, X, PlusCircle } from 'lucide-react';

export const CreateCourseModal: React.FC = () => {
  const { isCreateCourseModalOpen, setIsCreateCourseModalOpen, createCourse, setShareModalCourse } = useApp();
  const [grade, setGrade] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isCreateCourseModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grade.trim()) {
      setError('Por favor indica el grado o nivel del curso.');
      return;
    }
    if (!name.trim()) {
      setError('Por favor ingresa el nombre de la asignatura o materia.');
      return;
    }

    const newCourse = createCourse(grade.trim(), name.trim(), description.trim());
    setIsCreateCourseModalOpen(false);
    setGrade('');
    setName('');
    setDescription('');
    setError('');

    // Automatically open share modal with the newly created unique URL!
    setShareModalCourse(newCourse);
  };

  const sampleGrades = [
    '5° de Primaria',
    '6° de Primaria',
    '7° Básico / 1° Secundaria',
    '8° Básico / 2° Secundaria',
    '3° Secundaria',
    '10° / 1° Medio Preparatoria',
    '11° / 2° Medio Bachillerato'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Crear Nuevo Curso</h3>
              <p className="text-xs text-slate-500">Genera automáticamente un enlace único de inscripción para tus alumnos</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateCourseModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Grado del curso */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              Grado / Nivel Escolar <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={grade}
              onChange={(e) => {
                setGrade(e.target.value);
                setError('');
              }}
              placeholder="Ej: 8° Básico, 5° Primaria, 3° Secundaria"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 transition-all"
            />
            {/* Quick badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sampleGrades.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 transition-colors font-medium"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Nombre del curso */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              Nombre del Curso o Materia <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Ej: Ciencias Naturales y Ecosistemas, Física Mecánica, Historia Universal"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 transition-all"
            />
          </div>

          {/* Descripción opcional */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Descripción u Objetivos del Curso <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve resumen de los contenidos y metas de aprendizaje..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 transition-all"
            />
          </div>

          {/* Automatic link prompt preview */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-200/60 rounded-lg text-xs text-indigo-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              Al hacer clic en <strong>Crear Curso</strong>, adaptIA generará de inmediato un enlace único para que tus alumnos respondan el test de estilo de aprendizaje y se inscriban automáticamente.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsCreateCourseModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Crear Curso y Obtener Enlace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
