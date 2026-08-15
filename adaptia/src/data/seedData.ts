import { Teacher, Student, Course, TopicResource, StudentProgress } from '../types';

export const INITIAL_TEACHER: Teacher = {
  id: 'teacher-1',
  name: 'Prof. Carlos Mendoza',
  email: 'carlos.mendoza@colegio-innovar.edu',
  school: 'Colegio Experimental Nueva Era',
  apiKey: '',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: '2026-08-01T10:00:00Z',
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-bio-8',
    code: 'BIO-8A-701',
    name: 'Ciencias Naturales y Biología',
    grade: '8° Básico / Secundaria',
    description: 'Estudio de los seres vivos, ecosistemas, procesos celulares y biodiversidad.',
    teacherId: 'teacher-1',
    teacherName: 'Prof. Carlos Mendoza',
    createdAt: '2026-08-05T09:00:00Z',
    accentColor: '#0284c7', // Sky
  },
  {
    id: 'course-fis-10',
    code: 'FIS-10B-304',
    name: 'Física y Mecánica Clásica',
    grade: '10° Grado / Preparatoria',
    description: 'Leyes del movimiento de Newton, energía, gravedad y trabajo mecánico.',
    teacherId: 'teacher-1',
    teacherName: 'Prof. Carlos Mendoza',
    createdAt: '2026-08-10T14:30:00Z',
    accentColor: '#7c3aed', // Violet
  },
  {
    id: 'course-hist-6',
    code: 'HIST-6C-119',
    name: 'Historia Universal y Civilizaciones',
    grade: '6° Primaria',
    description: 'Grandes culturas de la antigüedad, rutas comerciales y evolución social.',
    teacherId: 'teacher-1',
    teacherName: 'Prof. Carlos Mendoza',
    createdAt: '2026-08-12T11:15:00Z',
    accentColor: '#059669', // Emerald
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'student-1',
    name: 'Sofía Morales',
    email: 'sofia.morales@estudiante.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['course-bio-8', 'course-fis-10'],
    learningStyle: 'visual',
    profile: {
      dominantStyle: 'visual',
      secondaryStyle: 'kinestesico',
      scores: { visual: 5, auditivo: 1, kinestesico: 2, lectoescritura: 0 },
      percentages: { visual: 63, auditivo: 12, kinestesico: 25, lectoescritura: 0 },
      totalQuestions: 8,
      diagnosedAt: '2026-08-06T11:20:00Z'
    },
    enrolledAt: '2026-08-06T11:20:00Z'
  },
  {
    id: 'student-2',
    name: 'Mateo Valenzuela',
    email: 'mateo.val@estudiante.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['course-bio-8'],
    learningStyle: 'auditivo',
    profile: {
      dominantStyle: 'auditivo',
      secondaryStyle: 'visual',
      scores: { visual: 2, auditivo: 4, kinestesico: 1, lectoescritura: 1 },
      percentages: { visual: 25, auditivo: 50, kinestesico: 12, lectoescritura: 13 },
      totalQuestions: 8,
      diagnosedAt: '2026-08-07T09:15:00Z'
    },
    enrolledAt: '2026-08-07T09:15:00Z'
  },
  {
    id: 'student-3',
    name: 'Valentina Rojas',
    email: 'valentina.rojas@estudiante.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['course-bio-8', 'course-hist-6'],
    learningStyle: 'kinestesico',
    profile: {
      dominantStyle: 'kinestesico',
      secondaryStyle: 'auditivo',
      scores: { visual: 1, auditivo: 2, kinestesico: 5, lectoescritura: 0 },
      percentages: { visual: 12, auditivo: 25, kinestesico: 63, lectoescritura: 0 },
      totalQuestions: 8,
      diagnosedAt: '2026-08-07T14:40:00Z'
    },
    enrolledAt: '2026-08-07T14:40:00Z'
  },
  {
    id: 'student-4',
    name: 'Lucas Benítez',
    email: 'lucas.benitez@estudiante.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['course-bio-8', 'course-fis-10'],
    learningStyle: 'lectoescritura',
    profile: {
      dominantStyle: 'lectoescritura',
      secondaryStyle: 'visual',
      scores: { visual: 2, auditivo: 0, kinestesico: 1, lectoescritura: 5 },
      percentages: { visual: 25, auditivo: 0, kinestesico: 12, lectoescritura: 63 },
      totalQuestions: 8,
      diagnosedAt: '2026-08-08T16:05:00Z'
    },
    enrolledAt: '2026-08-08T16:05:00Z'
  },
  {
    id: 'student-5',
    name: 'Camila Herrera',
    email: 'camila.herrera@estudiante.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['course-bio-8'],
    learningStyle: 'visual',
    profile: {
      dominantStyle: 'visual',
      secondaryStyle: 'lectoescritura',
      scores: { visual: 4, auditivo: 1, kinestesico: 1, lectoescritura: 2 },
      percentages: { visual: 50, auditivo: 12, kinestesico: 13, lectoescritura: 25 },
      totalQuestions: 8,
      diagnosedAt: '2026-08-09T10:11:00Z'
    },
    enrolledAt: '2026-08-09T10:11:00Z'
  }
];

