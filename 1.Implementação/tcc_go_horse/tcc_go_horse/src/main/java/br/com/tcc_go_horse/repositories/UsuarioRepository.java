package br.com.tcc_go_horse.repositories;

import br.com.tcc_go_horse.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
