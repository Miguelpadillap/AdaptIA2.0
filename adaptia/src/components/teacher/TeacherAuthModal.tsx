import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Key, Mail, User, Lock, CheckCircle2, Sparkles, X, ShieldCheck } from 'lucide-react';

export const TeacherAuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { teacher, updateTeacher } = useApp();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [name, setName] = useState(teacher.name);
  const [email, setEmail] = useState(teacher.email);
  const [password, setPassword] = useState('••••••••');
  const [apiKey, setApiKey] = useState(teacher.apiKey || '');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacher({
      name: name.trim() || 'Profesor adaptIA',
      email: email.trim() || 'profesor@colegio.edu',
      apiKey: apiKey.trim(),
    });
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {isLoginMode ? 'Iniciar Sesión Docente' : 'Registro de Docente adaptIA'}
              </h3>
              <p className="text-xs text-slate-400">
                {isLoginMode ? 'Accede a tus cursos y aulas' : 'Crea tu cuenta de profesor con API Key'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {successMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">¡Datos del docente guardados correctamente!</span>
            </div>
          )}

          {!isLoginMode && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Nombre Completo</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Prof. Roberto Morales"
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Correo Institucional / Personal</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="profesor@colegio.edu"
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Contraseña</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 font-mono"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Teacher API Key */}
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                Tu Gemini API Key (Para consumo de tokens)
              </label>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy... (Opcional si usas clave del sistema)"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 font-mono"
            />
            <p className="text-[10px] text-slate-500">
              Todos los recursos y modificaciones consumirán los tokens de tu clave personal.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-xs text-indigo-600 hover:underline font-semibold"
            >
              {isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Iniciar Sesión'}
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              {isLoginMode ? 'Entrar' : 'Guardar y Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
