import React, { useState } from 'react';
import { useLocal } from '../../../hooks/useLocal';
import styles from '../../../styles/local.module.css';

function LocalComponent() {
  const {
    formData,
    handleChange,
    handleSubmit,
    locais,
    iniciarEdicao,
    handleDeletar,
    localEditando,
    handleBuscarCep,
    mensagemLocal,
  } = useLocal();

  const [mostrarForm, setMostrarForm] = useState(false);

  const toggleForm = () => setMostrarForm(!mostrarForm);

  return (
    <div className={styles.locaisContainer}>
      <div className={styles.locaisTitulo}>
        <span>{localEditando ? 'Atualizar Local' : 'Cadastro de Local'}</span>
        <button className={styles.expandButton} onClick={toggleForm}>
          {mostrarForm ? 'Fechar Formulário' : 'Expandir Formulário'}
        </button>
      </div>

      {mensagemLocal.text && (
        <div
          className={
            mensagemLocal.type === 'error'
              ? styles.errorMessage
              : styles.successMessage
          }
        >
          {mensagemLocal.text}
        </div>
      )}

      {mostrarForm && (
        <form onSubmit={handleSubmit} className={styles.locaisForm}>
          <label className={styles.locaisLabel}>
            Nome:
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={styles.locaisInput}
            />
          </label>

          <fieldset className={styles.fieldsetEndereco}>
            <legend className={styles.legendEndereco}>Endereço</legend>
            <div className={styles.cepContainer}>
              <label className={styles.locaisLabel}>
                CEP:
                <div className={styles.cepInputContainer}>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                    className={styles.locaisInput}
                  />
                  <button
                    type="button"
                    onClick={() => handleBuscarCep(formData.cep)}
                  >
                    Buscar CEP
                  </button>
                </div>
              </label>
            </div>

            <label className={styles.locaisLabel}>
              Número:
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className={styles.locaisInput}
              />
            </label>

            <label className={styles.locaisLabel}>
              Rua:
              <input
                type="text"
                name="rua"
                value={formData.rua}
                readOnly
                className={`${styles.locaisInput} ${styles.readonlyField}`}
              />
            </label>

            <label className={styles.locaisLabel}>
              Bairro:
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                readOnly
                className={`${styles.locaisInput} ${styles.readonlyField}`}
              />
            </label>

            <label className={styles.locaisLabel}>
              Cidade:
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                readOnly
                className={`${styles.locaisInput} ${styles.readonlyField}`}
              />
            </label>

            <label className={styles.locaisLabel}>
              Estado:
              <input
                type="text"
                name="estado"
                value={formData.estado}
                readOnly
                className={`${styles.locaisInput} ${styles.readonlyField}`}
              />
            </label>
          </fieldset>

          <label className={styles.locaisLabel}>
            Capacidade:
            <input
              type="number"
              name="capacidade"
              value={formData.capacidade}
              onChange={handleChange}
              className={styles.locaisInput}
            />
          </label>

          <button type="submit" className={styles.locaisSubmit}>
            {localEditando ? 'Atualizar' : 'Salvar'}
          </button>
        </form>
      )}

      <div className={styles.locaisLista}>
        <h2>Locais cadastrados</h2>
        {locais.length === 0 ? (
          <p>Não há locais disponíveis.</p>
        ) : (
          <ul>
            {locais.map((local) => (
              <li key={local.id}>
                {local.nome} - {local.cidade}, {local.estado}
                <div>
                  <button onClick={() => iniciarEdicao(local)}>Editar</button>
                  <button onClick={() => handleDeletar(local.id)}>
                    Deletar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default LocalComponent;
