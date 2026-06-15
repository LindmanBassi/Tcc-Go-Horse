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

    private Integer vagas;

    @ManyToOne
    @JoinColumn(name = "local_id")
    private Local local;

    private Long palestranteId;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "evento_participantes",
            joinColumns = @JoinColumn(name = "evento_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private List<Usuario> participantes = new java.util.ArrayList<>();


}
