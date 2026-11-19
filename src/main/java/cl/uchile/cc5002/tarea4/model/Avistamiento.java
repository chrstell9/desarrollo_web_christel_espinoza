// representa la tabla AVISTAMIENTO y sus relaciones @ManyToOne con COMUNA, VOLUNTARIO y AVE

package cl.uchile.cc5002.tarea4.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "avistamiento")
public class Avistamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime diaHora;

    //@ManyToOne(fetch = FetchType.EAGER)
    //@JoinColumn(name = "comuna_id", nullable = false)
    //private Comuna comuna;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "voluntario_id", nullable = false)
    private Voluntario voluntario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ave_id", nullable = false)
    private Ave ave;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public LocalDateTime getDiaHora() { return diaHora; }
    public void setDiaHora(LocalDateTime diaHora) { this.diaHora = diaHora; }

    //public Comuna getComuna() { return comuna; }
    //public void setComuna(Comuna comuna) { this.comuna = comuna; }

    public Voluntario getVoluntario() { return voluntario; }
    public void setVoluntario(Voluntario voluntario) { this.voluntario = voluntario; }

    public Ave getAve() { return ave; }
    public void setAve(Ave ave) { this.ave = ave; }
}