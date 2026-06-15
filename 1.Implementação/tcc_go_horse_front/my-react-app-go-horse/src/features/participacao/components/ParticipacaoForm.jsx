import React from 'react';
import { useParticipacao } from '../../../hooks/useParticipacao';
import styles from '../../../styles/participacao.module.css';

function ParticipacaoForm() {
  const {
    eventos,
    eventoSelecionado,
    setEventoSelecionado,
    participantes,
    handleParticipar,
    meusEventos,
    mensagemParticipacao,
    userRole,
    localDetalhes,
  } = useParticipacao();

  const getMessageClass = (type) => {
    if (type === 'error') return styles.errorMessage;
    if (type === 'success') return styles.successMessage;
    return '';
  };

  const isVisitante = userRole === 'VISITANTE';

  const formatarData = (dataString) => {
    if (!dataString) return 'Data/Hora indisponível';
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

const formatarEndereco = (local) => {
  if (!local) return 'Local não encontrado ou Remoto';

  const ruaCompleta = `${local.rua || ''}, ${local.numero || 'S/N'}`;
  const cidadeEstado = `${local.cidade || ''} - ${local.estado || ''}`;

  return (
    <>
      <p>
        <strong>Nome:</strong> {local.nome}
      </p>
      <p>
        <strong>Endereço:</strong> {ruaCompleta}
      </p>
      <p>
        <strong>Bairro:</strong> {local.bairro}
      </p>
      <p>
        <strong>Localidade:</strong> {cidadeEstado}
      </p>
      <p>
        <strong>CEP:</strong> {local.cep}
      </p>
    </>
  );
};

  return (
    <div className={styles.partContainer}>
      <h2 className={styles.partTitle}>Participar de Eventos</h2>

      <form className={styles.partForm} onSubmit={(e) => e.preventDefault()}>
        <label className={styles.partLabel}>
          Selecione um evento:
          <select
            name="evento"
            value={eventoSelecionado?.id ?? ''}
            onChange={(e) => {
              const id = e.target.value;
              const evento = eventos.find((ev) => String(ev.id) === String(id));
              setEventoSelecionado(evento || null);
            }}
            required
            className={styles.select}
          >
            <option value="">Escolha um evento</option>
            {eventos.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.titulo} — {ev.data ? formatarData(ev.data) : 'Sem Data'}
              </option>
            ))}
          </select>
        </label>

        {mensagemParticipacao.text && (
          <div className={getMessageClass(mensagemParticipacao.type)}>
            {mensagemParticipacao.text}
          </div>
        )}

        {eventoSelecionado && (
          <button
            type="button"
            onClick={() => handleParticipar(eventoSelecionado.id)}
            className={styles.partButton}
          >
            Participar
          </button>
        )}
      </form>

      {eventoSelecionado && (
        <div className={styles.partSection}>
          <h3 className={styles.sectionTitle}>
            Detalhes: {eventoSelecionado.titulo}
          </h3>
          <div className={styles.detailsBox}>
            <p>
              <strong>Descrição:</strong> {eventoSelecionado.descricao}
            </p>
            <p>
              <strong>Data/Hora:</strong> {formatarData(eventoSelecionado.data)}
            </p>
            <p>
              <strong>Tipo:</strong> {eventoSelecionado.tipoEvento}
            </p>

            {eventoSelecionado.tipoEvento === 'PRESENCIAL' && eventoSelecionado.local ? (
              <>
                <p>
                  <strong>Local:</strong>
                </p>
                <div
                  style={{
                    marginLeft: '1rem',
                    borderLeft: '3px solid #ccc',
                    paddingLeft: '10px',
                  }}
                >
                 {localDetalhes ? formatarEndereco(localDetalhes) : 'Carregando local...'}
                </div>
              </>
            ) : (
              <p>
                <strong>Local:</strong> Remoto ou Local não especificado.
              </p>
            )}

            <p>
              <strong>Estado:</strong> {eventoSelecionado.estadoEvento}
            </p>
            <p>
              <strong>Vagas disponíveis:</strong> {eventoSelecionado.vagas}
            </p>
          </div>
        </div>
      )}

      {eventoSelecionado && !isVisitante && (
        <div className={styles.partSection}>
          <h3 className={styles.sectionTitle}>
            Participantes de "{eventoSelecionado.titulo}"
          </h3>
          {participantes.length === 0 ? (
            <p className={styles.emptyText}>Nenhum participante ainda.</p>
          ) : (
            <ul className={styles.list}>
              {participantes.map((user, i) => (
                <li key={user.id ?? user.cpf ?? i} className={styles.listItem}>
                  {user.nome ?? user.email ?? 'Usuário'}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 3. BLOCO: Meus Eventos */}
      <div className={styles.partSection}>
        <h2 className={styles.sectionTitle}>Meus Eventos</h2>
        {meusEventos.length === 0 ? (
          <p className={styles.emptyText}>
            Você ainda não participa de nenhum evento.
          </p>
        ) : (
          <ul className={styles.list}>
            {meusEventos.map((ev) => (
              <li key={ev.id} className={styles.listItem}>
                {ev.titulo} — {new Date(ev.data).toLocaleString('pt-BR')}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ParticipacaoForm;
