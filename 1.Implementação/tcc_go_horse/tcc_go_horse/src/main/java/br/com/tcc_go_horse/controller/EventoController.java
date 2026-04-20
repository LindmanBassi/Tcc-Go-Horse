package br.com.tcc_go_horse.controller;

import br.com.tcc_go_horse.domain.Evento;
import br.com.tcc_go_horse.domain.Usuario;
import br.com.tcc_go_horse.domain.Local;
import br.com.tcc_go_horse.repositories.EventoRepository;
import br.com.tcc_go_horse.repositories.UsuarioRepository;
import br.com.tcc_go_horse.repositories.LocalRepository;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/eventos")


@AllArgsConstructor
public class EventoController {

    private final EventoRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LocalRepository localRepository;

    @PostMapping
    public Evento criar(@RequestBody Evento evento) {

        if (evento.getTitulo() == null || evento.getTitulo().isBlank()) {
            throw new RuntimeException("Titulo obrigatório");
        }

        if (evento.getDescricao() == null || evento.getDescricao().isBlank()) {
            throw new RuntimeException("Descricao obrigatória");
        }

        if (evento.getVagas() <= 0) {
            throw new RuntimeException("Vagas inválidas");
        }

        if (evento.getData() == null) {
            throw new RuntimeException("Data obrigatória");
        }

        if (evento.getTipoEvento() == null ||
                (!evento.getTipoEvento().equals("REMOTO") &&
                        !evento.getTipoEvento().equals("PRESENCIAL") &&
                        !evento.getTipoEvento().equals("HIBRIDO"))) {

            throw new RuntimeException("Tipo de evento inválido");
        }

        if (evento.getEstadoEvento() == null ||
                (!evento.getEstadoEvento().equals("ABERTO") &&
                        !evento.getEstadoEvento().equals("FECHADO"))) {

            throw new RuntimeException("Estado do evento inválido");
        }

            boolean tituloExiste = eventoRepository.findAll()
                    .stream()
                    .anyMatch(e -> e.getTitulo().equalsIgnoreCase(evento.getTitulo()));

            if (tituloExiste) {
                throw new RuntimeException("Título já cadastrado");
            }

        if (!evento.getTipoEvento().equals("REMOTO")) {

            if (evento.getLocalId() == null) {
                throw new RuntimeException("Local obrigatório para evento presencial");
            }

            Optional<Local> localOpt = localRepository.findById(evento.getLocalId());

            if (localOpt.isEmpty()) {
                throw new RuntimeException("Local não encontrado");
            }
            Local local = localOpt.get();

            if (evento.getVagas() > local.getCapacidade()) {
                throw new RuntimeException("Vagas maior que capacidade do local");
            }

        } else {
            evento.setLocalId(null);
        }

        if (evento.getPalestranteId() != null) {

            Optional<Usuario> userOpt = usuarioRepository.findById(evento.getPalestranteId());

            if (userOpt.isEmpty()) {
                throw new RuntimeException("Palestrante não encontrado");
            }

            Usuario palestrante = userOpt.get();

            if (palestrante.getCargo() != null &&
                    palestrante.getCargo().equals("VISITANTE")) {

                throw new RuntimeException("Visitante não pode ser palestrante");
            }
        }

        if (evento.getData().before(new Date())) {
            evento.setEstadoEvento("FECHADO");
        }

        return eventoRepository.save(evento);
    }

