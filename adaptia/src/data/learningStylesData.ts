import { LearningStyle, LearningStyleInfo } from '../types';

export const LEARNING_STYLES: Record<LearningStyle, LearningStyleInfo> = {
  visual: {
    id: 'visual',
    name: 'Visual / Espacial',
    shortName: 'Visual',
    tagline: 'Aprende mejor con esquemas, mapas mentales, diagramas y jerarquías gráficas.',
    color: '#0284c7', // Sky-600
    bgLight: 'bg-sky-50',
    borderLight: 'border-sky-200',
    textAccent: 'text-sky-700',
    iconName: 'Eye',
    description: 'Procesas la información de manera óptima cuando está organizada espacialmente, con códigos de color, diagramas de flujo e infografías conceptuales.',
    tips: [
      'Utiliza mapas conceptuales y notas con código de colores.',
      'Representa ideas complejas mediante diagramas de causa-efecto.',
      'Convierte listas de texto en esquemas o tablas visuales.'
    ]
  },
  auditivo: {
    id: 'auditivo',
    name: 'Auditivo / Sonoro',
    shortName: 'Auditivo',
    tagline: 'Aprende mejor escuchando explicaciones, podcasts, debates y ritmos mnemotécnicos.',
    color: '#7c3aed', // Violet-600
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-200',
    textAccent: 'text-purple-700',
    iconName: 'Headphones',
    description: 'Comprendes y retienes conceptos con mayor facilidad mediante el diálogo oral, debates guiados, analogías narradas y rimas o ritmos explicativos.',
    tips: [
      'Lee tus notas o resúmenes en voz alta como si dieras una clase.',
      'Escucha los guiones tipo podcast y graba tus propias reflexiones.',
      'Debate conceptos clave con tus compañeros o con el Tutor IA.'
    ]
  },
  kinestesico: {
    id: 'kinestesico',
    name: 'Kinestésico / Práctico',
    shortName: 'Kinestésico',
    tagline: 'Aprende mejor haciendo, experimentando, manipulando y resolviendo retos tangibles.',
    color: '#ea580c', // Orange-600
    bgLight: 'bg-orange-50',
    borderLight: 'border-orange-200',
    textAccent: 'text-orange-700',
    iconName: 'Sparkles',
    description: 'Tu aprendizaje es experiencial y dinámico: necesitas poner a prueba la teoría con experimentos, desafíos de acción real y simulaciones paso a paso.',
    tips: [
      'Realiza las actividades prácticas y experimentos antes de memorizar fórmulas.',
      'Aplica los conceptos a situaciones reales de tu vida cotidiana.',
      'Estudia haciendo pausas activas y construyendo prototipos o ejemplos físicos.'
    ]
  },
  lectoescritura: {
    id: 'lectoescritura',
    name: 'Lectoescritura / Analítico',
    shortName: 'Lectoescritura',
    tagline: 'Aprende mejor leyendo textos estructurados, tomando notas Cornell y consultando glosarios.',
    color: '#059669', // Emerald-600
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    textAccent: 'text-emerald-700',
    iconName: 'BookOpen',
    description: 'Destacas en el análisis textual profundo, la síntesis escrita estructurada, el método Cornell de apuntes y la precisión conceptual del vocabulario.',
    tips: [
      'Aplica el método Cornell (preguntas al margen, apuntes y resumen final).',
      'Reescribe las ideas clave con tus propias palabras.',
      'Elabora glosarios conceptuales con definiciones detalladas.'
    ]
  }
};
