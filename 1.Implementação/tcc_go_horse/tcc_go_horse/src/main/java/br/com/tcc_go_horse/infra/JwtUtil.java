package br.com.tcc_go_horse.infra;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private final String secret = "chave-super-secreta-go-horse-123456789";
    private final Key key = Keys.hmacShaKeyFor(Base64.getEncoder().encode(secret.getBytes()));
    private final long expiracao = 1000 * 60 * 60; // 1h

    public String gerarToken(String email, String cargo, Long id) {
        return Jwts.builder()
                .setSubject(email)
                .claim("cargo", cargo)
                .claim("id", id)
                .setExpiration(new Date(System.currentTimeMillis() + expiracao))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String validarToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    public String getCargo(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .get("cargo", String.class);
        } catch (Exception e) {
            return null;
        }
    }
}