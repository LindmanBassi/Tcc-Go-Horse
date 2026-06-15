import { buildUrl, getAuthHeaders } from './configApi';

// LISTAR
export async function getLocais() {
  const res = await fetch(buildUrl('/locais'), {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Erro ao buscar locais');
  return res.json();
}

// BUSCAR
export async function getLocal(id) {
  const res = await fetch(buildUrl(`/locais/${id}`), {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error('Erro ao buscar local');
  return res.json();
}

// CRIAR
export async function criarLocal(local) {
  const res = await fetch(buildUrl('/locais'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(local),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (data?.erros) {
      throw { type: 'validation', erros: data.erros };
    }
    throw new Error(data?.mensagem || 'Erro ao criar local');
  }

  return data;
}

// EDITAR
export async function editarLocal(id, local) {
  const res = await fetch(buildUrl(`/locais/${id}`), {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(local),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (data?.erros) {
      throw { type: 'validation', erros: data.erros };
    }
    throw new Error(data?.mensagem || 'Erro ao editar local');
  }

  return data;
}

// DELETAR
export async function deletarLocal(id) {
  const res = await fetch(buildUrl(`/locais/${id}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.mensagem || 'Erro ao deletar local');
  }

  return true;
}