// representa la nueva tabla NOTA (creada con tabla-nota.sql)
//  donde se guardan las evaluaciones de 1 a 7 asociadas a cada avistamiento

package cl.uchile.cc5002.tarea4.model;

import jakarta.persistence.*;

@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avistamiento_id", nullable = false)
    private Avistamiento avistamiento;

    @Column(name = "nota", nullable = false)
    private Integer nota;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Avistamiento getAvistamiento() { return avistamiento; }
    public void setAvistamiento(Avistamiento avistamiento) { this.avistamiento = avistamiento; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }
}