    @GetMapping
    public List<Evento> listar() {
        return eventoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Evento buscarPorId(@PathVariable Long id) {

        Optional<Evento> evento = eventoRepository.findById(id);

        if (evento.isPresent()) {
            return evento.get();
        } else {
            throw new RuntimeException("Evento não encontrado");
        }
    }

    @PutMapping("/{id}")
    public Evento atualizar(@PathVariable Long id, @RequestBody Evento novoEvento) {

        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

        if ("FECHADO".equals(evento.getEstadoEvento())) {
            throw new RuntimeException("Evento já fechado");
        }
        if (novoEvento.getTitulo() != null && !novoEvento.getTitulo().isBlank()) {

            boolean tituloExiste = eventoRepository.findAll()
                    .stream()
                    .anyMatch(e -> e.getTitulo().equalsIgnoreCase(novoEvento.getTitulo())
                            && !e.getId().equals(id));

            if (tituloExiste) {
                throw new RuntimeException("Título já cadastrado");
            }

            evento.setTitulo(novoEvento.getTitulo());
        }
        if (novoEvento.getDescricao() != null && !novoEvento.getDescricao().isBlank()) {
            evento.setDescricao(novoEvento.getDescricao());
        }
        if (novoEvento.getVagas() != null && novoEvento.getVagas() > 0) {
            evento.setVagas(novoEvento.getVagas());
        }
        if (novoEvento.getData() != null) {
            evento.setData(novoEvento.getData());
        }
        if (evento.getData() != null && evento.getData().before(new Date())) {
            evento.setEstadoEvento("FECHADO");
        } else if (novoEvento.getEstadoEvento() != null) {
            evento.setEstadoEvento(novoEvento.getEstadoEvento());
        }
        String tipoFinal = novoEvento.getTipoEvento() != null
                ? novoEvento.getTipoEvento()
                : evento.getTipoEvento();

        if (tipoFinal != null &&
                !tipoFinal.equals("REMOTO") &&
                !tipoFinal.equals("PRESENCIAL") &&
                !tipoFinal.equals("HIBRIDO")) {

            throw new RuntimeException("Tipo de evento inválido");
        }

        if (novoEvento.getTipoEvento() != null) {
            evento.setTipoEvento(novoEvento.getTipoEvento());
        }

        if (!"REMOTO".equals(tipoFinal)) {

            if (novoEvento.getLocalId() != null) {

                Local local = localRepository.findById(novoEvento.getLocalId())
                        .orElseThrow(() -> new RuntimeException("Local não encontrado"));

                if (evento.getVagas() != null && evento.getVagas() > local.getCapacidade()) {
                    throw new RuntimeException("Vagas maior que capacidade do local");
                }

                evento.setLocalId(novoEvento.getLocalId());
            }

        } else {
            evento.setLocalId(null);
        }
        if (novoEvento.getPalestranteId() != null) {

            Usuario palestrante = usuarioRepository.findById(novoEvento.getPalestranteId())
                    .orElseThrow(() -> new RuntimeException("Palestrante não encontrado"));

            if ("VISITANTE".equals(palestrante.getCargo())) {
                throw new RuntimeException("Visitante não pode ser palestrante");
            }

            evento.setPalestranteId(novoEvento.getPalestranteId());
        }

        return eventoRepository.save(evento);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {

        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

        if (evento.getParticipantes() != null && !evento.getParticipantes().isEmpty()) {
            throw new RuntimeException("Evento possui participantes e não pode ser deletado");
        }

        eventoRepository.deleteById(id);
    }

    @PostMapping("/{eventoId}/participar/{usuarioId}")
    public Evento participar(@PathVariable Long eventoId, @PathVariable Long usuarioId) {

        Optional<Evento> eventoOpt = eventoRepository.findById(eventoId);
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);

        if (eventoOpt.isEmpty() || usuarioOpt.isEmpty()) {
            throw new RuntimeException("Evento ou usuário não encontrado");
        }

        Evento evento = eventoOpt.get();
        Usuario usuario = usuarioOpt.get();

        List<Usuario> participantes = evento.getParticipantes();

        if (participantes == null) {
            participantes = new java.util.ArrayList<>();
        }

        if (participantes.contains(usuario)) {
            throw new RuntimeException("Usuário já inscrito");
        }

        if (participantes.size() >= evento.getVagas()) {
            throw new RuntimeException("Evento lotado");
        }
        if ("FECHADO".equals(evento.getEstadoEvento())) {
            throw new RuntimeException("Evento está fechado");
        }
        participantes.add(usuario);

        evento.setParticipantes(participantes);

        return eventoRepository.save(evento);
    }
}