export const INITIAL_TOPICS: TopicResource[] = [
  {
    id: 'topic-bio-fotosintesis',
    courseId: 'course-bio-8',
    teacherId: 'teacher-1',
    topicTitle: 'La Fotosíntesis y la Conversión de Energía',
    specificFocus: 'Hacer énfasis en la diferencia entre la fase luminosa (dependiente de luz) y la fase oscura (Ciclo de Calvin), explicar con ejemplos cotidianos cómo las plantas generan el oxígeno que respiramos y cómo el cambio climático impacta este ciclo.',
    status: 'published',
    createdAt: '2026-08-08T10:00:00Z',
    updatedAt: '2026-08-08T12:30:00Z',
    publishedAt: '2026-08-08T12:30:00Z',
    styles: {
      visual: {
        title: 'Mapa Visual: La Fábrica Solar de la Hoja',
        summary: 'Descubre el viaje de la luz y el agua a través de un esquema gráfico de los cloroplastos y sus dos fases energéticas.',
        keyConcepts: [
          'Cloroplasto y Tilacoides (Receptores solares)',
          'Fase Luminosa: Fotólisis del agua y liberación de O2',
          'Fase Oscura / Ciclo de Calvin: Fijación de CO2 en Glucosa',
          'Estomas: Puertas de intercambio gaseoso'
        ],
        coreContent: `### Estructura y Funcionamiento del Cloroplasto
Imagina la hoja de una planta como una **fábrica alimentada por energía solar**. Dentro de cada célula vegetal existen pequeños orgánulos verdes llamados **cloroplastos**.

#### 1. Esquema de Entradas y Salidas
- ☀️ **Entrada de Energía:** Fotones de luz solar absorbidos por el pigmento verde (**clorofila**).
- 💧 **Entrada de Materia Líquida:** Agua ($H_2O$) absorbida por las raíces y transportada por el xilema.
- 💨 **Entrada de Gas:** Dióxido de carbono ($CO_2$) capturado a través de los estomas microscópicos.
- 🍏 **Salida Principal:** Moléculas de Glucosa ($C_6H_{12}O_6$), el combustible vital de la planta.
- 💨 **Salida Vital para el Planeta:** Oxígeno ($O_2$) liberado a la atmósfera.`,
        visualSteps: [
          {
            stepNumber: 1,
            title: 'Captación Solar en Tilacoides',
            desc: 'Los fotones de luz impactan la clorofila, rompiendo moléculas de agua (H2O) y liberando oxígeno gaseoso.',
            iconName: 'Sun',
            color: '#eab308'
          },
          {
            stepNumber: 2,
            title: 'Transporte de Energía ATP y NADPH',
            desc: 'La energía lumínica se convierte en baterías químicas recargadas que viajan al estroma.',
            iconName: 'Zap',
            color: '#3b82f6'
          },
          {
            stepNumber: 3,
            title: 'Ciclo de Calvin en el Estroma',
            desc: 'El CO2 del aire es fijado y transformado usando la energía acumulada, sin necesidad directa de luz.',
            iconName: 'RotateCw',
            color: '#10b981'
          },
          {
            stepNumber: 4,
            title: 'Almacenamiento en Glucosa y Almidón',
            desc: 'Los azúcares resultantes nutren a la planta y alimentan a toda la cadena trófica terrestre.',
            iconName: 'Apple',
            color: '#ec4899'
          }
        ],
        diagramAscii: `[ Luz Solar ☀️ ] + [ Agua H2O 💧 ]
       │                   │
       ▼                   ▼
┌───────────────────────────────────────┐
│     FASE LUMINOSA (Tilacoides)        │ ──► [ Oxígeno O2 Libre 💨 ]
│  Genera: ATP + NADPH (Baterías)       │
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│     FASE OSCURA (Ciclo de Calvin)     │ ◄── [ Dióxido de Carbono CO2 ]
│  Ubicación: Estroma del Cloroplasto   │
└──────────────────┬────────────────────┘
                   │
                   ▼
         [ Glucosa C6H12O6 🍏 ]`,
        selfQuiz: [
          {
            id: 1,
            question: '¿En qué estructura específica del cloroplasto ocurre la fase luminosa?',
            options: [
              'En la membrana del núcleo celular',
              'En la membrana de los tilacoides',
              'En las raíces de la planta',
              'En la vacuola central'
            ],
            correctAnswer: 1,
            explanation: 'Correcto: La clorofila está incrustada en las membranas de los tilacoides, donde absorbe la luz solar y descompone el agua.'
          },
          {
            id: 2,
            question: '¿Qué molécula gaseosa se libera como subproducto durante la fotólisis del agua?',
            options: [
              'Dióxido de carbono (CO2)',
              'Metano (CH4)',
              'Oxígeno molecular (O2)',
              'Nitrógeno (N2)'
            ],
            correctAnswer: 2,
            explanation: '¡Excelente! Al romperse la molécula de H2O con energía solar, el hidrógeno se aprovecha y el oxígeno se libera al aire.'
          },
          {
            id: 3,
            question: '¿Cuál es el producto principal obtenido en el Ciclo de Calvin?',
            options: [
              'Glucosa (azúcar simple)',
              'Agua líquida pura',
              'Energía solar directa',
              'Monóxido de carbono'
            ],
            correctAnswer: 0,
            explanation: '¡Muy bien! El ciclo de Calvin fija los átomos de carbono del CO2 para ensamblar glucosa como reserva energética.'
          }
        ],
        practicalApplication: 'Dibuja en tu libreta o en una app gráfica un diagrama de flujo con 3 colores: Amarillo (Luz), Azul (Agua/Oxígeno) y Verde (CO2/Glucosa) para consolidar tu mapa mental.'
      },
      auditivo: {
        title: 'Podcast & Diálogo: La Respiración Inversa del Planeta',
        summary: 'Un episodio sonoro donde el Profe Carlos y la estudiante Camila debaten el misterio de cómo las hojas "comen luz".',
        keyConcepts: [
          'La melodía de los gases: CO2 entra, O2 sale',
          'El ritmo de dos fases: Día luminoso vs Noche estromal',
          'Mnemotecnia sonora de la reacción fotosintética'
        ],
        coreContent: `### Guion Sonoro: "El Secreto Verde en Audio"
**Duración estimada:** 3 minutos y medio de escucha activa.

Ponte los auriculares o activa la narración de voz. Cierra los ojos e imagina el murmullo de un bosque al amanecer.`,
        podcastTitle: 'Episodio 12: ¿De qué se alimentan los gigantes verdes?',
        durationEst: '3 min 30 seg',
        dialogue: [
          {
            speaker: 'Prof. Carlos',
            text: '¡Hola a todos! Hoy tengo una pregunta que parece sencilla: ¿Alguna vez te has preguntado cómo un árbol de 30 metros de altura puede aumentar cientos de kilos de madera comiendo solo aire y sol?'
          },
          {
            speaker: 'Estudiante Camila',
            text: '¡Profe! Siempre pensé que los árboles comían tierra por las raíces como si fuera una sopa de nutrientes.'
          },
          {
            speaker: 'Prof. Carlos',
            text: 'Ese es el gran error común. La tierra solo aporta minerales y agua. ¡La verdadera masa del árbol viene del aire invisible: del dióxido de carbono que captura cada día!'
          },
          {
            speaker: 'Estudiante Camila',
            text: '¡Increíble! ¿Y cómo logran atrapar un gas invisible para convertirlo en madera sólida?'
          },
          {
            speaker: 'Prof. Carlos',
            text: 'Con su fábrica de dos turnos: En el turno de día (fase luminosa), la luz rompe el agua como una tijera solar y suelta oxígeno. En el turno del ciclo de Calvin, usa esa energía para soldar átomos de carbono y formar azúcar.'
          }
        ],
        listenTip: 'Escucha con atención cómo cambia el tono cuando explicamos la diferencia entre fase de luz y fase de estroma.',
        mnemonicRhyme: '🎵 "Luz y agua en el tilacoide van, sueltan oxígeno y energía dan; luego en el estroma el carbono entrará, ¡y la rica glucosa la planta formará!" 🌿',
        selfQuiz: [
          {
            id: 1,
            question: 'Según el diálogo, ¿de dónde proviene la mayor parte de la masa sólida y madera de un árbol?',
            options: [
              'De la tierra que absorben las raíces',
              'Del dióxido de carbono capturado del aire',
              'De las hojas caídas en descomposición',
              'Del abono químico artificial'
            ],
            correctAnswer: 1,
            explanation: '¡Exacto! El carbono del aire se fija en cadenas de celulosa y glucosa que forman los troncos.'
          },
          {
            id: 2,
            question: 'En la rima mnemotécnica, ¿qué ocurre en el tilacoide?',
            options: [
              'Se destruye la clorofila',
              'Se absorbe luz y agua para soltar oxígeno',
              'Se cocina la glucosa final',
              'Se secan las hojas de la planta'
            ],
            correctAnswer: 1,
            explanation: '¡Muy bien memorizado con la rima! Tilacoides = Luz + Agua -> Oxígeno.'
          },
          {
            id: 3,
            question: '¿Por qué se llama al Ciclo de Calvin "independiente de la luz"?',
            options: [
              'Porque solo ocurre a oscuras en invierno',
              'Porque usa la energía química ya almacenada (ATP/NADPH) sin necesitar fotones directos',
              'Porque las plantas duermen durante el proceso',
              'Porque no consume energía alguna'
            ],
            correctAnswer: 1,
            explanation: '¡Excelente comprensión auditiva! No requiere fotones en ese instante preciso porque usa las baterías químicas cargadas previamente.'
          }
        ],
        practicalApplication: 'Graba una nota de voz de 60 segundos explicándole a un familiar la rima mnemotécnica y cómo las plantas purifican el aire.'
      },
      kinestesico: {
        title: 'Misión Experimental: Detectives de Oxígeno y Clorofila',
        summary: 'Pon a prueba la fotosíntesis con tus propias manos mediante un experimento de burbujeo vegetal en tiempo real.',
        keyConcepts: [
          'Producción de gas en vivo (Burbujas de O2)',
          'Factores limitantes: Distancia de la fuente de luz',
          'Manipulación de variables científicas'
        ],
        coreContent: `### Protocolo del Experimento: "Las Burbujas de la Vida"
Vamos a manipular variables reales para ver a una hoja producir oxígeno frente a nuestros ojos.

#### Lo que aprenderás haciendo:
Sentirás y medirás cómo la intensidad lumínica acelera directamente la tasa fotosintética.`,
        experimentName: 'El Detector de Burbujas de Elodea o Espinaca',
        materialsNeeded: [
          '1 vaso transparente con agua tibia',
          '1 pizca de bicarbonato de sodio (aporta CO2 disuelto)',
          'Hojas frescas de espinaca o ramita de elodea/planta acuática',
          '1 linterna de teléfono o lámpara de mesa',
          '1 cronómetro o reloj'
        ],
        stepByStepActions: [
          'Paso 1 (Preparación): Disuelve media cucharadita de bicarbonato en el vaso con agua para saturar el medio de CO2.',
          'Paso 2 (Montaje): Sumerge la hoja verde bien orientada hacia la superficie.',
          'Paso 3 (Activación lumínica): Acerca la linterna a solo 5 cm del vaso y enciende el cronómetro.',
          'Paso 4 (Observación y conteo): Tras 2 minutos, observa la base de la hoja: verás diminutas burbujas de oxígeno emergiendo a la superficie. Cuenta cuántas burbujas suben en 60 segundos.',
          'Paso 5 (Variación de distancia): Aleja la linterna a 30 cm. Vuelve a contar las burbujas por minuto. ¡Notarás la drástica reducción!'
        ],
        challengeTask: 'Crea una tabla con 3 columnas (Distancia de luz, Burbujas por minuto, Estado del agua) y saca una conclusión de acción.',
        selfQuiz: [
          {
            id: 1,
            question: '¿Por qué agregamos bicarbonato de sodio al agua del experimento?',
            options: [
              'Para cambiar el color del agua a verde',
              'Para suministrar dióxido de carbono (CO2) disuelto a la planta',
              'Para matar posibles bacterias',
              'Para enfriar el recipiente'
            ],
            correctAnswer: 1,
            explanation: '¡Exacto! El bicarbonato se disocia en iones aportando el CO2 necesario para la fase oscura.'
          },
          {
            id: 2,
            question: 'Al alejar la linterna de 5 cm a 30 cm, ¿qué observaste en el ritmo de burbujas?',
            options: [
              'Las burbujas salieron más rápido',
              'Las burbujas disminuyeron porque la intensidad de luz bajó',
              'La planta comenzó a flotar',
              'El agua se congeló'
            ],
            correctAnswer: 1,
            explanation: '¡Gran deducción práctica! Menos fotones de luz = menor fotólisis del agua y menor producción de O2.'
          },
          {
            id: 3,
            question: '¿Qué gas componía las burbujas que contaste saliendo de la hoja?',
            options: [
              'Gas nitrógeno',
              'Gas helio',
              'Oxígeno puro (O2)',
              'Humo'
            ],
            correctAnswer: 2,
            explanation: '¡Correcto! Es el oxígeno generado en la fase luminosa al romper la molécula de H2O.'
          }
        ],
        practicalApplication: 'Prueba tapar el vaso con un paño negro durante 5 minutos y comprueba si las burbujas se detienen por completo.'
      },
      lectoescritura: {
        title: 'Monografía & Método Cornell: Bioquímica de la Fotosíntesis',
        summary: 'Análisis conceptual riguroso con sistema de notas Cornell, glosario terminológico y síntesis escrita.',
        keyConcepts: [
          'Ecuación química balanceada: 6CO2 + 6H2O + Luz -> C6H12O6 + 6O2',
          'ATP sintasa y gradiente electroquímico',
          'RubisCO: la enzima fijadora de carbono'
        ],
        coreContent: `### Tratado Teórico: La Transformación Fotoquímica
La **fotosíntesis** es el proceso anabólico primordial de la biosfera mediante el cual los organismos fotoautótrofos convierten energía electromagnética (radiación solar) en energía potencial química almacenada en enlaces de carbohidratos.

#### Reacción Global Balanceada:
$$6CO_2 + 6H_2O + \\text{Luz (Fotones)} \\xrightarrow{\\text{Clorofila}} C_6H_{12}O_6 + 6O_2$$

#### Análisis de las Etapas Bioquímicas:
1. **Fase Fotoquímica (Dependiente de Luz):** Localizada en la membrana tilacoidal. Ocurre la excitación de los fotosistemas I y II, la fotólisis del agua y la fotofosforilación acíclica que sintetiza ATP y NADPH.
2. **Fase Biosintética o Ciclo de Calvin (Independiente de Luz):** Ocurre en el estroma soluble. La enzima **RubisCO** cataliza la carboxilación de la ribulosa-1,5-bisfosfato (RuBP), originando 3-fosfoglicerato que posteriormente se reduce a triosas fosfato y glucosa.`,
        analyticalText: `El impacto de este proceso es doble: sustenta las redes tróficas globales al proveer materia orgánica a los heterótrofos y mantiene la concentración atmosférica de oxígeno (~21%), protegiendo a la Tierra con la capa de ozono (O3).`,
        cornellNotes: [
          {
            cue: '¿Dónde ocurre la fotólisis?',
            notes: 'En el complejo del lumen del fotosistema II dentro de la membrana tilacoidal del cloroplasto.'
          },
          {
            cue: '¿Qué rol juega la RubisCO?',
            notes: 'Es la enzima más abundante del planeta; fija el carbono inorgánico del CO2 en moléculas orgánicas en el estroma.'
          },
          {
            cue: '¿Por qué el cambio climático afecta el ciclo?',
            notes: 'El aumento excesivo de temperatura y sequías obliga a las plantas a cerrar sus estomas para evitar deshidratación, bloqueando la entrada de CO2 y frenando la fotosíntesis.'
          }
        ],
        glossary: [
          {
            term: 'Clorofila',
            definition: 'Pigmento fotorreceptor con un anillo de porfirina que contiene un átomo central de magnesio, responsable de absorber longitudes de onda azules y rojas.'
          },
          {
            term: 'Estoma',
            definition: 'Poro microscópico delimitado por células oclusivas en la epidermis foliar que regula el intercambio de vapor de agua y gases.'
          },
          {
            term: 'RubisCO',
            definition: 'Ribulosa-1,5-bisfosfato carboxilasa-oxigenasa, enzima central del ciclo de Calvin.'
          },
          {
            term: 'Tilacoide',
            definition: 'Saco membranoso aplanado dentro del cloroplasto donde se efectúan las reacciones fotoquímicas primarias.'
          }
        ],
        selfQuiz: [
          {
            id: 1,
            question: 'En la ecuación balanceada, ¿cuántas moléculas de CO2 y H2O se requieren para sintetizar una molécula de glucosa?',
            options: [
              '1 de CO2 y 1 de H2O',
              '6 de CO2 y 6 de H2O',
              '12 de CO2 y 3 de H2O',
              '2 de CO2 y 4 de H2O'
            ],
            correctAnswer: 1,
            explanation: '¡Excelente exactitud teórica! Se requieren exactamente 6 moléculas de dióxido de carbono y 6 de agua.'
          },
          {
            id: 2,
            question: '¿Cuál es la función principal de la enzima RubisCO descrita en las notas Cornell?',
            options: [
              'Fijar el carbono del CO2 atmosférico a una molécula orgánica (RuBP)',
              'Romper las moléculas de clorofila',
              'Bombear agua desde el suelo',
              'Crear burbujas de oxígeno'
            ],
            correctAnswer: 0,
            explanation: '¡Correcto! RubisCO cataliza el primer paso decisivo del ciclo de fijación de carbono.'
          },
          {
            id: 3,
            question: '¿Qué consecuencia directa provoca el cierre de los estomas en días de sequía extrema?',
            options: [
              'Aumenta la absorción de luz solar',
              'Se impide la entrada de CO2 a la hoja, deteniendo el Ciclo de Calvin',
              'Se forman más cloroplastos',
              'La planta se reproduce rápidamente'
            ],
            correctAnswer: 1,
            explanation: '¡Brillante análisis analítico! Al cerrar los estomas para no perder agua, no puede entrar CO2 y la fotosíntesis decae.'
          }
        ],
        practicalApplication: 'Escribe un resumen de un párrafo (máximo 80 palabras) integrando los 4 términos del glosario con tus propias palabras.'
      }
    }
  }
];

