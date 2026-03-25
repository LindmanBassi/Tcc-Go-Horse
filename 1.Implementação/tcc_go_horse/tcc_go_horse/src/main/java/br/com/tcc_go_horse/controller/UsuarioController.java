package br.com.tcc_go_horse.controller;

import br.com.tcc_go_horse.domain.Usuario;
import br.com.tcc_go_horse.repositories.UsuarioRepository;

import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/usuarios")
public class UsuarioController {


    private final UsuarioRepository usuarioRepository;

    @PostMapping
    public Usuario criar(@RequestBody Usuario usuario) {

        usuario.setId(null);

        if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            throw new RuntimeException("Nome é obrigatório");
        }

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new RuntimeException("Email é obrigatório");
        }

        if (!usuario.getEmail().contains("@") || !usuario.getEmail().contains(".")) {
            throw new RuntimeException("Email inválido");
        }

        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            throw new RuntimeException("Senha é obrigatória");
        }

        if (usuario.getSenha().length() < 6) {
            throw new RuntimeException("Senha deve ter no mínimo 6 caracteres");
        }

        if (usuario.getCpf() == null || usuario.getCpf().isBlank()) {
            throw new RuntimeException("CPF é obrigatório");
        }

        if (!usuario.getCpf().matches("\\d{11}")) {
            throw new RuntimeException("CPF deve ter 11 dígitos numéricos");
        }

        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        if (usuarioRepository.existsByCpf(usuario.getCpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }

        usuario.setCargo("VISITANTE");
        usuario.setDepartamento(null);


        usuario.setSenha(usuario.getSenha());

        return usuarioRepository.save(usuario);
    }

    @GetMapping
    public List<Usuario> listar() {

        List<Usuario> usuarios = usuarioRepository.findAll();

        usuarios.removeIf(u -> u.getCargo() == null || !u.getCargo().equals("VISITANTE"));

        return usuarios;
    }

    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable Long id) {

        Optional<Usuario> usuario = usuarioRepository.findById(id);

        if (usuario.isPresent()) {
            return usuario.get();
        }

        throw new RuntimeException("Usuário não encontrado");
    }

    @PutMapping("/{id}")
    public Usuario atualizar(@PathVariable Long id, @RequestBody Usuario novo) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);

        if (usuarioOpt.isPresent()) {

            Usuario usuario = usuarioOpt.get();

            usuario.setNome(novo.getNome());
            usuario.setEmail(novo.getEmail());
            usuario.setCpf(novo.getCpf());

            // senha em texto puro 😈
            if (novo.getSenha() != null) {
                usuario.setSenha(novo.getSenha());
            }

            if (usuarioRepository.existsByEmail(usuario.getEmail())) {
                throw new RuntimeException("Email já cadastrado");
            }

            if (usuarioRepository.existsByCpf(usuario.getCpf())) {
                throw new RuntimeException("CPF já cadastrado");
            }

            return usuarioRepository.save(usuario);
        }

        throw new RuntimeException("Usuário não encontrado");
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {

        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }

        usuarioRepository.deleteById(id);
    }
}