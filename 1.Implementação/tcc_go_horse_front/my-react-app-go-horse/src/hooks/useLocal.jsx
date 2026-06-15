import { useState, useEffect } from 'react';
import {
  criarLocal,
  getLocais,
  editarLocal,
  deletarLocal,
} from '../api/localApi';

export function useLocal() {
  const [locais, setLocais] = useState([]);
  const [localEditando, setLocalEditando] = useState(null);
  const [mensagemLocal, setMensagemLocal] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
  nome: '',
  capacidade: '',
  cep: '',
  rua: '',
  bairro: '',
  numero: '',
  cidade: '',
  estado: '',
});

  // Mantida como estava
  const buscarCepViaCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error('CEP não encontrado');

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      throw error;
    }
  };

  const fetchLocais = async () => {
    try {
      const data = await getLocais();
      setLocais(data);
    } catch (error) {
      console.error('Erro ao buscar locais:', error);
      setMensagemLocal({
        text: 'Erro ao carregar os locais.',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    fetchLocais();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

   setFormData((prev) => ({
  ...prev,
  [name]: value,
}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemLocal({ text: '', type: '' });

    try {
      if (localEditando) {
        await editarLocal(localEditando.id, formData);
        setMensagemLocal({
          text: 'Local atualizado com sucesso!',
          type: 'success',
        });
      } else {
        await criarLocal(formData);
        setMensagemLocal({
          text: 'Local criado com sucesso!',
          type: 'success',
        });
      }

      await fetchLocais();
      setLocalEditando(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar local:', error);

      // VALIDATION ERROR (igual o de participação)
      if (error.type === 'validation' && error.erros) {
        const firstError = Object.values(error.erros)[0]; // primeira mensagem do objeto
        setMensagemLocal({ text: firstError, type: 'error' });
        return;
      }

      setMensagemLocal({
        text: error.message || 'Erro ao salvar local.',
        type: 'error',
      });
    }
  };

  const handleDeletar = async (id) => {
    try {
      await deletarLocal(id);
      setMensagemLocal({
        text: 'Local deletado com sucesso!',
        type: 'success',
      });
      await fetchLocais();
    } catch (error) {
      console.error('Erro ao deletar local:', error);

      setMensagemLocal({
        text: error.message || 'Erro ao deletar local.',
        type: 'error',
      });
    }
  };

  const handleBuscarCep = async (cep) => {
    try {
      const data = await buscarCepViaCep(cep);

      if (data.erro) {
        setMensagemLocal({ text: 'CEP não encontrado.', type: 'error' });
        return;
      }

      setFormData((prev) => ({
        ...prev,
         rua: data.logradouro || '',
  bairro: data.bairro || '',
  cidade: data.localidade || '',
  estado: data.uf || '',
      }));

      setMensagemLocal({ text: '', type: '' });
    } catch (error) {
      setMensagemLocal({
        text: 'Erro ao buscar o CEP.',
        type: 'error',
      });
    }
  };

  const iniciarEdicao = (local) => {
    setLocalEditando(local);
    setFormData(local);
  };

  const resetForm = () => {
 setFormData({
  nome: '',
  capacidade: '',
  cep: '',
  rua: '',
  bairro: '',
  numero: '',
  cidade: '',
  estado: '',
});
  };

  return {
    locais,
    formData,
    handleChange,
    handleSubmit,
    iniciarEdicao,
    handleDeletar,
    handleBuscarCep,
    localEditando,
    mensagemLocal,
  };
}
