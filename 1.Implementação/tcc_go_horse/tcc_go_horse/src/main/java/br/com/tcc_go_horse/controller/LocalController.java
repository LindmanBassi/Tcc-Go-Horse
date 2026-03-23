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
        if (local.getNome() == null || local.getNome().isEmpty()) {
            throw new RuntimeException("Nome é obrigatório");
        }

        if (local.getCapacidade() <= 0) {
            throw new RuntimeException("Capacidade inválida");
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