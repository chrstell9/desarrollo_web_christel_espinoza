// recibe la nota que manda el usuario desde JavaScript cuando evalúa un avistamiento.
// la recibe como String para poder validarla con seguridad en el servidor
//  comprobando que sea un número entero entre 1 y 7 y no letras ni decimales

package cl.uchile.cc5002.tarea4.dto;

public class EvaluacionRequestDTO {

    private String nota;

    public EvaluacionRequestDTO() {
    }

    public String getNota() { return nota; }
    public void setNota(String nota) { this.nota = nota; }
}