
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
