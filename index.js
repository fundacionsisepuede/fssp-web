document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const hamburgerMenu = document.querySelector(".hamburger-menu");

  // Crear overlay dinámicamente
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);

  // Abrir menú
  hamburger.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  // Cerrar al hacer click fuera
  overlay.addEventListener("click", () => {
    hamburgerMenu.classList.remove("active");
    overlay.classList.remove("active");
  });
});
