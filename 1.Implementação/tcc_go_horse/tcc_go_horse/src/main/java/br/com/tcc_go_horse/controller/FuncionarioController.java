package br.com.tcc_go_horse.controller;

import br.com.tcc_go_horse.domain.Usuario;
import br.com.tcc_go_horse.repositories.UsuarioRepository;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/funcionarios")
public class FuncionarioController {

    private  final UsuarioRepository usuarioRepository;

    @PostMapping
    public Usuario criar(@RequestBody Usuario usuario) {

        usuario.setId(null);

        if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            throw new RuntimeException("O nome é obrigatório");
        }

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new RuntimeException("O email é obrigatório");
        }

        if (!usuario.getEmail().contains("@") || !usuario.getEmail().contains(".")) {
            throw new RuntimeException("Informe um email válido.");
        }

        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            throw new RuntimeException("A senha é obrigatória");
        }

        if (usuario.getSenha().length() < 6) {
            throw new RuntimeException("Senha deve ter no mínimo 6 caracteres.");
        }

        if (usuario.getCpf() == null || usuario.getCpf().isBlank()) {
            throw new RuntimeException("O cpf é obrigatório");
        }
        if (usuario.getCargo() == null || usuario.getCargo().isBlank()) {
            throw new RuntimeException("O cargo é obrigatório.");
        }
        if (usuario.getDepartamento() == null || usuario.getDepartamento().isBlank()) {
            throw new RuntimeException("O departamento é obrigatório.");
        }

        if (!usuario.getCpf().matches("\\d{11}")) {
            throw new RuntimeException("O CPF deve conter 11 dígitos numéricos.");
        }

        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado!");
        }

        if (usuarioRepository.existsByCpf(usuario.getCpf())) {
            throw new RuntimeException("CPF já cadastrado!");
        }

        if (!usuario.getCargo().equals("GERENTE") &&
                !usuario.getCargo().equals("ANALISTA") &&
                !usuario.getCargo().equals("ESTAGIARIO") &&
                !usuario.getCargo().equals("COORDENADOR") &&
                !usuario.getCargo().equals("APRENDIZ"))
                {

            throw new RuntimeException("Cargo inválido");
        }

        if (!usuario.getDepartamento().equals("FINANCEIRO") &&
                !usuario.getDepartamento().equals("TI") &&
                !usuario.getDepartamento().equals("RH") &&
                !usuario.getDepartamento().equals("JURIDICO") &&
                !usuario.getDepartamento().equals("MARKETING")) {

            throw new RuntimeException("Departamento inválido");
        }

        usuario.setSenha(usuario.getSenha());

        return usuarioRepository.save(usuario);
    }

    @GetMapping
    public List<Usuario> listar() {

        List<Usuario> usuarios = usuarioRepository.findAll();

        usuarios.removeIf(u -> u.getCargo() == null || u.getCargo().equals("VISITANTE"));

        return usuarios;
    }

    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable Long id) {

        Optional<Usuario> usuario = usuarioRepository.findById(id);

        if (usuario.isPresent()) {
            return usuario.get();
        }

        throw new RuntimeException("Funcionário não encontrado");
    }

    @PutMapping("/{id}")
    public Usuario atualizar(@PathVariable Long id, @RequestBody Usuario novo) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);

        if (usuarioOpt.isPresent()) {

            Usuario usuario = usuarioOpt.get();

            if (novo.getNome() != null && !novo.getNome().isBlank()) {
                usuario.setNome(novo.getNome());
            }

            if (novo.getEmail() != null) {
                if (!novo.getEmail().contains("@") || !novo.getEmail().contains(".")) {
                    throw new RuntimeException("Informe um email válido.");
                }
                usuario.setEmail(novo.getEmail());
            }
            if (novo.getCpf() != null) {
                if (!novo.getCpf().matches("\\d{11}")) {
                    throw new RuntimeException("O CPF deve conter 11 dígitos numéricos.");
                }
                usuario.setCpf(novo.getCpf());
            }

            if (novo.getCargo() != null) {

                if (!novo.getCargo().equals("GERENTE") &&
                        !novo.getCargo().equals("ANALISTA") &&
                        !novo.getCargo().equals("ESTAGIARIO") &&
                        !novo.getCargo().equals("COORDENADOR") &&
                        !novo.getCargo().equals("APRENDIZ")) {

                    throw new RuntimeException("Cargo inválido");
                }

                usuario.setCargo(novo.getCargo());
            }
            if (novo.getDepartamento() != null) {

                if (!novo.getDepartamento().equals("FINANCEIRO") &&
                        !novo.getDepartamento().equals("TI") &&
                        !novo.getDepartamento().equals("RH") &&
                        !novo.getDepartamento().equals("JURIDICO") &&
                        !novo.getDepartamento().equals("MARKETING")) {

                    throw new RuntimeException("Departamento inválido");
                }

                usuario.setDepartamento(novo.getDepartamento());
            }

            if (novo.getSenha() != null) {
                if (novo.getSenha().length() < 6) {
                    throw new RuntimeException("A senha deve ter no mínimo 6 caracteres.");
                }
                usuario.setSenha(novo.getSenha());
            }

            if (usuarioRepository.existsByEmailAndIdNot(usuario.getEmail(), id)) {
                throw new RuntimeException("Email já cadastrado!");
            }

            if (usuarioRepository.existsByCpfAndIdNot(usuario.getCpf(), id)) {
                throw new RuntimeException("CPF já cadastrado!");
            }

            return usuarioRepository.save(usuario);
        }

        throw new RuntimeException("Funcionário não encontrado");
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {

        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Funcionário não encontrado");
        }

        usuarioRepository.deleteById(id);
    }
}