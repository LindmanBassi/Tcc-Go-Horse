package br.com.tcc_go_horse.repositories;

import br.com.tcc_go_horse.domain.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventoRepository extends JpaRepository<Evento,Long> {
}
