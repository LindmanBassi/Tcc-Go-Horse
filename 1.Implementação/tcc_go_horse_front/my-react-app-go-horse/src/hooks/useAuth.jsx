import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario, logoutUsuario } from '../api/authApi';
import { criarUsuario as cadastrarUsuario } from '../api/usuarioApi';

export function useAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
  });
  const [mensagemErro, setMensagemErro] = useState('');
  const [erros, setErros] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagemErro('');
    setErros({});

    try {
      if (isLogin) {
        await loginUsuario(formData.email, formData.senha);
        setFormData({ nome: '', email: '', senha: '', cpf: '' });
        navigate('/home');
      } else {
        await cadastrarUsuario({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          cpf: formData.cpf,
        });

        setMensagemErro('Cadastro realizado com sucesso!');
        setFormData({ nome: '', email: '', senha: '', cpf: '' });
        setIsLogin(true);
      }
    } catch (err) {
      console.error('Erro de autenticação/cadastro:', err);

      let data = null;

      if (err instanceof Response) {
        try {
          data = await err.json();
        } catch (_) {
          data = null;
        }
      } else if (err.response && err.response.data) {
        data = err.response.data;
      }

      if (data) {
        if (data.erros && typeof data.erros === 'object') {
          setErros(data.erros);
          const primeiraChave = Object.keys(data.erros)[0];
          setMensagemErro(data.erros[primeiraChave]);
        } else if (data.mensagem) {
          setMensagemErro(data.mensagem);
        } else {
          setMensagemErro('Erro inesperado do servidor.');
        }
      } else {
        setMensagemErro('Erro de conexão com o servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((v) => !v);
    setMensagemErro('');
    setErros({});
    setFormData({ nome: '', email: '', senha: '', cpf: '' });
  };

  const handleLogout = async () => {
    try {
      await logoutUsuario();
      localStorage.removeItem('token');
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    formData,
    isLogin,
    handleChange,
    handleSubmit,
    toggleMode,
    loading,
    mensagemErro,
    erros,
    handleLogout,
  };
}
