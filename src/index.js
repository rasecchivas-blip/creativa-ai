
const FRONTEND = "https://creativa-ai.rasec-chivas.workers.dev";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/generate") {
      if (request.headers.get("Origin") !== FRONTEND) {
        return json({ error: "Origen no autorizado." }, 403);
      }

      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders
        });
      }

      if (request.method !== "POST") {
        return json({ error: "Método no permitido." }, 405);
      }

      try {
        const data = await request.json();

        const idea = String(data.idea || "").trim();
        const module = data.module;
        const style = String(data.style || "Creativo");
        const length = data.length || "medium";

        if (!idea || idea.length > 5000) {
          return json({ error: "La idea debe tener entre 1 y 5000 caracteres." }, 400);
        }

        const tasks = {
          stories: "Escribe una historia original completa, con título, personajes, escenas, tensión narrativa y desenlace.",
          youtube: "Escribe un guion profesional de YouTube con título atractivo, gancho inicial, introducción, desarrollo, cierre y llamada a la acción.",
          social: "Escribe una publicación lista para redes sociales, con gancho, texto atractivo, emojis adecuados y llamada a la acción."
        };

        if (!tasks[module]) {
          return json({ error: "Módulo no válido." }, 400);
        }

        const sizes = {
          short: "Breve, directa y bien estructurada.",
          medium: "De extensión media, desarrollada y detallada.",
          long: "Extensa, profunda y con abundantes detalles."
        };

        const messages = [
          {
            role: "system",
            content: "Eres CREATIVA AI, un escritor profesional en español. Generas contenido original, natural, atractivo y terminado. Nunca entregues instrucciones en lugar del contenido solicitado."
          },
          {
            role: "user",
            content: `
TAREA: ${tasks[module]}

IDEA: ${idea}

ESTILO: ${style}

EXTENSIÓN: ${sizes[length] || sizes.medium}

Escribe directamente el contenido terminado.
No repitas simplemente la idea.
Mantén una estructura clara y una excelente narrativa.
`
          }
        ];

        const output = await env.AI.run(
          "@cf/google/gemma-4-26b-a4b-it",
          {
            messages,
            max_completion_tokens:
              length === "short" ? 700 :
              length === "long" ? 2200 : 1400,
            temperature: 0.8
          }
        );

        const content = output.response;

        if (!content) {
          throw new Error("La inteligencia artificial no devolvió texto.");
        }

        return json({ content });

      } catch (error) {
        console.error("CREATIVA AI:", error);
        return json({
          error: "No se pudo generar el contenido. Revisa la configuración del motor."
        }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  }
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API de generación de contenido
    if (url.pathname === "/api/generate") {
      if (request.method !== "POST") {
        return Response.json(
          { error: "Método no permitido" },
          { status: 405 }
        );
      }

      try {
        const data = await request.json();

        const { idea, module, style, length } = data;

        if (!idea || !idea.trim()) {
          return Response.json(
            { error: "Escribe una idea para comenzar." },
            { status: 400 }
          );
        }

        const modules = {
          stories: "Escribe una historia original, completa y atrapante, con personajes, escenas, desarrollo y final.",
          youtube: "Crea un guion profesional para YouTube con título atractivo, gancho inicial, introducción, desarrollo por escenas, cierre y llamada a la acción.",
          social: "Crea una publicación atractiva para redes sociales con un gancho inicial, texto persuasivo, emojis apropiados y llamada a la acción."
        };

        const instructions = modules[module];

        if (!instructions) {
          return Response.json(
            { error: "Módulo no válido." },
            { status: 400 }
          );
        }

        const lengths = {
          short: "Breve y directo.",
          medium: "Desarrollado, detallado y equilibrado.",
          long: "Extenso, profundo y con abundantes detalles."
        };

        const prompt = `
Eres CREATIVA AI, un escritor profesional
especializado en creación de contenido original.

TAREA:
${instructions}

IDEA DEL USUARIO:
${idea}

ESTILO:
${style || "Creativo"}

EXTENSIÓN:
${lengths[length] || lengths.medium}

REGLAS:
- Escribe contenido original y completo.
- No entregues instrucciones para escribir.
- No repitas la idea como sustituto del contenido.
- Utiliza español natural.
- Cuida la ortografía y la narrativa.
- Entrega directamente el contenido terminado.
`;

        const aiResult = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            prompt,
            max_tokens: 2048,
            temperature: 0.8
          }
        );

        const content =
          aiResult.response ||
          aiResult.result?.response;

        if (!content) {
          throw new Error("El modelo no devolvió contenido.");
        }

        return Response.json({ content });

      } catch (error) {
        console.error("Error CREATIVA AI:", error);

        return Response.json(
          { error: "No pudimos generar el contenido. Inténtalo nuevamente." },
          { status: 500 }
        );
      }
    }

    // Servir nuestra página web
    return env.ASSETS.fetch(request);
  }
};
