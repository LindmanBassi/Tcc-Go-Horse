package br.com.tcc_go_horse.controller;

import br.com.tcc_go_horse.domain.Local;
import br.com.tcc_go_horse.repositories.LocalRepository;
import br.com.tcc_go_horse.repositories.EventoRepository;

import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/locais")
@AllArgsConstructor
public class LocalController {

    private final LocalRepository localRepository;

    private final EventoRepository eventoRepository;

    @PreAuthorize("!hasRole('VISITANTE')")
    @PostMapping
    public Local criar(@RequestBody Local local) {

        if (local.getNome() == null || local.getNome().isBlank()) {
            throw new RuntimeException("O nome é obrigatório.");
        }

        boolean nomeExiste = localRepository.findAll()
                .stream()
                .anyMatch(l -> l.getNome().equalsIgnoreCase(local.getNome()));

        if (nomeExiste) {
            throw new RuntimeException("Já existe um local com esse nome.");
        }

        if (local.getCapacidade() <= 0) {
            throw new RuntimeException("A capacidade deve ser maior que zero.");
        }

        if (local.getCep() == null || local.getCep().isBlank()) {
            throw new RuntimeException("O CEP é obrigatório.");
        }

        if (!local.getCep().matches("\\d{5}-?\\d{3}")) {
            throw new RuntimeException("CEP inválido ou não encontrado.");
        }

        if (local.getNumero() <= 0) {
            throw new RuntimeException("O número é obrigatório.");
        }

        try {
            String url = "https://viacep.com.br/ws/" + local.getCep() + "/json/";
            RestTemplate restTemplate = new RestTemplate();

            Map response = restTemplate.getForObject(url, Map.class);

            if (response == null || response.get("logradouro") == null) {
                throw new RuntimeException("CEP inválido ou não encontrado.");
            }

            local.setRua((String) response.get("logradouro"));
            local.setBairro((String) response.get("bairro"));
            local.setCidade((String) response.get("localidade"));
            local.setEstado((String) response.get("uf"));

        } catch (Exception e) {
            throw new RuntimeException("Erro ao consultar CEP");
        }
        return localRepository.save(local);
    }

    @PreAuthorize("!hasRole('VISITANTE')")
    @GetMapping
    public List<Local> listar() {
        return localRepository.findAll();
    }

    @PreAuthorize("!hasRole('VISITANTE')")
    @GetMapping("/{id}")
    public Local buscarPorId(@PathVariable Long id) {

        Optional<Local> local = localRepository.findById(id);

        if (local.isPresent()) {
            return local.get();
        } else {
            throw new RuntimeException("Local não encontrado");
        }
    }

    @PreAuthorize("!hasRole('VISITANTE')")
    @PutMapping("/{id}")
    public Local atualizar(@PathVariable Long id, @RequestBody Local novoLocal) {

        Optional<Local> localOpt = localRepository.findById(id);

        if (localOpt.isPresent()) {

            Local local = localOpt.get();

            if (novoLocal.getNome() != null) {

                boolean nomeExiste = localRepository.findAll()
                        .stream()
                        .anyMatch(l -> l.getNome().equalsIgnoreCase(novoLocal.getNome())
                                && !l.getId().equals(id));

                if (nomeExiste) {
                    throw new RuntimeException("Já existe um local com esse nome.");
                }

                local.setNome(novoLocal.getNome());
            }

            if (novoLocal.getCapacidade() != null && novoLocal.getCapacidade() > 0) {

                boolean temEventoInvalido = eventoRepository.findAll().stream()
                        .anyMatch(e -> e.getLocal() != null
                                && e.getLocal().getId().equals(id)
                                && e.getVagas() > novoLocal.getCapacidade());

                if (temEventoInvalido) {
                    throw new RuntimeException("Capacidade menor que vagas de eventos existentes");
                }

                local.setCapacidade(novoLocal.getCapacidade());
            }

            local.setCidade(novoLocal.getCidade());
            local.setEstado(novoLocal.getEstado());
            local.setRua(novoLocal.getRua());
            local.setNumero(novoLocal.getNumero());
            local.setBairro(novoLocal.getBairro());
            if (novoLocal.getCep() != null) {

                if (!novoLocal.getCep().matches("\\d{5}-?\\d{3}")) {
                    throw new RuntimeException("CEP inválido");
                }

                try {
                    String url = "https://viacep.com.br/ws/" + novoLocal.getCep() + "/json/";
                    RestTemplate restTemplate = new RestTemplate();

                    Map response = restTemplate.getForObject(url, Map.class);

                    if (response == null || response.get("logradouro") == null) {
                        throw new RuntimeException("CEP inválido ou não encontrado");
                    }

                    local.setRua((String) response.get("logradouro"));
                    local.setBairro((String) response.get("bairro"));
                    local.setCidade((String) response.get("localidade"));
                    local.setEstado((String) response.get("uf"));
                    local.setCep(novoLocal.getCep());

                } catch (Exception e) {
                    throw new RuntimeException("Erro ao consultar CEP");
                }
            }

            return localRepository.save(local);

        } else {
            throw new RuntimeException("Local não encontrado");
        }
    }

    @PreAuthorize("!hasRole('VISITANTE')")
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {

        Optional<Local> local = localRepository.findById(id);

        if (local.isPresent()) {

            boolean temEvento = eventoRepository.findAll()
                    .stream()
                    .anyMatch(e -> e.getLocal() != null
                            && e.getLocal().getId().equals(id));

            if (temEvento) {
                throw new RuntimeException("Não é possível deletar local com eventos vinculados");
            }

            localRepository.deleteById(id);

        } else {
            throw new RuntimeException("Local não encontrado");
        }
    }
}