import { useState, useEffect } from 'react';
import { getEventos } from '../api/eventoApi';
import {
  participarDoEvento,
  getUsuariosPorEvento,
  getMeusEventos,
} from '../api/participacaoApi';
import { getLocal } from '../api/localApi';

export function useParticipacao() {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [meusEventos, setMeusEventos] = useState([]);
  const [mensagemParticipacao, setMensagemParticipacao] = useState({
    type: '',
    text: '',
  });
  const [userRole, setUserRole] = useState(null);
  const [localDetalhes, setLocalDetalhes] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.cargo);;
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        setUserRole(null);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchEventos() {
      try {
        const data = await getEventos();
        const normalized = Array.isArray(data)
          ? data.map((e, i) => ({ ...e, id: e.id ?? e._id ?? `tmp-${i}` }))
          : [];
        setEventos(normalized);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
      }
    }
    fetchEventos();
  }, []);

  useEffect(() => {
    if (!eventoSelecionado || userRole === 'VISITANTE') {
      setParticipantes([]);
      return;
    }

    async function fetchParticipantes() {
      try {
        const data = await getUsuariosPorEvento(eventoSelecionado.id);
        setParticipantes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao buscar participantes:', err);
        setParticipantes([]);
      }
    }
    fetchParticipantes();
  }, [eventoSelecionado, userRole]);

  useEffect(() => {
    if (!eventoSelecionado || !eventoSelecionado.local?.id) {
      setLocalDetalhes(null);
      return;
    }

    setLocalDetalhes({ nome: 'Buscando...'});

    async function fetchLocalDetails() {
      try {
        const local = await getLocal(eventoSelecionado.local.id);
        setLocalDetalhes(local);
      } catch (err) {
        console.error('Erro ao buscar Local:', err);
        setLocalDetalhes({ nome: 'Erro ao carregar Local' });
      }
    }
    fetchLocalDetails();
  }, [eventoSelecionado]);

async function fetchMeusEventos() {
  try {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const usuarioId = payload.id;

    const data = await getMeusEventos(usuarioId);
    setMeusEventos(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Erro ao buscar meus eventos:', err);
  }
}

  useEffect(() => {
    fetchMeusEventos();
  }, []);

const handleParticipar = async (eventoId) => {
  setMensagemParticipacao({ type: '', text: '' });

  try {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const usuarioId = payload.id;

    await participarDoEvento(eventoId, usuarioId);

    setMensagemParticipacao({
      type: 'success',
      text: 'Participação registrada com sucesso!',
    });

    if (eventoSelecionado && userRole !== 'VISITANTE') {
      const data = await getUsuariosPorEvento(eventoSelecionado.id);
      setParticipantes(Array.isArray(data) ? data : []);
    }

    await fetchMeusEventos();
  } catch (err) {
    console.error(err);

    let data = null;
    if (err instanceof Response) {
      try {
        data = await err.json();
      } catch (_) {
        data = null;
      }
    }

    let erroTexto = 'Erro ao participar do evento.';
    if (data && data.mensagem) {
      erroTexto = data.mensagem;
    }

    setMensagemParticipacao({
      type: 'error',
      text: erroTexto,
    });
  }
};

  return {
    eventos,
    eventoSelecionado,
    setEventoSelecionado,
    participantes,
    handleParticipar,
    meusEventos,
    mensagemParticipacao,
    userRole,
    localDetalhes,
  };
}
