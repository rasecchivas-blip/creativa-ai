
const modules = {
  stories: {
    name: "Historias",
    placeholder: "Ejemplo: Un pueblo abandonado donde cada noche se escuchan voces...",
    styles: ["Terror", "Misterio", "Suspenso", "Ficción", "Leyenda", "Drama"]
  },
  youtube: {
    name: "Guiones para YouTube",
    placeholder: "Ejemplo: Quiero un video sobre la historia de un videojuego clásico...",
    styles: ["Documental", "Narrativo", "Terror", "Educativo", "Entretenimiento", "Top 10"]
  },
  social: {
    name: "Contenido para redes",
    placeholder: "Ejemplo: Publicación para promocionar mi nuevo canal...",
    styles: ["Facebook", "Instagram", "TikTok", "YouTube Shorts", "Promocional", "Motivacional"]
  }
};

let currentModule = "stories";

const topic = document.getElementById("topic");
const style = document.getElementById("style");
const length = document.getElementById("length");
const result = document.getElementById("result");
const message = document.getElementById("message");
const generate = document.getElementById("generate");

function changeModule(moduleName) {
  currentModule = moduleName;
  const config = modules[moduleName];

  document.querySelectorAll(".module").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.module === moduleName
    );
  });

  topic.placeholder = config.placeholder;
  style.innerHTML = "";

  config.styles.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    style.appendChild(option);
  });

  message.textContent = "";
}

document.querySelectorAll(".module").forEach(button => {
  button.addEventListener("click", () => {
    changeModule(button.dataset.module);
  });
});

function createDemo(topicText, selectedStyle, selectedLength) {
  const titles = {
    stories: "Una nueva historia: " + topicText,
    youtube: "GUION: " + topicText,
    social: "PUBLICACIÓN: " + topicText
  };

  const endings = {
    short: "Comparte tu idea y sigue creando.",
    medium: "Una buena idea puede convertirse en un contenido extraordinario. Desarrolla esta propuesta con tu propio estilo y conecta con tu audiencia.",
    long: "El contenido debe evolucionar a lo largo de su desarrollo. Añade detalles, ejemplos, momentos memorables y una conclusión que invite a la audiencia a participar, compartir y regresar por más."
  };

  return titles[currentModule] +
    "\n\nEstilo: " + selectedStyle +
    "\n\nIdea original:\n" + topicText +
    "\n\nDesarrollo creativo:\n" +
    "Comienza presentando el contexto y creando interés desde las primeras líneas. " +
    "Desarrolla la idea mediante escenas, argumentos o mensajes que mantengan la atención. " +
    endings[selectedLength] +
    "\n\n---\nContenido de demostración de CREATIVA AI.";

async function generateContent() {
  const idea = topic.value.trim();

  if (!idea) {
    message.textContent = "Primero escribe una idea.";
    topic.focus();
    return;
  }

  generate.disabled = true;
  generate.textContent = "✦ CREANDO CON INTELIGENCIA ARTIFICIAL...";
  message.textContent = "";

  try {
    const response = await fetch(
      "https://creativa-ai-engine.rasec-chivas.workers.dev/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idea: idea,
          module: currentModule,
          style: style.value,
          length: length.value
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al generar contenido.");
    }

    if (!data.content) {
      throw new Error("La respuesta llegó vacía.");
    }

    result.textContent = data.content;
    message.textContent =
      "¡CREATIVA AI ha creado tu contenido correctamente!";

  } catch (error) {
    console.error(error);
    message.textContent =
      "No pudimos conectar con el motor: " + error.message;

  } finally {
    generate.disabled = false;
    generate.textContent = "✦ GENERAR CONTENIDO";
  }
}
  
