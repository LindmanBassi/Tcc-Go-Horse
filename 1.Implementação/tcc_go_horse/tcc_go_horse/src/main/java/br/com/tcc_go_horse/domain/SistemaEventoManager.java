package br.com.tcc_go_horse.domain;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SistemaEventoManager {

    private List<Usuario> usuarios = new ArrayList<>();

    private List<Evento> eventos = new ArrayList<>();

    private List<Local> locais = new ArrayList<>();

}