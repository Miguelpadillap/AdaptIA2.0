import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to get Gemini client with teacher's key or server environment key
function getGeminiClient(customApiKey?: string): GoogleGenAI {
  const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No se ha configurado ninguna API Key de Gemini. Por favor proporciona tu API Key en la configuración de adaptIA.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Endpoint: Test API Key
app.post("/api/test-key", async (req, res) => {
  try {
    const { apiKey } = req.body;
    const client = getGeminiClient(apiKey);
    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: "Responde solo 'OK' si esta clave de API funciona correctamente.",
    });
    return res.json({ success: true, message: "API Key verificada con éxito", result: response.text?.trim() });
  } catch (error: any) {
    console.error("Error testing API key:", error);
    return res.status(400).json({
      success: false,
      message: error?.message || "La API Key de Gemini es inválida o expiró.",
    });
  }
});

// Endpoint: Generate Adaptive Learning Resources for all 4 styles
app.post("/api/gemini/generate-adaptive-content", async (req, res) => {
  try {
    const { topic, grade, specificFocus, courseName, apiKey } = req.body;

    if (!topic || !grade) {
      return res.status(400).json({ error: "El tema y el grado son obligatorios." });
    }

    const client = getGeminiClient(apiKey);

    const prompt = `
Eres adaptIA, un sistema pedagógico experto en diseño instruccional adaptativo y personalización educativa basada en el modelo VARK (Visual, Auditivo, Kinestésico, Lectoescritura).

Tu misión es crear una unidad didáctica completa para el tema: "${topic}".
- Curso: "${courseName || 'General'}"
- Grado/Nivel educativo: "${grade}"
- Enfoque pedagógico específico solicitado por el docente: "${specificFocus || 'Explicación completa, clara, con aplicaciones prácticas y ejemplos cotidianos.'}"

Debes generar 4 adaptaciones completas, rigurosas y creativas del contenido para cada uno de los 4 estilos de aprendizaje:
1. VISUAL:
   - Explicación con fuerte anclaje en analogías visuales, mapas conceptuales descritos paso a paso, código de colores pedagógico, y estructura gráfica.
   - Incluye 'visualSteps' (4 a 5 pasos visuales clave con icono sugerido y color).
   - Diagrama conceptual estructurado o representación gráfica en texto/ascii claro.

2. AUDITIVO:
   - Guion conversacional tipo podcast educativo o debate explicativo entre un profesor y un estudiante curioso o narrador entusiasta.
   - Ritmo narrativo, rimas mnemotécnicas o frases sonoras fáciles de recordar en voz alta.
   - Preguntas de debate para reflexionar y hablar en voz alta.

3. KINESTÉSICO / PRÁCTICO:
   - Experimento casero o simulación paso a paso con materiales comunes.
   - Actividad práctica interactiva de aprendizaje activo ("Aprender haciendo").
   - Desafío o misión tangible para aplicar el conocimiento manipulando variables.

4. LECTURA / ESCRITURA:
   - Texto analítico profundo, bien jerarquizado con subtítulos claros.
   - Formato Cornell Notes (preguntas clave al margen + apuntes sintéticos).
   - Glosario de 3 a 5 términos clave con definiciones precisas.

Cada estilo debe incluir:
- Un título atractivo adaptado al estilo.
- Un resumen pedagógico.
- 3 a 4 conceptos clave.
- Contenido principal enriquecido (con formato markdown de lectura fácil).
- Un autodiagnóstico interactivo (3 preguntas de opción múltiple con 4 opciones, índice de la respuesta correcta de 0 a 3, y explicación pedagógica).
- Un reto de aplicación práctica adaptado al estilo.
`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres un generador pedagógico experto. Devuelve SIEMPRE una respuesta JSON válida estrictamente estructurada en español.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topicTitle: { type: Type.STRING },
            grade: { type: Type.STRING },
            generalSummary: { type: Type.STRING },
            styles: {
              type: Type.OBJECT,
              properties: {
                visual: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                    coreContent: { type: Type.STRING },
                    visualSteps: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          stepNumber: { type: Type.INTEGER },
                          title: { type: Type.STRING },
                          desc: { type: Type.STRING },
                          iconName: { type: Type.STRING },
                          color: { type: Type.STRING }
                        },
                        required: ["stepNumber", "title", "desc", "iconName", "color"]
                      }
                    },
                    diagramAscii: { type: Type.STRING },
                    selfQuiz: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.INTEGER },
                          question: { type: Type.STRING },
                          options: { type: Type.ARRAY, items: { type: Type.STRING } },
                          correctAnswer: { type: Type.INTEGER },
                          explanation: { type: Type.STRING }
                        },
                        required: ["id", "question", "options", "correctAnswer", "explanation"]
                      }
                    },
                    practicalApplication: { type: Type.STRING }
                  },
                  required: ["title", "summary", "keyConcepts", "coreContent", "visualSteps", "selfQuiz", "practicalApplication"]
                },
                auditivo: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                    coreContent: { type: Type.STRING },
                    podcastTitle: { type: Type.STRING },
                    durationEst: { type: Type.STRING },
                    dialogue: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          speaker: { type: Type.STRING },
                          text: { type: Type.STRING }
                        },
                        required: ["speaker", "text"]
                      }
                    },
                    listenTip: { type: Type.STRING },
                    mnemonicRhyme: { type: Type.STRING },
                    selfQuiz: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.INTEGER },
                          question: { type: Type.STRING },
                          options: { type: Type.ARRAY, items: { type: Type.STRING } },
                          correctAnswer: { type: Type.INTEGER },
                          explanation: { type: Type.STRING }
                        },
                        required: ["id", "question", "options", "correctAnswer", "explanation"]
                      }
                    },
                    practicalApplication: { type: Type.STRING }
                  },
                  required: ["title", "summary", "keyConcepts", "coreContent", "podcastTitle", "dialogue", "mnemonicRhyme", "selfQuiz", "practicalApplication"]
                },
                kinestesico: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                    coreContent: { type: Type.STRING },
                    experimentName: { type: Type.STRING },
                    materialsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                    stepByStepActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    challengeTask: { type: Type.STRING },
                    selfQuiz: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.INTEGER },
                          question: { type: Type.STRING },
                          options: { type: Type.ARRAY, items: { type: Type.STRING } },
                          correctAnswer: { type: Type.INTEGER },
                          explanation: { type: Type.STRING }
                        },
                        required: ["id", "question", "options", "correctAnswer", "explanation"]
                      }
                    },
                    practicalApplication: { type: Type.STRING }
                  },
                  required: ["title", "summary", "keyConcepts", "coreContent", "experimentName", "materialsNeeded", "stepByStepActions", "challengeTask", "selfQuiz", "practicalApplication"]
                },
                lectoescritura: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                    coreContent: { type: Type.STRING },
                    analyticalText: { type: Type.STRING },
                    cornellNotes: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          cue: { type: Type.STRING },
                          notes: { type: Type.STRING }
                        },
                        required: ["cue", "notes"]
                      }
                    },
                    glossary: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          term: { type: Type.STRING },
                          definition: { type: Type.STRING }
                        },
                        required: ["term", "definition"]
                      }
                    },
                    selfQuiz: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.INTEGER },
                          question: { type: Type.STRING },
                          options: { type: Type.ARRAY, items: { type: Type.STRING } },
                          correctAnswer: { type: Type.INTEGER },
                          explanation: { type: Type.STRING }
                        },
                        required: ["id", "question", "options", "correctAnswer", "explanation"]
                      }
                    },
                    practicalApplication: { type: Type.STRING }
                  },
                  required: ["title", "summary", "keyConcepts", "coreContent", "analyticalText", "cornellNotes", "glossary", "selfQuiz", "practicalApplication"]
                }
              },
              required: ["visual", "auditivo", "kinestesico", "lectoescritura"]
            }
          },
          required: ["topicTitle", "grade", "generalSummary", "styles"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error generating adaptive content:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Error al procesar la solicitud de generación con IA.",
    });
  }
});

