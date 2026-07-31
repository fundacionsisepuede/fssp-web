// main.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  'https://ipxeamegdgrlpvhvbuqo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlweGVhbWVnZGdybHB2aHZidXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTUwMTEsImV4cCI6MjA2OTM5MTAxMX0.zo5s7w71UlsedidrNIIFrE5T_B44E0jBjYGe84NuuoQ'
);

// 📚 Datos completos de publicaciones (fuente local, hasta migrar a la base de datos)
const publicaciones = {
  1: {
    categoria: 'Deporte',
    titulo: 'Impulso al deporte comunitario a través del auspicio deportivo',
    descripcion: `Como parte de su compromiso con el desarrollo social y la integración comunitaria, la fundación realizó la entrega de indumentaria y equipamiento deportivo para el auspicio de campeonatos locales. 
Esta iniciativa busca fomentar la práctica del deporte, fortalecer el trabajo en equipo y generar oportunidades para niños, jóvenes y adultos, promoviendo valores como la disciplina, el respeto y la superación personal.`,
    media: ['src/encuentro-deportivo.jpeg']
  },
  2: {
    categoria: 'Emprendimiento',
    titulo: 'Clausura del programa de capacitación para emprendedoras',
    descripcion: `La Fundación Sí Se Puede llevó a cabo la clausura del programa de formación dirigido a mujeres emprendedoras, brindando herramientas prácticas y conocimientos orientados al fortalecimiento de sus iniciativas productivas. 
Esta capacitación busca impulsar la autonomía económica y generar nuevas oportunidades de desarrollo para las familias del sector.`,
    media: ['src/capacitacion-emprendedoras.jpeg', 'src/capacitacion-emprendedoras2.jpeg']
  },
  3: {
    categoria: 'Comunidad',
    titulo: 'Jornada de atención social comunitaria',
    descripcion: `La Fundación Sí Se Puede desarrolló una jornada de atención social dirigida a familias del sector, brindando apoyo directo y acompañamiento comunitario. 
Estas acciones fortalecen la integración social y promueven mejores condiciones de bienestar para la población.`,
    media: ['src/ayuda-social.jpeg', 'src/ayuda-social2.jpeg']
  },
  4: {
    categoria: 'Ayuda Humanitaria',
    titulo: 'Entrega de ayuda humanitaria a familias en situación de vulnerabilidad',
    descripcion: `La Fundación Sí Se Puede realizó la entrega de ayuda humanitaria a una familia del sector, brindando insumos básicos para la atención y cuidado de la primera infancia. 
Esta acción forma parte del compromiso institucional de apoyar a quienes más lo necesitan y contribuir al bienestar familiar.`,
    media: ['src/entrega.jpeg']
  },
  5: {
    categoria: 'Movilidad',
    titulo: 'Entrega de silla de ruedas para mejorar la movilidad y autonomía',
    descripcion: `Se realizó la entrega de una silla de ruedas a una persona adulta mayor, brindándole mayor independencia y calidad de vida. 
Esta acción solidaria busca facilitar su movilidad diaria y garantizar un desplazamiento más seguro y digno, reafirmando el compromiso de la fundación con quienes más lo necesitan.`,
    media: ['src/video-silla.mp4', 'src/video-silla2.mp4']
  },
  6: {
    categoria: 'Voz Social',
    titulo: 'Sentimos la política en Acción y la Acción en humanidad !!!',
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
    media: ['src/video--ayuda.mp4']
  },
  7: {
    categoria: 'Educación',
    titulo: 'Compromiso con la comunidad educativa de la Escuela Julia Stupiñán Tello',
    descripcion: `Hoy reafirmamos nuestro compromiso con la comunidad educativa de la Escuela Julia Stupiñán Tello, ubicada en el barrio 20 de Noviembre. Agradecemos profundamente a todas las personas que hicieron posible este valioso apoyo, el cual contribuirá a mejorar las condiciones y la seguridad de nuestros estudiantes.

Cada aporte representa una oportunidad para construir espacios más seguros y un mejor futuro para nuestros niños. ¡Gracias por ser parte de este cambio!`,
    media: ['src/sisepuede30-07.mp4']
  }
};

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
  const carrusel = document.getElementById('carrusel');
  let slides = [];
  if (carrusel) {
    slides = carrusel.querySelectorAll('.carousel-item');
    let slideIndex = 0;
    setInterval(() => {
      slideIndex = (slideIndex + 1) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('active', i === slideIndex));
    }, 4000);
  }

  // ❤️ Modal de Donación
  const modalDonacion = document.getElementById('modal-donacion');
  const abrirDonacion = () => {
    if (modalDonacion) modalDonacion.style.display = 'flex';
  };
  const cerrarDonacion = () => {
    if (modalDonacion) modalDonacion.style.display = 'none';
  };
  document.getElementById('btn-abrir-donacion')?.addEventListener('click', e => {
    e.preventDefault();
    abrirDonacion();
  });
  document.getElementById('btn-cerrar-donacion')?.addEventListener('click', cerrarDonacion);
  modalDonacion?.addEventListener('click', e => {
    if (e.target === modalDonacion) cerrarDonacion();
  });

  // 📌 Modal de Publicaciones + enlaces únicos por publicación (#pub-ID)
  const tarjetas = document.querySelectorAll('.tarjeta');
  const modalPub = document.getElementById('modal-publicacion');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalDescripcion = document.getElementById('modal-descripcion');
  const modalEtiqueta = document.getElementById('modal-etiqueta');
  const carouselModal = document.querySelector('.carousel-modal');
  const closeBtn = document.querySelector('#modal-publicacion .close');
  const btnCopiarLink = document.getElementById('btn-copiar-link');

  let carruselInterval; // para limpiar intervalos del carrusel del modal

  const idDesdeHash = () => {
    const m = window.location.hash.match(/^#pub-(\d+)$/);
    return m ? m[1] : null;
  };

  const abrirModalPub = (id, { actualizarUrl = true } = {}) => {
    const pub = publicaciones[id];
    if (!pub) return;

    // texto en la columna derecha
    modalEtiqueta.textContent = pub.categoria || '';
    modalTitulo.textContent = pub.titulo;
    modalDescripcion.textContent = pub.descripcion;

    // carrusel en la columna izquierda
    carouselModal.innerHTML = '';
    pub.media.forEach((m, i) => {
      const item = document.createElement('div');
      item.className = 'carousel-item-modal';
      if (i === 0) item.classList.add('active');
      item.innerHTML = m.endsWith('.mp4')
        ? `<video src="${m}" controls playsinline></video>`
        : `<img src="${m}" alt="${pub.titulo}">`;
      carouselModal.appendChild(item);
    });

    modalPub.style.display = 'flex';
    document.body.classList.add('modal-abierto');

    if (carruselInterval) clearInterval(carruselInterval);
    if (pub.media.length > 1) {
      let index = 0;
      carruselInterval = setInterval(() => {
        const items = carouselModal.querySelectorAll('.carousel-item-modal');
        index = (index + 1) % items.length;
        items.forEach((el, i) => el.classList.toggle('active', i === index));
      }, 4000);
    }

    // 🔗 Enlace único y compartible para esta publicación
    if (actualizarUrl) {
      history.pushState({ pubId: id }, '', `#pub-${id}`);
    }
  };

  const cerrarModalUI = () => {
    modalPub.style.display = 'none';
    carouselModal.innerHTML = '';
    document.body.classList.remove('modal-abierto');
    if (carruselInterval) clearInterval(carruselInterval);
  };

  const cerrarModalPub = () => {
    cerrarModalUI();
    if (window.location.hash) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Click en cada tarjeta → abre su publicación y genera el enlace único
  tarjetas.forEach(t => {
    t.addEventListener('click', () => {
      const id = t.getAttribute('data-id');
      abrirModalPub(id);
    });
  });

  closeBtn?.addEventListener('click', cerrarModalPub);

  window.addEventListener('click', e => {
    if (e.target === modalPub) cerrarModalPub();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalPub.style.display === 'flex') cerrarModalPub();
  });

  // Botón "copiar enlace" dentro del modal
  btnCopiarLink?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const textoOriginal = btnCopiarLink.textContent;
      btnCopiarLink.textContent = '✅ Enlace copiado';
      setTimeout(() => (btnCopiarLink.textContent = textoOriginal), 2000);
    } catch (err) {
      console.error('No se pudo copiar el enlace:', err);
    }
  });

  // Navegar con atrás/adelante del navegador
  window.addEventListener('popstate', () => {
    const id = idDesdeHash();
    if (id && publicaciones[id]) {
      abrirModalPub(id, { actualizarUrl: false });
    } else {
      cerrarModalUI();
    }
  });

  // Al cargar la página: si la URL trae un enlace de publicación, abrirla directamente
  const idInicial = idDesdeHash();
  if (idInicial && publicaciones[idInicial]) {
    abrirModalPub(idInicial, { actualizarUrl: false });
  }

  // ✨ Animación de entrada de la sección de publicaciones al hacer scroll
  const seccionPublicaciones = document.getElementById('publicaciones');
  if (seccionPublicaciones && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(seccionPublicaciones);
  } else if (seccionPublicaciones) {
    seccionPublicaciones.classList.add('show');
  }

  // 🔺 Encabezado: se atenúa al hacer scroll dentro del carrusel
  const header = document.getElementById('header');
  if (header && carrusel) {
    window.addEventListener('scroll', () => {
      const alturaCarrusel = carrusel.offsetHeight;
      const progreso = Math.min(window.scrollY / (alturaCarrusel * 0.7), 1);
      header.style.opacity = `${1 - progreso * 0.85}`;
    });
  }
});