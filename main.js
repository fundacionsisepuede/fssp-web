// main.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  'https://ipxeamegdgrlpvhvbuqo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlweGVhbWVnZGdybHB2aHZidXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTUwMTEsImV4cCI6MjA2OTM5MTAxMX0.zo5s7w71UlsedidrNIIFrE5T_B44E0jBjYGe84NuuoQ'
);

document.addEventListener('DOMContentLoaded', async () => {
  // 🔐 Autenticación y perfil
  const perfilLateral = document.getElementById('perfil-lateral');
  const cerrarLateral = document.getElementById('cerrar-lateral');
  const loginLink = document.getElementById('login-link');

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    if (loginLink) loginLink.style.display = 'none';

    const avatar = document.createElement('img');
    avatar.style.width = '50px';
    avatar.style.height = '50px';
    avatar.style.borderRadius = '50%';
    avatar.style.objectFit = 'cover';
    avatar.style.marginBottom = '8px';

    avatar.src = user.user_metadata?.avatar_url
      ? user.user_metadata.avatar_url
      : `https://via.placeholder.com/50?text=${user.email.charAt(0).toUpperCase()}`;

    const saludo = document.createElement('p');
    saludo.textContent = '¡Bienvenido a Fundación Si Se Puede!';
    saludo.style.fontSize = '14px';
    saludo.style.color = '#fff';
    saludo.style.margin = '8px 0';

    perfilLateral.appendChild(avatar);
    perfilLateral.appendChild(saludo);

    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Cerrar sesión';
    logoutBtn.style.backgroundColor = '#b70000';
    logoutBtn.style.color = 'white';
    logoutBtn.style.padding = '10px 20px';
    logoutBtn.style.border = 'none';
    logoutBtn.style.borderRadius = '6px';
    logoutBtn.style.cursor = 'pointer';

    logoutBtn.onclick = async () => {
      await supabase.auth.signOut();
      location.reload();
    };

    cerrarLateral.appendChild(logoutBtn);
  }

  // 🖼️ Carrusel de portadas
  const cargarCarrusel = async () => {
    const { data, error } = await supabase
      .from('portadas')
      .select('imagen_url, titulo, subtitulo')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error al cargar portadas:', error);
      return;
    }

    const carrusel = document.getElementById('carrusel');
    if (!carrusel || !data || data.length === 0) {
      carrusel.innerHTML = '<p style="text-align:center; color:red;">No hay portadas disponibles.</p>';
      return;
    }

    carrusel.innerHTML = '';

    data.forEach((portada, index) => {
      const item = document.createElement('div');
      item.className = 'carousel-item';
      if (index === 0) item.classList.add('active');

      item.innerHTML = `
        <img src="${portada.imagen_url}" alt="${portada.titulo}" class="slide">
        <div class="carousel-caption">
          <h3 class="titulo-carrusel">${portada.titulo}</h3>
          <p class="subtitulo-carrusel">${portada.subtitulo || ''}</p>
        </div>
      `;
      carrusel.appendChild(item);
    });

    let slideIndex = 0;
    setInterval(() => {
      const slides = document.querySelectorAll('.carousel-item');
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === slideIndex);
      });
      slideIndex = (slideIndex + 1) % slides.length;
    }, 4000);
  };

  await cargarCarrusel();

  // 📰 Publicaciones destacadas
  const cargarPublicacionesDestacadas = async () => {
    const { data, error } = await supabase
      .from('publicaciones')
      .select('titulo, subtitulo, imagen_url, imagenes_url')
      .order('fecha', { ascending: false })
      .limit(3);

    if (error) {
      console.error('❌ Error al cargar publicaciones:', error);
      return;
    }

    const contenedor = document.getElementById("tarjetasPublicaciones");
    if (!contenedor || !data || data.length === 0) return;

    contenedor.innerHTML = '';

    data.forEach(pub => {
      let imagen = pub.imagen_url;

      if (!imagen && Array.isArray(pub.imagenes_url) && pub.imagenes_url.length > 0) {
        imagen = pub.imagenes_url[0];
      }

      if (!imagen) {
        imagen = 'img/default.jpg';
      }

      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta";
      tarjeta.innerHTML = `
        <img src="${imagen}" alt="${pub.titulo}" />
        <h3>${pub.titulo}</h3>
        <p>${pub.subtitulo || ''}</p>
      `;

      contenedor.appendChild(tarjeta);
    });

    // Mostrar la sección cuando se sube la cortina
    window.addEventListener("scroll", () => {
      const cortina = document.getElementById("cortina");
      const publicacionesDestacadas = document.getElementById("publicacionesDestacadas");
      const cortinaBottom = parseFloat(getComputedStyle(cortina).bottom);

      if (cortinaBottom >= 0) {
        publicacionesDestacadas.classList.add("show");
      }
    });
  };

  await cargarPublicacionesDestacadas();
  // ❤️ Modal de Donación con animación
const abrirDonacion = () => {
  const modal = document.getElementById('modal-donacion');
  if (modal) {
    modal.style.display = 'flex';

    const contenido = modal.querySelector('.contenido-donacion');
    if (contenido) {
      contenido.style.animation = 'slideUp 0.4s ease forwards';
    }
  }
};

const cerrarDonacion = () => {
  const modal = document.getElementById('modal-donacion');
  if (modal) {
    modal.style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const botonDonar = document.querySelector('.donar-fijo');
  if (botonDonar) {
    botonDonar.addEventListener('click', (e) => {
      e.preventDefault();
      abrirDonacion();
    });
  }

  const botonCerrar = document.querySelector('#modal-donacion button');
  if (botonCerrar) {
    botonCerrar.addEventListener('click', cerrarDonacion);
  }
});

});
