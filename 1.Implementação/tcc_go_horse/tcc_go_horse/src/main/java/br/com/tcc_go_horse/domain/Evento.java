package br.com.tcc_go_horse.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity(name = "Evento")
@Table(name = "eventos")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipoEvento;

    private String estadoEvento;

    private Date data;

    private String descricao;

    private String titulo;

    private int vagas;

    private Long localId;

    private Long palestranteId;

    @Transient
    private List<Usuario> participantes;


}
