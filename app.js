
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
}

async function generateContent() {
  const idea = topic.value.trim();

  if (!idea) {
    message.textContent = "Primero escribe una idea para comenzar.";
    topic.focus();
    return;
  }

  generate.disabled = true;
  generate.textContent = "✦ PREPARANDO CONTENIDO...";
  message.textContent = "";

  try {
    // MODO DEMOSTRACIÓN.
    // Más adelante conectaremos aquí nuestro backend de IA.
    await new Promise(resolve => setTimeout(resolve, 700));

    const output = createDemo(
      idea,
      style.value,
      length.value
    );

    result.textContent = output;
    message.textContent = "Contenido de demostración generado correctamente.";
  } catch (error) {
    message.textContent = "Ocurrió un error. Inténtalo nuevamente.";
    console.error(error);
  } finally {
    generate.disabled = false;
    generate.textContent = "✦ GENERAR CONTENIDO";
  }
}

generate.addEventListener("click", generateContent);

document.getElementById("copy").addEventListener("click", async () => {
  const content = result.innerText;

  if (!content.trim() || content.includes("Aquí aparecerá")) {
    message.textContent = "Primero genera un contenido.";
    return;
  }

  try {
    await navigator.clipboard.writeText(content);
    message.textContent = "¡Contenido copiado correctamente!";
  } catch (error) {
    message.textContent = "No se pudo copiar. Intenta seleccionar el texto.";
  }
});

// Inicializar la plataforma
changeModule("stories");
