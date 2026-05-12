import { useState, useEffect } from 'react';
import {
  getUsuarios,
  criarUsuario,
  editarUsuario,
  deletarUsuario,
} from '../api/usuarioApi';

export function useUsuario() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    senha: '',
  });
  

  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mensagemErro, setMensagemErro] = useState('');
  const [erros, setErros] = useState({});

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const data = await getUsuarios();
        setUsuarios(
          Array.isArray(data)
            ? data.map((u, i) => ({ ...u, id: u.id ?? `tmp-${i}` }))
            : [],
        );
      } catch (err) {
        console.error(err);
        setMensagemErro('Erro ao carregar usuários.');
      }
    }
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemErro('');
    setErros({});

    try {
      if (usuarioEditando) {
        await editarUsuario(usuarioEditando.id, formData);
      } else {
        await criarUsuario(formData);
      }

      const data = await getUsuarios();
      setUsuarios(
        Array.isArray(data)
          ? data.map((u, i) => ({ ...u, id: u.id ?? `tmp-${i}` }))
          : [],
      );

      setFormData({
        nome: '',
        email: '',
        cpf: '',
        senha: '',
      });
      setUsuarioEditando(null);
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);

      let data = null;

      if (err.response && err.response.data) {
        data = err.response.data;
      } else if (err instanceof Response) {
        try {
          data = await err.json();
        } catch (_) {
          data = null;
        }
      }

      if (data) {
        if (data.erros && typeof data.erros === 'object') {
          setErros(data.erros);

          const firstKey = Object.keys(data.erros)[0];
          setMensagemErro(data.erros[firstKey]);
        } else if (data.mensagem) {
          setMensagemErro(data.mensagem);
        } else {
          setMensagemErro('Erro ao salvar usuário.');
        }
      } else {
        setMensagemErro('Erro de conexão com o servidor.');
      }
    }
  };

  const iniciarEdicao = (usuario) => {
    setUsuarioEditando(usuario);
    setFormData({ ...usuario });
    setMensagemErro('');
    setErros({});
  };

  const handleDeletar = async (id) => {
    try {
      await deletarUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      if (err instanceof Response) {
        try {
          const errorData = await err.json();
          setMensagemErro(errorData.mensagem || 'Erro ao deletar usuário.');
        } catch (_) {
          setMensagemErro('Erro ao deletar usuário.');
        }
      } else {
        setMensagemErro('Erro ao deletar usuário.');
      }
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    usuarios,
    iniciarEdicao,
    handleDeletar,
    usuarioEditando,
    mensagemErro,
    erros,
  };
}
