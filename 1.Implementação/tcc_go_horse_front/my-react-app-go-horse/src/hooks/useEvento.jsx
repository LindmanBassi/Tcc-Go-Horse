import { useState, useEffect } from 'react';
import {
  criarEvento,
  getEventos,
  editarEvento,
  deletarEvento,
} from '../api/eventoApi';
import { getUsuarios } from '../api/usuarioApi';
import { getLocais } from '../api/localApi';

export function useEvent() {
  const [formData, setFormData] = useState({
    localId: '',
    estadoEvento: 'ABERTO',
    tipoEvento: 'REMOTO',
    data: '',
    titulo: '',
    descricao: '',
    vagas: '',
    palestranteId: '',
  });

  const [eventos, setEventos] = useState([]);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [locais, setLocais] = useState([]);
  const [mensagemErro, setMensagemErro] = useState('');
  const [erros, setErros] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventosData, usuariosData, locaisData] = await Promise.all([
          getEventos(),
          getUsuarios(),
          getLocais(),
        ]);

        setEventos(
          Array.isArray(eventosData)
            ? eventosData.map((e, i) => ({
                ...e,
                id: e.id ?? e._id ?? `tmp-${i}`,
              }))
            : [],
        );

        setUsuarios(
          Array.isArray(usuariosData)
            ? usuariosData.map((u, i) => ({
                ...u,
                id: u.id ?? u._id ?? `tmp-${i}`,
              }))
            : [],
        );

        setLocais(
          Array.isArray(locaisData)
            ? locaisData.map((l, i) => ({
                ...l,
                id: l.id ?? l._id ?? `tmp-${i}`,
              }))
            : [],
        );
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
      }
    }
    fetchData();
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
        console.error('Erro ao carregar eventos:', err);
      }
    }
    fetchEventos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'estadoEvento') return;

    if (name === 'tipoEvento' && value === 'REMOTO') {
      setFormData((prev) => ({
        ...prev,
        tipoEvento: value,
        localId: '',
      }));
      return;
    }

    if (name === 'vagas' || name === 'localId' || name === 'palestranteId') {
      const numValue = value === '' ? '' : parseInt(value, 10);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemErro('');
    setErros({});

    try {
      let payload = {
        ...formData,
        vagas: Number(formData.vagas) || 1,
        palestranteId: formData.palestranteId
  ? Number(formData.palestranteId)
  : null,
        estadoEvento: 'ABERTO',
      };

if (payload.tipoEvento === 'REMOTO') {
  payload.local = null;
} else {
  if (!formData.localId) {
    setMensagemErro('Selecione um local');
    return;
  }

  payload.local = {
    id: Number(formData.localId)
  };
}


delete payload.localId;

      if (eventoEditando) {
        await editarEvento(eventoEditando.id, payload);
      } else {
        await criarEvento(payload);
      }

      const atualizados = await getEventos();
      const normalized = Array.isArray(atualizados)
        ? atualizados.map((e, i) => ({
            ...e,
            id: e.id ?? e._id ?? `tmp-${i}`,
          }))
        : [];
      setEventos(normalized);
      setEventoEditando(null);

      setFormData({
        localId: '',
        estadoEvento: 'ABERTO',
        tipoEvento: 'REMOTO',
        data: '',
        titulo: '',
        descricao: '',
        vagas: '',
        palestranteId: '',
      });
    } catch (err) {
      console.error('Erro ao salvar evento:', err);

      let data = null;
      if (err instanceof Response) {
        try {
          data = await err.json();
        } catch (_) {
          data = null;
        }
      }

      if (data) {
        if (data.erros && typeof data.erros === 'object') {
          setErros(data.erros);
          const msg = data.mensagem || Object.values(data.erros)[0];
          setMensagemErro(msg);
        } else if (data.mensagem) {
          setMensagemErro(data.mensagem);
        } else {
          setMensagemErro('Resposta de erro inesperada do servidor.');
        }
      } else {
        setMensagemErro('Erro de conexão com o servidor.');
      }
    }
  };

  const iniciarEdicao = (evento) => {
    setEventoEditando(evento);
    setFormData({
      ...evento,
      localId: evento.localId || evento.local?.id || '',
      data: new Date(evento.data).toISOString().slice(0, 16),
    });
    setMensagemErro('');
    setErros({});
  };

  const handleDeletar = async (id) => {
    try {
      await deletarEvento(id);
      setEventos((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      setMensagemErro('Erro ao deletar evento.');
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    eventos,
    iniciarEdicao,
    handleDeletar,
    eventoEditando,
    usuarios,
    locais,
    mensagemErro,
    erros,
  };
}
