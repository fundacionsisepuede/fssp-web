// login.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ⚙️ Configura tu proyecto Supabase aquí
const supabase = createClient(
  'https://ipxeamegdgrlpvhvbuqo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlweGVhbWVnZGdybHB2aHZidXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTUwMTEsImV4cCI6MjA2OTM5MTAxMX0.zo5s7w71UlsedidrNIIFrE5T_B44E0jBjYGe84NuuoQ'
);

const loginForm = document.getElementById('login-form');
const googleBtn = document.getElementById('google-login');

// 🟦 Login con email y contraseña
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('❌ Error al iniciar sesión: ' + error.message);
    } else {
      alert('Inicio de sesión exitoso');
      window.location.href = '../index.html'; // ✅ Redirige al inicio
    }
  });
}

// 🟥 Login con Google
if (googleBtn) {
  googleBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/index.html' // ✅ Redirección correcta
      }
    });

    if (error) {
      alert('❌ Error al iniciar sesión con Google: ' + error.message);
    }
  });
}
