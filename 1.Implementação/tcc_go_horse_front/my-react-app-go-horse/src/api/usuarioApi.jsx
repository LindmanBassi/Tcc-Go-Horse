import { buildUrl, getAuthHeaders } from './configApi';

// LISTAR 
export async function getUsuarios() {
  const res = await fetch(buildUrl('/usuarios'), {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw res;
  return res.json();
}

// BUSCAR 
export async function getUsuario(id) {
  const res = await fetch(buildUrl(`/usuarios/${id}`), {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw res;
  return res.json();
}

// CRIAR 
export async function criarUsuario(usuario) {
  const res = await fetch(buildUrl('/usuarios'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.mensagem || 'Erro ao criar usuário');
  }

  return data;
}

// EDITAR 
export async function editarUsuario(id, usuario) {
  const res = await fetch(buildUrl(`/usuarios/${id}`), {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(usuario),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.mensagem || 'Erro ao editar usuário');
  }

  return data;
}

// DELETAR
export async function deletarUsuario(id) {
  const res = await fetch(buildUrl(`/usuarios/${id}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Erro ao deletar usuário');
  }

  return true;
}