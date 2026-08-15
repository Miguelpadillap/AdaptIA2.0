import { DiagnosticQuestion, LearningStyle, LearningStyleScores, LearningStyleProfile } from '../types';

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    category: 'Resolución de problemas',
    scenario: 'Cuando compras un dispositivo nuevo o tienes que armar un mueble/juego...',
    question: '¿Cuál es tu primer impulso para entender cómo funciona?',
    options: [
      {
        style: 'visual',
        text: 'Miro los diagramas, planos con flechas o busco un video demostrativo.'
      },
      {
        style: 'auditivo',
        text: 'Prefiero que alguien me lo explique verbalmente o escuchar un audio/podcast tutorial.'
      },
      {
        style: 'kinestesico',
        text: 'Empiezo a armarlo directamente tocando las piezas y probando por ensayo y error.'
      },
      {
        style: 'lectoescritura',
        text: 'Leo el manual de instrucciones paso a paso de principio a fin.'
      }
    ]
  },
  {
    id: 2,
    category: 'Estudio y Repaso',
    scenario: 'Tienes un examen importante en dos días sobre un tema nuevo.',
    question: '¿Qué método te ayuda a recordar mejor los conceptos?',
    options: [
      {
        style: 'visual',
        text: 'Hacer mapas conceptuales, cuadros sinópticos y subrayar con marcadores de colores.'
      },
      {
        style: 'auditivo',
        text: 'Explicarme el tema a mí mismo en voz alta o debatir las preguntas con un compañero.'
      },
      {
        style: 'kinestesico',
        text: 'Crear tarjetas interactivas, hacer simulaciones o relacionar cada tema con una actividad física.'
      },
      {
        style: 'lectoescritura',
        text: 'Escribir resúmenes detallados, fichas de apuntes y releer mis notas de clase.'
      }
    ]
  },
  {
    id: 3,
    category: 'En el Aula de Clases',
    scenario: 'Durante una clase con el profesor...',
    question: '¿En qué momento sientes que comprendes más rápido?',
    options: [
      {
        style: 'visual',
        text: 'Cuando el profesor proyecta diapositivas con fotos, infografías o dibuja esquemas en la pizarra.'
      },
      {
        style: 'auditivo',
        text: 'Cuando el profesor cuenta una historia, modula su voz y abre un debate con preguntas en el aula.'
      },
      {
        style: 'kinestesico',
        text: 'Cuando hacemos un experimento en vivo, un taller práctico o un trabajo en equipo dinámico.'
      },
      {
        style: 'lectoescritura',
        text: 'Cuando proporciona lecturas claras, guías estructuradas y tiempo para tomar notas organizadas.'
      }
    ]
  },
  {
    id: 4,
    category: 'Orientación y Direcciones',
    scenario: 'Necesitas llegar a un lugar desconocido en la ciudad.',
    question: '¿Qué tipo de indicación prefieres?',
    options: [
      {
        style: 'visual',
        text: 'Ver el mapa con la ruta marcada en colores y fotos de los puntos de referencia.'
      },
      {
        style: 'auditivo',
        text: 'Que me den las instrucciones por voz: "Dobla a la izquierda en dos cuadras..."'
      },
      {
        style: 'kinestesico',
        text: 'Ir guiándome mientras camino o que alguien me acompañe a hacer el recorrido la primera vez.'
      },
      {
        style: 'lectoescritura',
        text: 'Tener una lista escrita con los nombres exactos de las calles y números de salida.'
      }
    ]
  },
  {
    id: 5,
    category: 'Memorización',
    scenario: 'Para memorizar un concepto científico o histórico difícil...',
    question: '¿Qué técnica te resulta más efectiva?',
    options: [
      {
        style: 'visual',
        text: 'Cerrar los ojos y visualizar la imagen mental de la página o el esquema.'
      },
      {
        style: 'auditivo',
        text: 'Inventar una rima, canción o repetir el concepto con un ritmo pegajoso.'
      },
      {
        style: 'kinestesico',
        text: 'Representar el concepto con gestos corporales o asociarlo a un objeto real.'
      },
      {
        style: 'lectoescritura',
        text: 'Copiar la definición varias veces hasta memorizar la redacción exacta.'
      }
    ]
  },
  {
    id: 6,
    category: 'Proyectos Escolares',
    scenario: 'Te asignan un proyecto libre para presentar a fin de trimestre.',
    question: '¿Qué formato de entrega elegirías con entusiasmo?',
    options: [
      {
        style: 'visual',
        text: 'Un póster digital ilustrado, una infografía interactiva o un cómic explicativo.'
      },
      {
        style: 'auditivo',
        text: 'Un podcast de audio, una entrevista simulada o una exposición oral.'
      },
      {
        style: 'kinestesico',
        text: 'Una maqueta funcional, un experimento en vivo o un juego de rol educativo.'
      },
      {
        style: 'lectoescritura',
        text: 'Un ensayo monográfico bien fundamentado con bibliografía y glosario técnico.'
      }
    ]
  },
  {
    id: 7,
    category: 'Concentración y Enfoque',
    scenario: 'Cuando estás leyendo o estudiando por tu cuenta...',
    question: '¿Qué factor te distrae más fácilmente?',
    options: [
      {
        style: 'visual',
        text: 'El desorden visual a mi alrededor, luces parpadeantes o movimientos en mi campo de visión.'
      },
      {
        style: 'auditivo',
        text: 'Ruidos repentinos, conversaciones de fondo o música con letra que me desconcentre.'
      },
      {
        style: 'kinestesico',
        text: 'Estar sentado inmóvil en la misma silla durante mucho tiempo sin poder moverme.'
      },
      {
        style: 'lectoescritura',
        text: 'Textos mal redactados, con faltas de ortografía o sin estructura de párrafos clara.'
      }
    ]
  },
  {
    id: 8,
    category: 'Enseñanza a Otros',
    scenario: 'Un amigo te pide que le enseñes un tema que tú dominas muy bien.',
    question: '¿Cómo inicias tu explicación?',
    options: [
      {
        style: 'visual',
        text: 'Haciéndole un dibujo, esquema o diagrama en una hoja en blanco.'
      },
      {
        style: 'auditivo',
        text: 'Explicándole la idea general con una conversación y haciéndole preguntas clave.'
      },
      {
        style: 'kinestesico',
        text: 'Poniéndole un ejercicio práctico para que lo resuelva conmigo paso a paso.'
      },
      {
        style: 'lectoescritura',
        text: 'Escribiéndole una lista estructurada con los puntos principales y definiciones.'
      }
    ]
  }
];

export function calculateLearningStyleProfile(answers: Record<number, LearningStyle>): LearningStyleProfile {
  const scores: LearningStyleScores = {
    visual: 0,
    auditivo: 0,
    kinestesico: 0,
    lectoescritura: 0,
  };

  const total = Object.keys(answers).length || 1;

  Object.values(answers).forEach((style) => {
    if (scores[style] !== undefined) {
      scores[style] += 1;
    }
  });

  // Calculate percentages
  const percentages: Record<LearningStyle, number> = {
    visual: Math.round((scores.visual / total) * 100),
    auditivo: Math.round((scores.auditivo / total) * 100),
    kinestesico: Math.round((scores.kinestesico / total) * 100),
    lectoescritura: Math.round((scores.lectoescritura / total) * 100),
  };

  // Determine dominant & secondary
  const sorted = (Object.keys(scores) as LearningStyle[]).sort(
    (a, b) => scores[b] - scores[a]
  );

  return {
    dominantStyle: sorted[0] || 'visual',
    secondaryStyle: sorted[1] || 'kinestesico',
    scores,
    percentages,
    totalQuestions: total,
    diagnosedAt: new Date().toISOString(),
  };
}
