// ejecuta las consulta JPQL que busca todos los avistamientos donde el nombre del ave, voluntario o comuna
//  contengan el texto escrito (ignorando mayús/minús con LOWER), ordenados por fecha más reciente

package cl.uchile.cc5002.tarea4.repository;

import cl.uchile.cc5002.tarea4.model.Avistamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvistamientoRepository extends JpaRepository<Avistamiento, Integer> {

    @Query("SELECT a FROM Avistamiento a " +
            "JOIN a.ave av " +
            "JOIN a.voluntario v " +
            "JOIN v.comuna c " +
            "WHERE LOWER(av.nombre) LIKE LOWER(CONCAT('%', :patron, '%')) " +
            "OR LOWER(v.nombre) LIKE LOWER(CONCAT('%', :patron, '%')) " +
            "OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :patron, '%')) " +
            "ORDER BY a.diaHora DESC")
    List<Avistamiento> buscarPorPatron(@Param("patron") String patron);
}
