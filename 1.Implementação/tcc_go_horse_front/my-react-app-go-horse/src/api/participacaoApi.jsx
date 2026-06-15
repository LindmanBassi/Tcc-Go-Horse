import { buildUrl } from './configApi';

async function handleResponse(res) {
  if (!res.ok) {
    throw res;
  }

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    data = null;
  }

  return data;
}

// PARTICIPAR
export async function participarDoEvento(eventoId, usuarioId) {
  const res = await fetch(
    buildUrl(`/eventos/${eventoId}/participar/${usuarioId}`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  return handleResponse(res);
}

// LISTAR SEUS EVENTOS
export async function getMeusEventos(usuarioId) {
  const res = await fetch(
    buildUrl(`/eventos/usuario/${usuarioId}`),
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  return handleResponse(res);
}

// LISTAR USUARIOS POR EVENTO
export async function getUsuariosPorEvento(eventoId) {
  const res = await fetch(
    buildUrl(`/eventos/${eventoId}/usuarios`),
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  return handleResponse(res);
}