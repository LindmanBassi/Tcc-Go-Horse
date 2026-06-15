package br.com.tcc_go_horse.domain;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@Entity(name = "Local")
@Table(name = "locais")
public class Local {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private Integer capacidade;

    private String cidade;

    private String estado;

    private String rua;

    private int numero;

    private String bairro;

    private String cep;

}
