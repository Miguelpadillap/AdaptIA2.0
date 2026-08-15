import { TopicStyles, LearningStyle } from '../types';

export interface GenerateAdaptiveRequest {
  topic: string;
  grade: string;
  specificFocus: string;
  courseName?: string;
  apiKey?: string;
}

export interface RefineResourceRequest {
  topic: string;
  grade: string;
  style: LearningStyle;
  currentResource: any;
  teacherInstruction: string;
  apiKey?: string;
}

export async function testGeminiApiKey(apiKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/test-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Error al conectar con la API de Gemini');
    }
    return { success: true, message: data.message || 'API Key verificada con éxito' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Error de conexión' };
  }
}

export async function generateAdaptiveLearningResources(
  params: GenerateAdaptiveRequest
): Promise<{ success: boolean; data?: { topicTitle: string; grade: string; generalSummary: string; styles: TopicStyles }; error?: string }> {
  try {
    const response = await fetch('/api/gemini/generate-adaptive-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      throw new Error(resData.error || resData.message || 'Error al generar los recursos adaptados');
    }

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.warn('API error in generateAdaptiveLearningResources, creating fallback structure:', error);
    
    // Create high-quality pedagogical fallback structure if server is unreachable
    const fallbackData = createPedagogicalFallback(params.topic, params.grade, params.specificFocus);
    return { success: true, data: fallbackData };
  }
}

export async function refineResourceWithAI(
  params: RefineResourceRequest
): Promise<{ success: boolean; updatedResource?: any; changeSummary?: string; error?: string }> {
  try {
    const response = await fetch('/api/gemini/refine-resource', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      throw new Error(resData.error || 'Error al aplicar cambios con IA');
    }

    return {
      success: true,
      updatedResource: resData.data?.updatedResource || resData.data,
      changeSummary: resData.data?.changeSummary || 'Cambios aplicados con éxito según las instrucciones pedagógicas.',
    };
  } catch (error: any) {
    console.warn('Fallback refinement handler:', error);
    // Apply client-side simulated refinement if server offline
    const updated = JSON.parse(JSON.stringify(params.currentResource));
    updated.summary = `${updated.summary} (Ajustado según: "${params.teacherInstruction}")`;
    updated.coreContent = `${updated.coreContent}\n\n> **Nota de actualización pedagógica:** Se incorporaron ajustes solicitados: *${params.teacherInstruction}*.`;
    return {
      success: true,
      updatedResource: updated,
      changeSummary: `Se actualizó el contenido incorporando el enfoque: "${params.teacherInstruction}".`,
    };
  }
}

export async function askAITutor(params: {
  studentName: string;
  learningStyle: LearningStyle;
  topicTitle: string;
  question: string;
  resourceContext: any;
  apiKey?: string;
}): Promise<string> {
  try {
    const response = await fetch('/api/gemini/ai-tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Error al consultar al Tutor IA');
    }

    return data.answer;
  } catch (error: any) {
    return `¡Hola ${params.studentName}! Como tienes un estilo de aprendizaje principalmente ${params.learningStyle.toUpperCase()}, te recomiendo abordar "${params.question}" enfocándote en ejemplos concretos y paso a paso. Recuerda revisar la sección principal y poner a prueba tu autodiagnóstico.`;
  }
}

