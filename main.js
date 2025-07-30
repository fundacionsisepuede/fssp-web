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
});
