// permite guardar una nueva nota en la tabla NOTA y calcular el promedio (AVG) de todas las notas
//  asociadas a un AVISTAMIENTO_ID específico (devuelve NULL si aún no hay notas y después se convierte en "-")

package cl.uchile.cc5002.tarea4.repository;

import cl.uchile.cc5002.tarea4.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Integer> {

    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.avistamiento.id = :avistamientoId")
    Double obtenerPromedioPorAvistamiento(@Param("avistamientoId") Integer avistamientoId);
}
