package br.com.tcc_go_horse.repositories;

import br.com.tcc_go_horse.domain.Local;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocalRepository extends JpaRepository<Local,Long> {
}
