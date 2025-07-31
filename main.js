// main.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  'https://ipxeamegdgrlpvhvbuqo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlweGVhbWVnZGdybHB2aHZidXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTUwMTEsImV4cCI6MjA2OTM5MTAxMX0.zo5s7w71UlsedidrNIIFrE5T_B44E0jBjYGe84NuuoQ'
);

document.addEventListener('DOMContentLoaded', async () => {
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

    if (user.user_metadata?.avatar_url) {
      avatar.src = user.user_metadata.avatar_url;
    } else {
      const inicial = user.email.charAt(0).toUpperCase();
      avatar.src = `https://via.placeholder.com/50?text=${inicial}`;
    }

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

  // 💡 CARRUSEL DE PORTADAS
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

    carrusel.innerHTML = ''; // Limpiar contenido previo

    data.forEach((portada, index) => {
      const item = document.createElement('div');
      item.className = 'carousel-item';
      if (index === 0) item.classList.add('active');

      item.innerHTML = `
        <img src="${portada.imagen_url}" alt="${portada.titulo}" class="slide">
        <div class="carousel-caption" style="position:absolute; bottom:20px; left:20px; color:white; background:rgba(0,0,0,0.5); padding:10px; border-radius:6px;">
          <h3 style="margin:0;">${portada.titulo}</h3>
          <p style="margin:0;">${portada.subtitulo || ''}</p>
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
    const cargarPublicacionesDestacadas = async () => {
    const { data, error } = await supabase
      .from('publicaciones')
      .select('titulo, descripcion, imagen_url')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('❌ Error al cargar publicaciones:', error);
      return;
    }

    const contenedor = document.getElementById("tarjetasPublicaciones");
    if (!contenedor || !data || data.length === 0) return;

    data.forEach(pub => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta";
      tarjeta.innerHTML = `
        <img src="${pub.imagen_url}" alt="${pub.titulo}" />
        <h3>${pub.titulo}</h3>
        <p>${pub.descripcion}</p>
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

});
