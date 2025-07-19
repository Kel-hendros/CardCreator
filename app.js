// Función para cambiar el borde de la carta
function changeBorder(borderUrl) {
  const borderLayer = document.querySelector(".border-layer");
  if (borderLayer) {
    borderLayer.style.backgroundImage = `url('${borderUrl}')`;
  }
}

// Función para cambiar la imagen del personaje
function changeImage(imageUrl) {
  const img = document.querySelector(".user-image img");
  if (img) {
    img.src = imageUrl;
  }
}

// Función para reiniciar la imagen al default
function resetImage() {
  const img = document.querySelector(".user-image img");
  if (img) {
    img.src = "imagenes/default/defaultImage.png";
  }
  // Limpiar inputs de imagen
  const fileInput = document.getElementById("file-input");
  const urlInput = document.getElementById("url-input");
  if (fileInput) fileInput.value = "";
  if (urlInput) urlInput.value = "";
}

// Inicializar listeners cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const thumbs = document.querySelectorAll(".border-thumb");
  const thumbsIcon = document.querySelectorAll(".icon-thumb");

  // Mapeo de tipos a rutas de iconos
  const iconMap = {
    none: "imagenes/iconos/ninguno.png",
    cainita: "imagenes/iconos/cainita.png",
    hombreLobo: "imagenes/iconos/hombreLobo.png",
    changeling: "imagenes/iconos/changeling.png",
    mortal: "imagenes/iconos/mortal.png",
    wraith: "imagenes/iconos/wraith.png",
    mage: "imagenes/iconos/mage.png",
  };

  // Selector de tipo de criatura
  const typeIcon = document.querySelector(".type-icon");
  const clanForm = document.getElementById("clan-form");
  const clanSelect = document.getElementById("clan");
  const subtypeIcon = document.querySelector(".clan-icon");
  // Inicialmente ocultar formulario y icono de subtipo
  if (clanForm) clanForm.classList.add("hidden");
  if (subtypeIcon) subtypeIcon.style.display = "none";

  // Ocultar ícono al inicio
  if (typeIcon) typeIcon.style.display = "none";

  // Lógica de cambio de tipo de criatura
  function setCreatureType(val) {
    // Actualizar icono principal
    const src = iconMap[val] || iconMap.none;
    typeIcon.src = src;
    typeIcon.style.display = "";
    // Mostrar u ocultar formulario de clan
    if (val === "cainita") {
      clanForm.classList.remove("hidden");
    } else {
      clanForm.classList.add("hidden");
      clanSelect.value = "none";
      subtypeIcon.style.display = "none";
      subtypeIcon.src = iconMap.none;
    }
  }

  clanSelect.addEventListener("change", () => {
    const clanVal = clanSelect.value;
    if (clanVal && clanVal !== "none") {
      // Mostrar icono de subtipo apuntando a la carpeta de clanes
      subtypeIcon.src = `imagenes/iconos/clanes/${clanVal}.png`;
      subtypeIcon.style.display = "";
    } else {
      subtypeIcon.style.display = "none";
      subtypeIcon.src = iconMap.none;
    }
  });

  // Icon-thumb: seleccionar tipo de criatura con click en iconos
  // thumbsIcon ya fue declarado arriba
  thumbsIcon.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      // Quitar clase active de todas las miniaturas
      thumbsIcon.forEach((t) => t.classList.remove("active"));
      // Marcar la miniatura clickeada como activa
      thumb.classList.add("active");
      // Derivar el valor de tipo desde el nombre de archivo data-icon
      const scr = thumb.dataset.icon;
      const val = scr.substring(scr.lastIndexOf("/") + 1, scr.lastIndexOf("."));
      // Aplicar la lógica de cambio de tipo
      setCreatureType(val);
    });
  });

  // Actualizar texto de la carta en tiempo real
  const nameInput = document.getElementById("card-name");
  const descInput = document.getElementById("card-desc");
  const cardTitle = document.querySelector(".card-title");
  const cardDescription = document.querySelector(".card-description");

  if (nameInput && cardTitle) {
    nameInput.addEventListener("input", () => {
      cardTitle.textContent = nameInput.value;
    });
  }
  if (descInput && cardDescription) {
    descInput.addEventListener("input", () => {
      cardDescription.textContent = descInput.value;
    });
  }

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      // Quitar clase active de todas las miniaturas
      thumbs.forEach((t) => t.classList.remove("active"));
      // Marcar la miniatura clickeada como activa
      thumb.classList.add("active");
      // Cambiar el borde usando la URL del data attribute
      changeBorder(thumb.dataset.border);
    });
  });

  // Opcional: establecer el borde inicial según la miniatura activa
  const initial = document.querySelector(".border-thumb.active");
  if (initial) {
    changeBorder(initial.dataset.border);
  }

  // Manejar cambio de imagen desde URL o archivo
  const form = document.getElementById("image-form");
  const fileInput = document.getElementById("file-input");
  const urlInput = document.getElementById("url-input");

  // Aplicar imagen al cargar archivo
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        changeImage(e.target.result);
        // Esperar a que la imagen realice el paint
        img.onload = () => {
          // Usar tamaño renderizado real
          const rect = img.getBoundingClientRect();
          baseWidth = rect.width;
          baseHeight = rect.height;
          currentScale = 1;
          img.style.transform = "scale(1)";
          updateSliders();
        };
      };
      reader.readAsDataURL(file);
      // Limpiar URL al seleccionar archivo
      urlInput.value = "";
    }
  });

  // Aplicar imagen al pegar URL
  urlInput.addEventListener("change", () => {
    if (urlInput.value) {
      changeImage(urlInput.value);
      // Limpiar fileInput al usar URL
      fileInput.value = "";
      // Recalcular límites cuando la imagen termine de cargar
      img.onload = () => {
        baseWidth = img.clientWidth;
        baseHeight = img.clientHeight;
        currentScale = 1;
        img.style.transform = "scale(1)";
        updateSliders();
      };
    }
  });

  // Asegurar que el origen del zoom sea la esquina superior izquierda
  const img = document.querySelector(".user-image img");
  const container = document.querySelector(".user-image");

  let baseWidth = 0;
  let baseHeight = 0;
  let currentScale = 1;

  img.style.transformOrigin = "top left";

  // Botón de reiniciar imagen
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resetImage();
    });
  }

  // Ajustes de posición con sliders
  const rangeX = document.getElementById("range-x");
  const rangeY = document.getElementById("range-y");
  const rangeZoom = document.getElementById("range-zoom");

  // Inicializa baseWidth, baseHeight y zoom inicial para cubrir el container
  function initImage() {
    rangeZoom.value = 0;

    baseWidth = img.clientWidth;
    baseHeight = img.clientHeight;
    // Calcular escala para cubrir completamente el contenedor
    const CW = container.clientWidth;
    const CH = container.clientHeight;
    const scaleW = CW / baseWidth;
    const scaleH = CH / baseHeight;
    currentScale = Math.max(scaleW, scaleH);
    img.style.transform = `scale(${currentScale})`;
    // Calcular valor del slider correspondiente
    let sliderVal;
    if (currentScale >= 1) {
      sliderVal = (currentScale - 1) * 100;
    } else {
      sliderVal = -(1 - 1 / currentScale) * 100;
    }
    rangeZoom.value = sliderVal;
    // Posicionar en top-left al iniciar
    rangeX.value = 0;
    rangeY.value = 0;
    updateSliders();
  }

  function updateSliders() {
    const CW = container.clientWidth;
    const CH = container.clientHeight;
    // Usa dimensiones base escaladas
    const IW = baseWidth * currentScale;
    const IH = baseHeight * currentScale;

    // Cálculo de límites para que queden al menos 20px visibles
    const xMin = 20 - IW;
    const xMax = CW - 20;
    const yMin = 20 - IH;
    const yMax = CH - 20;

    // Configurar sliders
    rangeX.min = xMin;
    rangeX.max = xMax;
    // Mantener valor dentro de rango
    rangeX.value = Math.max(xMin, Math.min(xMax, rangeX.value));

    rangeY.min = yMin;
    rangeY.max = yMax;
    rangeY.value = Math.max(yMin, Math.min(yMax, rangeY.value));

    // Configurar slider de zoom
    rangeZoom.min = -200;
    rangeZoom.max = 200;
    // rangeZoom.value = 0;

    // Aplicar posiciones actuales
    img.style.left = `${rangeX.value}px`;
    img.style.top = `${rangeY.value}px`;
  }

  // Esperar a que la imagen cargue para calibrar dimensiones y zoom
  if (img.complete) {
    initImage();
  } else {
    img.addEventListener("load", initImage);
  }

  // Listeners de los sliders
  rangeX.addEventListener("input", () => {
    img.style.left = `${rangeX.value}px`;
  });
  rangeY.addEventListener("input", () => {
    img.style.top = `${rangeY.value}px`;
  });

  // Listener de zoom
  rangeZoom.addEventListener("input", () => {
    const val = parseInt(rangeZoom.value, 10);
    if (val >= 0) {
      currentScale = 1 + val / 100;
    } else {
      currentScale = 1 / (1 - val / 100);
    }
    img.style.transform = `scale(${currentScale})`;
    updateSliders();
  });
  // Exportar carta a PNG usando dom-to-image
  const exportBtn = document.getElementById("export-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const card = document.getElementById("card-wrapper");
      domtoimage
        .toPng(card)
        .then((dataUrl) => {
          const link = document.createElement("a");
          const fileName = nameInput.value.trim();
          link.download = fileName ? `${fileName} - Retrato.png` : "carta.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => console.error("Error exportando la carta:", err));
    });
  }

  // Inicializar íconos para evitar src vacíos
  setCreatureType("none");
});
