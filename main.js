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

  // 🖼️ Carrusel de portadas (en memoria)
  const carrusel = document.getElementById('carrusel');
  if (carrusel) {
    carrusel.innerHTML = `
      <div class="carousel-item active"><img src="src/Portada-1.jpeg" alt="Portada 1" /></div>
      <div class="carousel-item"><img src="src/Portada-2.jpeg" alt="Portada 2" /></div>
      <div class="carousel-item"><img src="src/Portada-3.jpeg" alt="Portada 3" /></div>
      <div class="carousel-item"><img src="src/Portada-4.jpeg" alt="Portada 4" /></div>
    `;
    let slideIndex = 0;
    const slides = carrusel.querySelectorAll('.carousel-item');
    setInterval(() => {
      slides.forEach((slide, i) => slide.classList.toggle('active', i === slideIndex));
      slideIndex = (slideIndex + 1) % slides.length;
    }, 4000);
  }

  // 📰 Publicaciones destacadas (Supabase)
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
      let imagen = pub.imagen_url || (Array.isArray(pub.imagenes_url) && pub.imagenes_url[0]) || 'img/default.jpg';
      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta";
      tarjeta.setAttribute("data-id", pub.id || ""); // 👈 asegura que tenga data-id
      tarjeta.innerHTML = `
        <img src="${imagen}" alt="${pub.titulo}" />
        <h3>${pub.titulo}</h3>
        <p>${pub.subtitulo || ''}</p>
      `;
      contenedor.appendChild(tarjeta);
    });
  };
  await cargarPublicacionesDestacadas();

  // ❤️ Modal de Donación
  const abrirDonacion = () => {
    const modal = document.getElementById('modal-donacion');
    if (modal) {
      modal.style.display = 'flex';
      const contenido = modal.querySelector('.contenido-donacion');
      if (contenido) contenido.style.animation = 'slideUp 0.4s ease forwards';
    }
  };
  const cerrarDonacion = () => {
    const modal = document.getElementById('modal-donacion');
    if (modal) modal.style.display = 'none';
  };
  const botonDonar = document.querySelector('.donar-fijo');
  if (botonDonar) botonDonar.addEventListener('click', e => { e.preventDefault(); abrirDonacion(); });
  const botonCerrar = document.querySelector('#modal-donacion button');
  if (botonCerrar) botonCerrar.addEventListener('click', cerrarDonacion);

  // 📌 Modal de Publicaciones
  const tarjetas = document.querySelectorAll(".tarjeta");
  const modalPub = document.getElementById("modal-publicacion");
  const modalTitulo = document.getElementById("modal-titulo");
  const modalDescripcion = document.getElementById("modal-descripcion");
  const carouselModal = document.querySelector(".carousel-modal");
  const closeBtn = document.querySelector(".close");

  let carruselInterval; // para limpiar intervalos

  // Datos completos de publicaciones
