package br.com.tcc_go_horse.controller;

import br.com.tcc_go_horse.domain.Usuario;
import br.com.tcc_go_horse.infra.JwtUtil;
import br.com.tcc_go_horse.repositories.UsuarioRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public String login(@RequestBody Usuario login, HttpServletResponse response) {

        if (login.getEmail() == null || login.getEmail().isBlank()) {
            throw new RuntimeException("Email obrigatório");
        }

        if (login.getSenha() == null || login.getSenha().isBlank()) {
            throw new RuntimeException("Senha obrigatória");
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(login.getEmail());

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Credenciais inválidas");
        }

        Usuario usuario = usuarioOpt.get();

        if (!passwordEncoder.matches(login.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        String token = jwtUtil.gerarToken(usuario.getEmail(), usuario.getCargo(), usuario.getId());

        Cookie cookie = new Cookie("Authorization", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60);


        cookie.setSecure(false);


        response.addCookie(cookie);

        return token;
    }

    @PostMapping("/logout")
    public String logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("Authorization", "");
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        return "Logout realizado";
    }
}