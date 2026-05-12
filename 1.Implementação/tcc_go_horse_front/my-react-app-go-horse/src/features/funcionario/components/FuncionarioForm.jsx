import React, { useState } from 'react';
import { useFuncionario } from '../../../hooks/useFuncionario';
import styles from '../../../styles/funcionario.module.css';

function FuncionarioForm() {
  const {
    formData,
    handleChange,
    handleSubmit,
    funcionarios,
    iniciarEdicao,
    handleDeletar,
    funcionarioEditando,
    mensagemErro,
    erros,
  } = useFuncionario();

  const cargos = [
    'GERENTE',
    'ANALISTA',
    'ESTAGIARIO',
    'COORDENADOR',
    'APRENDIZ',
    'VISITANTE',
  ];

  const departamentos = ['FINANCEIRO', 'TI', 'RH', 'JURIDICO', 'MARKETING'];

  const [mostrarForm, setMostrarForm] = useState(false);
  const toggleForm = () => setMostrarForm(!mostrarForm);

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h2>
          {funcionarioEditando
            ? 'Atualizar Funcionário'
            : 'Cadastro de Funcionário'}
        </h2>
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

            <label className={styles.label}>
              Cargo:
              <select
                name="cargo"
                value={formData.cargo || ''}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Selecione um cargo</option>
                {cargos.map((cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                ))}
              </select>
              {erros.cargo && (
                <div className={styles.fieldError}>{erros.cargo}</div>
              )}
            </label>

            <label className={styles.label}>
              Departamento:
              <select
                name="departamento"
                value={formData.departamento || ''}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Selecione um departamento</option>
                {departamentos.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
              {erros.departamento && (
                <div className={styles.fieldError}>{erros.departamento}</div>
              )}
            </label>

            <button type="submit" className={styles.submitButton}>
              {funcionarioEditando ? 'Atualizar' : 'Cadastrar'}
            </button>
          </form>
        </>
      )}

      <div className={styles.listSection}>
        <h2>Funcionários Cadastrados</h2>
        {funcionarios.length === 0 ? (
          <p>Não há funcionários cadastrados.</p>
        ) : (
          <ul className={styles.list}>
            {funcionarios.map((f) => (
              <li key={f.id} className={styles.listItem}>
                <div className={styles.info}>
                  <p>
                    <strong>Nome:</strong> {f.nome}
                  </p>
                  <p>
                    <strong>Email:</strong> {f.email}
                  </p>
                  <p>
                    <strong>CPF:</strong> {f.cpf}
                  </p>
                  <p>
                    <strong>Cargo:</strong> {f.cargo}
                  </p>
                  <p>
                    <strong>Departamento:</strong> {f.departamento}
                  </p>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => iniciarEdicao(f)}>Editar</button>
                  <button onClick={() => handleDeletar(f.id)}>Deletar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FuncionarioForm;
