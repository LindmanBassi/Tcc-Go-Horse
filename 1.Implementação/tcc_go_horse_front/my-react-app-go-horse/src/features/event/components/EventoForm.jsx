import React, { useState } from 'react';
import { useEvent } from '../../../hooks/useEvento';
import styles from '../../../styles/evento.module.css';

function EventoForm() {
  const {
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
  } = useEvent();

  const [mostrarForm, setMostrarForm] = useState(false);
  const toggleForm = () => setMostrarForm(!mostrarForm);

  const mostrarLocal =
    formData.tipoEvento === 'PRESENCIAL' || formData.tipoEvento === 'HIBRIDO';

  return (
    <div className={styles.eventContainer}>
      <div className={styles.eventTitle}>
        <span>
          {eventoEditando ? 'Atualizar Evento' : 'Cadastro de Evento'}
        </span>
        <button className={styles.expandButton} onClick={toggleForm}>
          {mostrarForm ? 'Fechar Formulário' : 'Expandir Formulário'}
        </button>
      </div>

      {mostrarForm && (
        <>
          {mensagemErro && (
            <div className={styles.errorMessage}>{mensagemErro}</div>
          )}

          <form onSubmit={handleSubmit} className={styles.eventForm}>
            <label className={styles.eventLabel}>
              Título:
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className={styles.eventInput}
              />
              {erros.titulo && (
                <div className={styles.fieldError}>{erros.titulo}</div>
              )}
            </label>

            <label className={styles.eventLabel}>
              Descrição:
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
                className={styles.eventInput}
              />
              {erros.descricao && (
                <div className={styles.fieldError}>{erros.descricao}</div>
              )}
            </label>

            <label className={styles.eventLabel}>
              Data e Hora:
              <input
                type="datetime-local"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
                className={styles.eventInput}
              />
              {erros.data && (
                <div className={styles.fieldError}>{erros.data}</div>
              )}
            </label>

            <label className={styles.eventLabel}>
              Tipo do Evento:
              <select
                name="tipoEvento"
                value={formData.tipoEvento}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="REMOTO">Remoto</option>
                <option value="PRESENCIAL">Presencial</option>
                <option value="HIBRIDO">Híbrido</option>
              </select>
              {erros.tipoEvento && (
                <div className={styles.fieldError}>{erros.tipoEvento}</div>
              )}
            </label>

            <label className={styles.eventLabel}>
              Número de Vagas:
              <input
                type="number"
                name="vagas"
                value={formData.vagas}
                onChange={handleChange}
                min="1"
                required
                className={styles.eventInput}
              />
              {erros.vagas && (
                <div className={styles.fieldError}>{erros.vagas}</div>
              )}
            </label>

            {mostrarLocal && (
              <label className={styles.eventLabel}>
                Local:
                <select
                  name="localId"
                  value={formData.localId}
                  onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">Selecione um local</option>
                  {locais.map((local) => (
                 <option key={local.id} value={local.id}>
                      {local.nome} - {local?.cidade || 'Sem cidade'}, {local?.estado || 'Sem estado'}
                 </option>
                  ))}
                </select>
                {erros.localId && (
                  <div className={styles.fieldError}>{erros.localId}</div>
                )}
              </label>
            )}

            <label className={styles.eventLabel}>
              Palestrante:
              <select
                name="palestranteId"
                value={formData.palestranteId}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Selecione um palestrante</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nome} - {usuario.email}
                  </option>
                ))}
              </select>
              {erros.palestranteId && (
                <div className={styles.fieldError}>{erros.palestranteId}</div>
              )}
            </label>

            <button type="submit" className={styles.eventSubmit}>
              {eventoEditando ? 'Atualizar' : 'Cadastrar'}
            </button>
          </form>
        </>
      )}

      <div className={styles.eventList}>
        <h2>Eventos Cadastrados</h2>
        {eventos.length === 0 ? (
          <p>Não há eventos cadastrados.</p>
        ) : (
          <ul>
            {eventos.map((evento) => (
              <li key={evento.id}>
                <div className={styles.eventInfo}>
                  <h3>{evento.titulo}</h3>
                  <p>
                    <strong>Data:</strong>{' '}
                    {new Date(evento.data).toLocaleString('pt-BR')}
                  </p>
                  <p>
                    <strong>Tipo:</strong> {evento.tipoEvento}
                  </p>
                  <p>
                    <strong>Estado:</strong> {evento.estadoEvento}
                  </p>
                  <p>
                    <strong>Vagas:</strong> {evento.vagas}
                  </p>
                </div>
                <div className={styles.eventActions}>
                  <button onClick={() => iniciarEdicao(evento)}>Editar</button>
                  <button onClick={() => handleDeletar(evento.id)}>
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

export default EventoForm;