const publicaciones = {
  1: {
    titulo: "Impulso al deporte comunitario a través del auspicio deportivo",
    descripcion: `Como parte de su compromiso con el desarrollo social y la integración comunitaria, la fundación realizó la entrega de indumentaria y equipamiento deportivo para el auspicio de campeonatos locales. 
Esta iniciativa busca fomentar la práctica del deporte, fortalecer el trabajo en equipo y generar oportunidades para niños, jóvenes y adultos, promoviendo valores como la disciplina, el respeto y la superación personal.`,
    media: ["src/encuentro-deportivo.jpeg"]
  },
  2: {
    titulo: "Clausura del programa de capacitación para emprendedoras",
    descripcion: `La Fundación Sí Se Puede llevó a cabo la clausura del programa de formación dirigido a mujeres emprendedoras, brindando herramientas prácticas y conocimientos orientados al fortalecimiento de sus iniciativas productivas. 
Esta capacitación busca impulsar la autonomía económica y generar nuevas oportunidades de desarrollo para las familias del sector.`,
    media: ["src/capacitacion-emprendedoras.jpeg","src/capacitacion-emprendedoras2.jpeg"]
  },
  3: {
    titulo: "Jornada de atención social comunitaria",
    descripcion: `La Fundación Sí Se Puede desarrolló una jornada de atención social dirigida a familias del sector, brindando apoyo directo y acompañamiento comunitario. 
Estas acciones fortalecen la integración social y promueven mejores condiciones de bienestar para la población.`,
    media: ["src/ayuda-social.jpeg","src/ayuda-social2.jpeg"]
  },
  4: {
    titulo: "Entrega de ayuda humanitaria a familias en situación de vulnerabilidad",
    descripcion: `La Fundación Sí Se Puede realizó la entrega de ayuda humanitaria a una familia del sector, brindando insumos básicos para la atención y cuidado de la primera infancia. 
Esta acción forma parte del compromiso institucional de apoyar a quienes más lo necesitan y contribuir al bienestar familiar.`,
    media: ["src/Entrega.jpeg"]
  },
  5: {
    titulo: "Entrega de silla de ruedas para mejorar la movilidad y autonomía",
    descripcion: `Se realizó la entrega de una silla de ruedas a una persona adulta mayor, brindándole mayor independencia y calidad de vida. 
Esta acción solidaria busca facilitar su movilidad diaria y garantizar un desplazamiento más seguro y digno, reafirmando el compromiso de la fundación con quienes más lo necesitan.`,
    media: ["src/video-silla.mp4","src/video-silla2.mp4"]
  },
  6: {
    titulo: "Sentimos la política en Acción y la Acción en humanidad !!!",
    descripcion: `La dignidad de nuestros adultos mayores no se discute, se defiende. Menos discursos, MÁS ayuda.

Mientras unos ayudan solo por el cálculo político de las elecciones, lo nuestro no es campaña, es convicción de ayudar !!!

Apoyamos a nuestros Adultos mayores con implemento de aseo personal, escuchamos sus necesidades y sugerencias para contribuir en que sus días sean mejores !!

#SiSePuede
#AlternativaSocial 
#AdultosMayores
#PolíticaConValores
#Solidaridad
#XavierToro
#HechosNoPalabras
#Mas`,
    media: ["src/video--ayuda.mp4"]
  },

  7: {
    titulo: "Construir no es solo levantar paredes, es levantar esperanza",
    descripcion: `Hoy, gracias a esta donación de cemento, seguimos trabajando donde más se necesita. Aquí no hay promesas vacías, hay acciones reales que transforman vidas.

Mientras algunos hablan, nosotros actuamos. ¡Porque ayudar no es campaña, es compromiso!

#SiSePuede
#AlternativaSocial
#HechosNoPalabras
#Solidaridad
#CompromisoReal
#JuntosConstruimos
#MasAccionMenosPalabras`,
    media: ["src/donacion-cemento1.mp4"]
  }
};


  const abrirModalPub = (id) => {
    const pub = publicaciones[id];
    if (!pub) return;

    // texto en la columna derecha
    modalTitulo.textContent = pub.titulo;
modalDescripcion.textContent = pub.descripcion;


    // carrusel en la columna izquierda
    carouselModal.innerHTML = "";
    pub.media.forEach((m, i) => {
      const item = document.createElement("div");
      item.className = "carousel-item-modal";
      if (i === 0) item.classList.add("active");
      item.innerHTML = m.endsWith(".mp4")
        ? `<video src="${m}" controls></video>`
        : `<img src="${m}" alt="${pub.titulo}">`;
      carouselModal.appendChild(item);
    });

    modalPub.style.display = "flex";

    // limpiar intervalos previos
    if (carruselInterval) clearInterval(carruselInterval);

    // iniciar carrusel interno si hay más de un medio
    if (pub.media.length > 1) {
      let index = 0;
      carruselInterval = setInterval(() => {
        const items = carouselModal.querySelectorAll(".carousel-item-modal");
        items.forEach((el, i) => {
          el.classList.toggle("active", i === index);
        });
        index = (index + 1) % items.length;
      }, 4000);
    }
  };

  // Eventos de click en tarjetas
  tarjetas.forEach(t => {
    t.addEventListener("click", () => {
      const id = t.getAttribute("data-id");
      abrirModalPub(id);
    });
  });

  // Cerrar modal
  closeBtn.addEventListener("click", () => {
    modalPub.style.display = "none";
    carouselModal.innerHTML = "";
    if (carruselInterval) clearInterval(carruselInterval);
  });

  // Cerrar modal al hacer click fuera del contenido
  window.addEventListener("click", (e) => {
    if (e.target === modalPub) {
      modalPub.style.display = "none";
      carouselModal.innerHTML = "";
      if (carruselInterval) clearInterval(carruselInterval);
    }
  });
  // 📌 Abrir modal automáticamente según parámetro en la URL
const params = new URLSearchParams(window.location.search);
const modalId = params.get("modal");
if (modalId && publicaciones[modalId]) {
  abrirModalPub(modalId);
}

});

