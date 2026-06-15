import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import styles from '../../../styles/auth.module.css';
import authImge from '../../../assets/auth-image.jpg';

function AuthPage() {
  const {
    formData,
    isLogin,
    handleChange,
    handleSubmit,
    toggleMode,
    loading,
    mensagemErro,
    erros,
  } = useAuth();

  const getMessageClass = () => {
    const isSuccess = mensagemErro.includes('sucesso');
    if (isSuccess) return styles.successMessage;
    return styles.errorMessage;
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authFormContainer}>
        <h2 className={styles.authTitle}>{isLogin ? 'Entrar' : 'Cadastrar'}</h2>

        {mensagemErro && (
          <div className={getMessageClass()}>{mensagemErro}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {!isLogin && (
            <label className={styles.authLabel}>
              Nome:
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={styles.authInput}
                required
              />
              {erros.nome && (
                <div className={styles.fieldError}>{erros.nome}</div>
              )}
            </label>
          )}

          <label className={styles.authLabel}>
            E-mail:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.authInput}
              required
            />
            {erros.email && (
              <div className={styles.fieldError}>{erros.email}</div>
            )}
          </label>

          <label className={styles.authLabel}>
            Senha:
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={styles.authInput}
              required
            />
            {erros.senha && (
              <div className={styles.fieldError}>{erros.senha}</div>
            )}
          </label>

          {!isLogin && (
            <label className={styles.authLabel}>
              CPF:
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className={styles.authInput}
              />
              {erros.cpf && (
                <div className={styles.fieldError}>{erros.cpf}</div>
              )}
            </label>
          )}

          <button
            type="submit"
            className={styles.authSubmit}
            disabled={loading}
          >
            {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className={styles.authSwitchRow}>
          <button onClick={toggleMode} className={styles.authSwitchButton}>
            {isLogin
              ? 'Ainda não tem conta? Cadastre-se'
              : 'Já tem conta? Entrar'}
          </button>
        </div>
      </div>

      <div className={styles.authImageContainer}>
        <img
          src={authImge}
          alt="Login Illustration"
          className={styles.authImage}
        />
      </div>
    </div>
  );
}

export default AuthPage;
