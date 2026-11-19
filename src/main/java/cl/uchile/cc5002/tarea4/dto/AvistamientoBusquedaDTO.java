// es el objeto que representa una fila de resultado del buscador.
// tiene un constructor vacío y métodos SET para ir llenando cada dato
//  uno por uno sun enredarnos con el orden de los parámetros:
//  ID, DIA, COMUNA, AVE, VOLUNTARIO y NOTA

package cl.uchile.cc5002.tarea4.dto;

public class AvistamientoBusquedaDTO {

    private Integer id;
    private String dia;
    private String comuna;
    private String ave;
    private String voluntario;
    private String nota;

    public AvistamientoBusquedaDTO() {
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getDia() { return dia; }
    public void setDia(String dia) { this.dia = dia; }

    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }

    public String getAve() { return ave; }
    public void setAve(String ave) { this.ave = ave; }

    public String getVoluntario() { return voluntario; }
    public void setVoluntario(String voluntario) { this.voluntario = voluntario; }

    public String getNota() { return nota; }
    public void setNota(String nota) { this.nota = nota; }
}