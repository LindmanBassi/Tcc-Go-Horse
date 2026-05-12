import { buildUrl, getAuthHeaders } from './configApi';

// LISTAR
export async function getEventos() {
  const res = await fetch(buildUrl('/eventos'), {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw res;
  return res.json();
}

// BUSCAR
export async function getEvento(id) {
  const res = await fetch(buildUrl(`/eventos/${id}`), {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw res;
  return res.json();
}

// CRIAR
export async function criarEvento(evento) {
  const res = await fetch(buildUrl('/eventos'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(evento),
  });

  if (!res.ok) throw res;
  return res.json();
}

// EDITAR
export async function editarEvento(id, evento) {
  const res = await fetch(buildUrl(`/eventos/${id}`), {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(evento),
  });

  if (!res.ok) throw res;
  return res.json();
}

// DELETAR
export async function deletarEvento(id) {
  const res = await fetch(buildUrl(`/eventos/${id}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw res;
  return true;
}