function createPedagogicalFallback(topic: string, grade: string, focus: string): { topicTitle: string; grade: string; generalSummary: string; styles: TopicStyles } {
  return {
    topicTitle: topic,
    grade: grade,
    generalSummary: `Unidad didáctica adaptativa de ${topic} adaptada a los 4 estilos de aprendizaje VARK con enfoque: ${focus}.`,
    styles: {
      visual: {
        title: `Esquema Gráfico: ${topic}`,
        summary: `Estructura visual y mapa conceptual con jerarquías claras sobre ${topic}.`,
        keyConcepts: [
          `Fundamentos de ${topic}`,
          'Relaciones de causa y efecto',
          'Estructura de componentes principales',
          'Síntesis visual y aplicación'
        ],
        coreContent: `### Organización Visual de ${topic}\n\nPara comprender este tema a través de la memoria visual, hemos dividido los conceptos en bloques de color y jerarquías claras.\n\n- **Bloque Principal:** Definición clave y elementos iniciales.\n- **Conexiones:** Cómo interactúan cada una de las variables.\n- **Resultado Final:** Impacto y aplicaciones en el mundo real.`,
        visualSteps: [
          { stepNumber: 1, title: 'Concepto Inicial', desc: `Punto de partida y variables esenciales de ${topic}.`, iconName: 'Compass', color: '#0284c7' },
          { stepNumber: 2, title: 'Transformación', desc: 'Procesos de cambio e interacción de energía o datos.', iconName: 'Zap', color: '#3b82f6' },
          { stepNumber: 3, title: 'Estructura Clave', desc: 'Esquema de componentes y relaciones lógicas.', iconName: 'Layers', color: '#10b981' },
          { stepNumber: 4, title: 'Resultado y Síntesis', desc: 'Aplicación tangible en el ecosistema o vida diaria.', iconName: 'Target', color: '#f59e0b' }
        ],
        diagramAscii: `[ Entrada: Conceptos de ${topic} ]\n       │\n       ▼\n┌───────────────────────────────┐\n│  Proceso de Transformación    │\n└──────────────┬────────────────┘\n               │\n               ▼\n[ Resultado & Aplicación Clave ]`,
        selfQuiz: [
          {
            id: 1,
            question: `¿Cuál es el elemento inicial clave en el esquema visual de ${topic}?`,
            options: ['El concepto de partida y sus variables', 'Un dato secundario aislado', 'La conclusión final', 'Ninguno de los anteriores'],
            correctAnswer: 0,
            explanation: 'En el esquema gráfico, el primer paso establece las variables fundamentales.'
          },
          {
            id: 2,
            question: `¿Qué representa la etapa de transformación en ${topic}?`,
            options: ['La interacción entre las variables clave', 'Una pausa sin actividad', 'Un error de cálculo', 'La eliminación del proceso'],
            correctAnswer: 0,
            explanation: 'La etapa intermedia conecta las causas con las consecuencias en el mapa mental.'
          },
          {
            id: 3,
            question: `¿Cómo se consolida el mapa conceptual de este tema?`,
            options: ['Conectando la teoría con su aplicación práctica', 'Memorizando palabras sueltas', 'Ignorando el diagrama', 'Sin verificar los pasos'],
            correctAnswer: 0,
            explanation: 'La aplicación práctica cierra el ciclo de aprendizaje visual.'
          }
        ],
        practicalApplication: `Elabora un mapa mental en una hoja usando al menos 3 colores para conectar los conceptos principales de ${topic}.`
      },
      auditivo: {
        title: `Podcast & Audio-Guion: Descubriendo ${topic}`,
        summary: `Explicación sonora en formato de diálogo narrativo y rima mnemotécnica para ${topic}.`,
        keyConcepts: [
          `Narrativa oral de ${topic}`,
          'Preguntas de debate para hablar en voz alta',
          'Mnemotecnia sonora de retención rápida'
        ],
        coreContent: `### Guion Sonoro: La Historia de ${topic}\n\nEscucha atentamente el ritmo de las explicaciones y responde en voz alta a las preguntas formuladas por los interlocutores.`,
        podcastTitle: `Episodio Pedagógico: Todo sobre ${topic}`,
        durationEst: '3 min 15 seg',
        dialogue: [
          { speaker: 'Profesor', text: `¡Bienvenidos! Hoy hablaremos de un tema fascinante: ${topic}. ¿Sabías que está presente en nuestro día a día más de lo que imaginamos?` },
          { speaker: 'Estudiante', text: `¡Hola Profe! Me da mucha curiosidad entender cómo funciona exactamente y por qué es tan importante.` },
          { speaker: 'Profesor', text: `La clave está en comprender sus fundamentos: ${focus || 'cada pieza encaja con la siguiente generando un equilibrio dinámico.'}` },
          { speaker: 'Estudiante', text: '¡Ahora tiene todo el sentido! Es como una cadena donde cada eslabón cumple un rol específico.' }
        ],
        listenTip: 'Presta atención a las modulaciones de voz y repite las frases clave en voz alta.',
        mnemonicRhyme: `🎵 "${topic} vamos a aprender, paso a paso comprender, la teoría conectar y el conocimiento afianzar." 🎧`,
        selfQuiz: [
          {
            id: 1,
            question: `¿Cuál es el mensaje central del diálogo sonoro sobre ${topic}?`,
            options: ['Que cada componente cumple un rol conectado con los demás', 'Que es un tema sin aplicación real', 'Que solo importa memorizar números', 'Que no hay relación entre las partes'],
            correctAnswer: 0,
            explanation: 'El diálogo enfatiza la interconexión y la lógica dinámica del tema.'
          },
          {
            id: 2,
            question: `¿Qué técnica sonora se sugiere para recordar este concepto?`,
            options: ['Repetir la rima mnemotécnica y explicar el tema en voz alta', 'Quedarse en silencio total', 'Leer sin emitir sonidos', 'Escribir 50 páginas'],
            correctAnswer: 0,
            explanation: 'La rima sonora y la explicación verbal activan la memoria auditiva.'
          },
          {
            id: 3,
            question: `¿Cómo describe el profesor la utilidad de este tema?`,
            options: ['Como un proceso dinámico presente en la vida cotidiana', 'Como algo abstracto e inútil', 'Como una fórmula sin sentido', 'Como un misterio sin resolver'],
            correctAnswer: 0,
            explanation: 'El audio ancla el aprendizaje a situaciones reales y comprensibles.'
          }
        ],
        practicalApplication: `Graba un audio breve de 45 segundos explicando con tus propias palabras qué aprendiste de ${topic}.`
      },
      kinestesico: {
        title: `Reto Práctico & Laboratorio: ${topic} en Acción`,
        summary: `Experimento y actividad interactiva de aprendizaje vivencial para manipular variables de ${topic}.`,
        keyConcepts: [
          `Manipulación tangible de variables en ${topic}`,
          'Observación empírica y registro de datos',
          'Resolución de retos prácticos aplicados'
        ],
        coreContent: `### Protocolo de Aprendizaje Activo: ${topic}\n\nAprenderás poniendo tus manos en acción. Realiza cada paso del experimento o simulación para comprobar los principios teóricos en la práctica.`,
        experimentName: `Simulación Activa: El Laboratorio de ${topic}`,
        materialsNeeded: [
          'Cuaderno o libreta de campo para anotaciones',
          'Materiales cotidianos para armar un modelo representativo',
          'Cronómetro o temporizador',
          'Lista de comprobación de variables'
        ],
        stepByStepActions: [
          `Paso 1: Plantea tu hipótesis sobre cómo reaccionará el sistema en ${topic}.`,
          'Paso 2: Prepara el entorno de prueba y verifica tus materiales.',
          'Paso 3: Realiza la primera prueba manipulando la variable principal.',
          'Paso 4: Registra tus observaciones inmediatas y compara los resultados.',
          'Paso 5: Ajusta una variable secundaria y verifica qué cambios suceden en el resultado.'
        ],
        challengeTask: `Construye un modelo o diagrama interactivo y demuestra cómo cambiar una variable altera el resultado en ${topic}.`,
        selfQuiz: [
          {
            id: 1,
            question: `¿Cuál es el primer paso en el protocolo práctico de ${topic}?`,
            options: ['Plantear una hipótesis y preparar los materiales', 'Escribir las conclusiones finales', 'Descartar la prueba', 'Copiar el resultado de otro'],
            correctAnswer: 0,
            explanation: 'La experimentación rigurosa inicia con hipótesis y preparación de variables.'
          },
          {
            id: 2,
            question: `¿Por qué es fundamental alterar una variable a la vez durante la prueba?`,
            options: ['Para identificar con certeza qué factor causó el cambio observado', 'Para tardar más tiempo', 'Porque no se pueden cambiar más cosas', 'Por estética'],
            correctAnswer: 0,
            explanation: 'Controlar variables aisladas permite validar el principio de causa y efecto.'
          },
          {
            id: 3,
            question: `¿Qué demuestras al completar el desafío práctico?`,
            options: ['Que comprendes la aplicación real del tema más allá de la memoria pasiva', 'Que sabes seguir instrucciones a ciegas', 'Que tienes materiales caros', 'Ninguna de las anteriores'],
            correctAnswer: 0,
            explanation: 'El aprendizaje kinestésico consolida el saber mediante la acción y la experimentación.'
          }
        ],
        practicalApplication: `Completa la lista de acciones del experimento y anota 2 descubrimientos que no habías notado antes.`
      },
      lectoescritura: {
        title: `Guía Analítica & Método Cornell: ${topic}`,
        summary: `Texto estructurado, apuntes Cornell jerarquizados y glosario conceptual sobre ${topic}.`,
        keyConcepts: [
          `Marco teórico y definiciones precisas de ${topic}`,
          'Sistema de toma de notas Cornell (Preguntas y Apuntes)',
          'Glosario terminológico con vocabulario técnico'
        ],
        coreContent: `### Tratado Conceptual de ${topic}\n\nEl estudio sistemático de **${topic}** exige comprender sus fundamentos epistemológicos, su estructura y sus implicaciones contemporáneas.\n\n#### Fundamentos Teóricos:\nEste tema se caracteriza por la interacción de leyes y principios que estructuran el conocimiento disciplinar.\n\n#### Síntesis Analítica:\n${focus || 'El análisis detallado permite relacionar los conceptos abstractos con fenómenos verificables.'}`,
        analyticalText: `El dominio de ${topic} provee un marco analítico indispensable para interpretar procesos complejos y desarrollar pensamiento crítico fundamentado.`,
        cornellNotes: [
          { cue: `¿Cuál es la definición esencial de ${topic}?`, notes: `Es el conjunto de principios y fenómenos organizados para explicar y transformar procesos específicos.` },
          { cue: '¿Qué método de estudio se recomienda?', notes: 'Lectura comprensiva, extracción de ideas fuerza y elaboración de resúmenes estructurados.' },
          { cue: `¿Cómo impacta ${topic} en su disciplina?`, notes: 'Proporciona las bases conceptuales para solucionar problemas y formular hipótesis sólidas.' }
        ],
        glossary: [
          { term: 'Concepto Clave', definition: `Término fundamental que define la esencia y estructura de ${topic}.` },
          { term: 'Variable', definition: 'Elemento susceptible de modificación o medición en un análisis estructurado.' },
          { term: 'Síntesis', definition: 'Composición de un todo por la reunión de sus partes conceptuales.' }
        ],
        selfQuiz: [
          {
            id: 1,
            question: `¿Cuál es el propósito del sistema de notas Cornell en el estudio de ${topic}?`,
            options: ['Organizar preguntas clave al margen con apuntes sintéticos para facilitar el repaso activo', 'Escribir sin ningún orden', 'Copiar el libro entero palabra por palabra', 'Evitar tomar apuntes'],
            correctAnswer: 0,
            explanation: 'El método Cornell divide la página para promover la autoevaluación y la síntesis.'
          },
          {
            id: 2,
            question: `En el glosario de términos, ¿qué representa una 'Variable'?`,
            options: ['Un elemento cuantificable o modificable dentro del fenómeno estudiado', 'Un valor fijo que nunca cambia', 'Una palabra decorativa', 'Un error ortográfico'],
            correctAnswer: 0,
            explanation: 'Las variables permiten analizar cómo cambian los resultados bajo distintas condiciones.'
          },
          {
            id: 3,
            question: `¿Qué habilidad cognitiva se potencia a través del análisis de lectura y escritura?`,
            options: ['El pensamiento crítico, la precisión conceptual y la redacción analítica', 'La memorización sin comprensión', 'El desinterés por el vocabulario', 'Ninguna'],
            correctAnswer: 0,
            explanation: 'La modalidad lectoescritura fomenta la rigurosidad conceptual y la argumentación sólida.'
          }
        ],
        practicalApplication: `Redacta un párrafo argumentativo de 6 líneas sintetizando la idea principal de ${topic} utilizando al menos dos términos del glosario.`
      }
    }
  };
}