// Endpoint: Refine specific style resource based on Teacher's conversational feedback
app.post("/api/gemini/refine-resource", async (req, res) => {
  try {
    const { topic, grade, style, currentResource, teacherInstruction, apiKey } = req.body;

    if (!teacherInstruction || !currentResource || !style) {
      return res.status(400).json({ error: "Faltan parámetros requeridos para la modificación." });
    }

    const client = getGeminiClient(apiKey);

    const prompt = `
Eres adaptIA, asistente pedagógico para docentes.
El profesor está revisando la adaptación para el estilo: "${style.toUpperCase()}" del tema "${topic}" (Grado: ${grade}).

Contenido actual del recurso:
${JSON.stringify(currentResource, null, 2)}

Instrucción de cambio solicitada por el docente en la "Cajita de Cambios":
"${teacherInstruction}"

Aplica las modificaciones solicitadas con precisión, manteniendo la coherencia pedagógica con el estilo de aprendizaje ${style}. Devuelve el objeto del recurso actualizado con la misma estructura y un breve resumen del cambio realizado.
`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "Devuelve un JSON con 'updatedResource' (el recurso actualizado) y 'changeSummary' (1 o 2 oraciones explicando lo que se ajustó).",
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error refining resource:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Error al aplicar los cambios con IA.",
    });
  }
});

// Endpoint: Student AI Tutor
app.post("/api/gemini/ai-tutor", async (req, res) => {
  try {
    const { studentName, learningStyle, topicTitle, question, resourceContext, apiKey } = req.body;

    const client = getGeminiClient(apiKey);

    const prompt = `
Eres el Tutor IA de adaptIA. Estás hablando con ${studentName || 'el estudiante'}, cuyo estilo de aprendizaje diagnosticado es: ${learningStyle?.toUpperCase() || 'GENERAL'}.
El estudiante está estudiando el tema: "${topicTitle}".

Pregunta del estudiante:
"${question}"

Contexto del material educativo:
${typeof resourceContext === 'string' ? resourceContext : JSON.stringify(resourceContext)}

Instrucciones pedagógicas:
- Si el estudiante es VISUAL: Usa metáforas visuales, estructura clara con viñetas o esquemas descriptivos.
- Si el estudiante es AUDITIVO: Usa tono conversacional, ritmo, explicaciones como si le estuvieras hablando amistosamente.
- Si el estudiante es KINESTÉSICO: Usa ejemplos prácticos, analogías de acción física, pasos interactivos.
- Si el estudiante es LECTOESCRITURA: Usa definiciones precisas, citas estructuradas, listas analíticas.

Responde de forma concisa, cálida y muy clara (máximo 150-200 palabras).
`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    return res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error("Error with AI tutor:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Error al comunicarse con el Tutor IA.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[adaptIA] Server running on http://localhost:${PORT}`);
  });
}

startServer();
