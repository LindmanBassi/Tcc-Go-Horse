import { buildUrl } from './configApi';

//LOGIN
export async function loginUsuario(email, senha) {
  const res = await fetch(buildUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });

  if (!res.ok) {
    throw new Error('Email ou senha inválidos');
  }

  const token = await res.text();

  if (token) {
    localStorage.setItem('token', token);
  }

  return token;
}

//LOGOUT
export async function logoutUsuario() {
  try {
    await fetch(buildUrl('/auth/logout'), {
      method: 'POST',
    });
  } catch (e) {
  
  }

  
  localStorage.removeItem('token');

  return true;
}