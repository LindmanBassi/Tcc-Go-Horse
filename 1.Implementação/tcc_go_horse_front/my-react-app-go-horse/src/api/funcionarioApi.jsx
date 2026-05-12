import { buildUrl, getAuthHeaders } from './configApi';

// LISTAR
export async function getFuncionarios() {
  const res = await fetch(buildUrl('/funcionarios'), {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw res;
  return res.json();
}

// BUSCAR
export async function getFuncionario(id) {
  const res = await fetch(buildUrl(`/funcionarios/${id}`), {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw res;
  return res.json();
}

// CRIAR
export async function criarFuncionario(funcionario) {
  const res = await fetch(buildUrl('/funcionarios'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(funcionario),
  });

  if (!res.ok) throw res;
  return res.json();
}

// EDITAR
export async function editarFuncionario(id, funcionario) {
  const res = await fetch(buildUrl(`/funcionarios/${id}`), {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(funcionario),
  });

  if (!res.ok) throw res;
  return res.json();
}

// DELETAR
export async function deletarFuncionario(id) {
  const res = await fetch(buildUrl(`/funcionarios/${id}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw res;
  return true;
}