export const INITIAL_PROGRESS: StudentProgress[] = [
  {
    studentId: 'student-1',
    courseId: 'course-bio-8',
    topicId: 'topic-bio-fotosintesis',
    completed: true,
    quizScore: 3,
    quizTotal: 3,
    quizAnswers: { 1: 1, 2: 2, 3: 0 },
    timeSpentMinutes: 14,
    lastAccessed: '2026-08-10T15:20:00Z',
    studentNotes: 'Me encantó el diagrama visual con los tres colores de la fase luminosa.'
  },
  {
    studentId: 'student-2',
    courseId: 'course-bio-8',
    topicId: 'topic-bio-fotosintesis',
    completed: true,
    quizScore: 3,
    quizTotal: 3,
    quizAnswers: { 1: 1, 2: 1, 3: 1 },
    timeSpentMinutes: 18,
    lastAccessed: '2026-08-11T10:45:00Z',
    studentNotes: 'La rima sonora fue muy fácil de memorizar.'
  },
  {
    studentId: 'student-3',
    courseId: 'course-bio-8',
    topicId: 'topic-bio-fotosintesis',
    completed: true,
    quizScore: 2,
    quizTotal: 3,
    quizAnswers: { 1: 1, 2: 1, 3: 2 },
    timeSpentMinutes: 25,
    lastAccessed: '2026-08-12T16:10:00Z',
    studentNotes: 'Hice el experimento del bicarbonato con espinaca y salieron burbujas reales.'
  },
  {
    studentId: 'student-4',
    courseId: 'course-bio-8',
    topicId: 'topic-bio-fotosintesis',
    completed: true,
    quizScore: 3,
    quizTotal: 3,
    quizAnswers: { 1: 1, 2: 0, 3: 1 },
    timeSpentMinutes: 21,
    lastAccessed: '2026-08-13T09:30:00Z',
    studentNotes: 'El glosario sobre la RubisCO y las notas Cornell me sirvieron para mi resumen.'
  },
  {
    studentId: 'student-5',
    courseId: 'course-bio-8',
    topicId: 'topic-bio-fotosintesis',
    completed: false,
    quizScore: 0,
    quizTotal: 3,
    quizAnswers: {},
    timeSpentMinutes: 4,
    lastAccessed: '2026-08-14T11:00:00Z'
  }
];
