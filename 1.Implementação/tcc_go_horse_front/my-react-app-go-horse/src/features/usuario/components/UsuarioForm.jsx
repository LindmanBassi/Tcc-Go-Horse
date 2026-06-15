import React, { useState } from 'react';
import { useUsuario } from '../../../hooks/useUsuario';
import styles from '../../../styles/usuario.module.css';

function UsuarioForm() {
  const {
    formData,
    handleChange,
    handleSubmit,
    usuarios,
    iniciarEdicao,
    handleDeletar,
    usuarioEditando,
    mensagemErro,
    erros,
  } = useUsuario();

  const [mostrarForm, setMostrarForm] = useState(false);
  const toggleForm = () => setMostrarForm(!mostrarForm);

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h2>{usuarioEditando ? 'Atualizar Usuário' : 'Cadastro de Usuário'}</h2>

        <button className={styles.expandButton} onClick={toggleForm}>
          {mostrarForm ? 'Fechar Formulário' : 'Expandir Formulário'}
        </button>
      </div>

      {mostrarForm && (
        <>
          {mensagemErro && (
            <div className={styles.errorMessage}>{mensagemErro}</div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              Nome:
              <input
                type="text"
                name="nome"
                value={formData.nome || ''}
                onChange={handleChange}
                required
                className={styles.input}
              />
              {erros.nome && (
                <div className={styles.fieldError}>{erros.nome}</div>
              )}
            </label>

            <label className={styles.label}>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
                className={styles.input}
              />
              {erros.email && (
                <div className={styles.fieldError}>{erros.email}</div>
              )}
            </label>

            <label className={styles.label}>
              CPF:
              <input
                type="text"
                name="cpf"
                value={formData.cpf || ''}
                onChange={handleChange}
                required
                className={styles.input}
              />
              {erros.cpf && (
                <div className={styles.fieldError}>{erros.cpf}</div>
              )}
            </label>

            <label className={styles.label}>
              Senha:
              <input
                type="password"
                name="senha"
                value={formData.senha || ''}
                onChange={handleChange}
                required
                className={styles.input}
              />
              {erros.senha && (
                <div className={styles.fieldError}>{erros.senha}</div>
              )}
            </label>

            <button type="submit" className={styles.submitButton}>
              {usuarioEditando ? 'Atualizar' : 'Cadastrar'}
            </button>
          </form>
        </>
      )}

      <div className={styles.listSection}>
        <h2>Usuários Cadastrados</h2>

        {usuarios.length === 0 ? (
          <p>Não há usuários cadastrados.</p>
        ) : (
          <ul className={styles.list}>
            {usuarios.map((u) => (
              <li key={u.id} className={styles.listItem}>
                <div className={styles.info}>
                  <p>
                    <strong>Nome:</strong> {u.nome}
                  </p>
                  <p>
                    <strong>Email:</strong> {u.email}
                  </p>
                  <p>
                    <strong>CPF:</strong> {u.cpf}
                  </p>
                </div>

                <div className={styles.actions}>
                  <button onClick={() => iniciarEdicao(u)}>Editar</button>
                  <button onClick={() => handleDeletar(u.id)}>Deletar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UsuarioForm;
