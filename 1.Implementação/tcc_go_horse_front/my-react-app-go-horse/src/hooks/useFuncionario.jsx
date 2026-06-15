import { useState, useEffect } from 'react';
import {
  getFuncionarios,
  criarFuncionario,
  editarFuncionario,
  deletarFuncionario,
} from '../api/funcionarioApi';

export function useFuncionario() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    senha: '',
    cargo: '',
    departamento: '',
  });

  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionarioEditando, setFuncionarioEditando] = useState(null);
  const [mensagemErro, setMensagemErro] = useState('');
  const [erros, setErros] = useState({});

  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        const data = await getFuncionarios();
        setFuncionarios(
          Array.isArray(data)
            ? data.map((f, i) => ({ ...f, id: f.id ?? `tmp-${i}` }))
            : [],
        );
      } catch (err) {
        console.error(err);
        setMensagemErro('Erro ao carregar funcionários.');
      }
    }
    fetchFuncionarios();
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
      if (funcionarioEditando) {
        await editarFuncionario(funcionarioEditando.id, formData);
      } else {
        await criarFuncionario(formData);
      }

      const data = await getFuncionarios();
      setFuncionarios(
        Array.isArray(data)
          ? data.map((f, i) => ({ ...f, id: f.id ?? `tmp-${i}` }))
          : [],
      );

      setFormData({
        nome: '',
        email: '',
        cpf: '',
        senha: '',
        cargo: '',
        departamento: '',
      });
      setFuncionarioEditando(null);
    } catch (err) {
      console.error('Erro ao salvar funcionário:', err);

      let data = null;

      console.log(err);
      console.log(err.response);

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
        if (
          data.erros &&
          typeof data.erros === 'object' &&
          Object.keys(data.erros).length > 0
        ) {
          console.log(data);
          setErros(data.erros);

          const primeiraChave = Object.keys(data.erros)[0];
          setMensagemErro(data.erros[primeiraChave]);
        } else if (data.mensagem) {
          setMensagemErro(data.mensagem);
        } else {
          setMensagemErro(
            'Ocorreu um erro ao salvar funcionário. Consulte o console para mais detalhes.',
          );
        }
      } else {
        setMensagemErro('Erro de conexão com o servidor.');
      }
    }
  };

  const iniciarEdicao = (funcionario) => {
    setFuncionarioEditando(funcionario);
    setFormData({ ...funcionario });
    setMensagemErro('');
    setErros({});
  };

  const handleDeletar = async (id) => {
    try {
      await deletarFuncionario(id);
      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      if (err instanceof Response) {
        try {
          const errorData = await err.json();
          setMensagemErro(errorData.mensagem || 'Erro ao deletar funcionário.');
        } catch (_) {
          setMensagemErro('Erro ao deletar funcionário.');
        }
      } else {
        setMensagemErro('Erro ao deletar funcionário.');
      }
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    funcionarios,
    iniciarEdicao,
    handleDeletar,
    funcionarioEditando,
    mensagemErro,
    erros,
  };
}
