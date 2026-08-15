import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import {
  Copy,
  Check,
  QrCode,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Users,
  X,
  Share2
} from 'lucide-react';

export const ShareCourseModal: React.FC = () => {
  const { shareModalCourse, setShareModalCourse, startJoinFlow } = useApp();
  const [copied, setCopied] = useState(false);

  if (!shareModalCourse) return null;

  // Build join URL
  const origin = window.location.origin;
  const joinUrl = `${origin}/?join=${shareModalCourse.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateStudentJoin = () => {
    const code = shareModalCourse.code;
    setShareModalCourse(null);
    startJoinFlow(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 rounded-lg backdrop-blur-xs">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Enlace Único de Inscripción</h3>
              <p className="text-xs text-indigo-100">{shareModalCourse.name}</p>
            </div>
          </div>
          <button
            onClick={() => setShareModalCourse(null)}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              <GraduationCap className="w-3.5 h-3.5" />
              Grado: {shareModalCourse.grade}
            </span>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Comparte este enlace con tus alumnos. Al entrar, realizarán el test pedagógico para descubrir su estilo de aprendizaje y quedarán inscritos automáticamente.
            </p>
          </div>

          {/* Link box */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              URL del curso para alumnos
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-md">
              <input
                type="text"
                readOnly
                value={joinUrl}
                className="w-full bg-transparent text-xs font-mono text-slate-800 outline-none px-2 select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code badge & QR mock */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-md border border-slate-200 text-slate-700 shadow-2xs">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Código de Acceso Rápido</p>
                <p className="text-sm font-mono font-bold text-slate-900 tracking-wider">
                  {shareModalCourse.code}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Activo
            </span>
          </div>

          {/* Action to test as student */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleSimulateStudentJoin}
              className="w-full py-2.5 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Probar enlace e iniciar Quiz como Alumno</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
