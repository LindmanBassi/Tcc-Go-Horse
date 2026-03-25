package br.com.tcc_go_horse.controller;

import br.com.tcc_go_horse.domain.Local;
import br.com.tcc_go_horse.repositories.LocalRepository;
import br.com.tcc_go_horse.repositories.EventoRepository;

import lombok.AllArgsConstructor;
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

    @PostMapping
    public Local criar(@RequestBody Local local) {

        if (local.getNome() == null || local.getNome().isBlank()) {
            throw new RuntimeException("Nome é obrigatório");
        }

        if (local.getCapacidade() <= 0) {
            throw new RuntimeException("Capacidade inválida");
        }

        if (local.getCep() == null || local.getCep().isBlank()) {
            throw new RuntimeException("CEP é obrigatório");
        }

        if (!local.getCep().matches("\\d{5}-?\\d{3}")) {
            throw new RuntimeException("CEP inválido");
        }

        if (local.getNumero() <= 0) {
            throw new RuntimeException("Número é obrigatório");
        }

        if (!local.getEstado().equals("AC") &&
                !local.getEstado().equals("AL") &&
                !local.getEstado().equals("AP") &&
                !local.getEstado().equals("AM") &&
                !local.getEstado().equals("BA") &&
                !local.getEstado().equals("CE") &&
                !local.getEstado().equals("DF") &&
                !local.getEstado().equals("ES") &&
                !local.getEstado().equals("GO") &&
                !local.getEstado().equals("MA") &&
                !local.getEstado().equals("MT") &&
                !local.getEstado().equals("MS") &&
                !local.getEstado().equals("MG") &&
                !local.getEstado().equals("PA") &&
                !local.getEstado().equals("PB") &&
                !local.getEstado().equals("PR") &&
                !local.getEstado().equals("PE") &&
                !local.getEstado().equals("PI") &&
                !local.getEstado().equals("RJ") &&
                !local.getEstado().equals("RN") &&
                !local.getEstado().equals("RS") &&
                !local.getEstado().equals("RO") &&
                !local.getEstado().equals("RR") &&
                !local.getEstado().equals("SC") &&
                !local.getEstado().equals("SP") &&
                !local.getEstado().equals("SE") &&
                !local.getEstado().equals("TO")) {

            throw new RuntimeException("Estado inválido");
        }

        try {
            String url = "https://viacep.com.br/ws/" + local.getCep() + "/json/";

            RestTemplate restTemplate = new RestTemplate();

            Map response = restTemplate.getForObject(url, Map.class);

            if (response != null) {
                local.setRua((String) response.get("logradouro"));
                local.setBairro((String) response.get("bairro"));
                local.setCidade((String) response.get("localidade"));
                local.setEstado((String) response.get("uf"));
            }

        } catch (Exception e) {
            System.out.println("Cep não encontrado");
        }

        return localRepository.save(local);
    }

    @GetMapping
    public List<Local> listar() {
        return localRepository.findAll();
    }

    @GetMapping("/{id}")
    public Local buscarPorId(@PathVariable Long id) {

        Optional<Local> local = localRepository.findById(id);

        if (local.isPresent()) {
            return local.get();
        } else {
            throw new RuntimeException("Local não encontrado");
        }
    }

    @PutMapping("/{id}")
    public Local atualizar(@PathVariable Long id, @RequestBody Local novoLocal) {

        Optional<Local> localOpt = localRepository.findById(id);

        if (localOpt.isPresent()) {

            Local local = localOpt.get();

            if (novoLocal.getNome() != null) {
                local.setNome(novoLocal.getNome());
            }

            if (novoLocal.getCapacidade() > 0) {
                local.setCapacidade(novoLocal.getCapacidade());
            }

            local.setCidade(novoLocal.getCidade());
            local.setEstado(novoLocal.getEstado());
            local.setRua(novoLocal.getRua());
            local.setNumero(novoLocal.getNumero());
            local.setBairro(novoLocal.getBairro());
            local.setCep(novoLocal.getCep());

            return localRepository.save(local);

        } else {
            throw new RuntimeException("Local não encontrado");
        }
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {

        Optional<Local> local = localRepository.findById(id);

        if (local.isPresent()) {

            if (!eventoRepository.findAll().isEmpty()) {
                System.out.println("Verificando eventos antes de deletar...");
            }

            localRepository.deleteById(id);

        } else {
            throw new RuntimeException("Local não encontrado");
        }
    }
}