//GET: busca en la base de datos los avistamientos cuyo ave, voluntario o comuna contengan el texto escrito.
//     por cada avistamiento encontrado, consulta el promedio de sus notas
//      (si no tiene notas NULL se le asigna "-", y si tiene lo dormatea a un decimal)

//POST: recibe una nota en JSON, valida en el backend que sea un entero estricto entre 1 y 7,
//      guarda el registro en la tabla NOTA, vuelve a consultar el promedio actualizado y lo
//      devuelve como texto ("5.7") para que JavaScript actualice la pantalla sin recargar

package cl.uchile.cc5002.tarea4.controller;

import cl.uchile.cc5002.tarea4.dto.AvistamientoBusquedaDTO;
import cl.uchile.cc5002.tarea4.dto.EvaluacionRequestDTO;
import cl.uchile.cc5002.tarea4.model.Avistamiento;
import cl.uchile.cc5002.tarea4.model.Nota;
import cl.uchile.cc5002.tarea4.repository.AvistamientoRepository;
import cl.uchile.cc5002.tarea4.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@RestController
@RequestMapping("/api/avistamientos")
public class AvistamientoApiController {

    @Autowired
    private AvistamientoRepository avistamientoRepository;

    @Autowired
    private NotaRepository notaRepository;

    @GetMapping("/buscar")
    public List<AvistamientoBusquedaDTO> buscar(@RequestParam(name = "q", defaultValue = "") String q) {
        List<AvistamientoBusquedaDTO> resultado = new ArrayList<>();
        String texto = q.trim();

        if (texto.isEmpty()) {
            return resultado;
        }

        DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        List<Avistamiento> lista = avistamientoRepository.buscarPorPatron(texto);

        for (Avistamiento av : lista) {
            Double promedio = notaRepository.obtenerPromedioPorAvistamiento(av.getId());
            String notaTexto = (promedio == null) ? "-" : String.format(Locale.US, "%.1f", promedio);

            AvistamientoBusquedaDTO item = new AvistamientoBusquedaDTO();
            item.setId(av.getId());
            item.setDia(av.getDiaHora().format(formato));
            item.setComuna(av.getVoluntario().getComuna().getNombre());
            item.setAve(av.getAve().getNombre());
            item.setVoluntario(av.getVoluntario().getNombre());
            item.setNota(notaTexto);

            resultado.add(item);
        }

        return resultado;
    }

    @PostMapping("/{id}/evaluar")
    public ResponseEntity<String> evaluar(@PathVariable("id") Integer id, @RequestBody EvaluacionRequestDTO body) {
        Optional<Avistamiento> avistamientoOpt = avistamientoRepository.findById(id);
        if (avistamientoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Avistamiento no encontrado");
        }

        String notaStr = (body != null && body.getNota() != null) ? body.getNota().trim() : "";
        if (!notaStr.matches("^[1-7]$")) {
            return ResponseEntity.badRequest().body("La nota debe ser un entero entre 1 y 7");
        }

        Nota nuevaNota = new Nota();
        nuevaNota.setAvistamiento(avistamientoOpt.get());
        nuevaNota.setNota(Integer.parseInt(notaStr));
        notaRepository.save(nuevaNota);

        Double nuevoPromedio = notaRepository.obtenerPromedioPorAvistamiento(id);
        String promedioTexto = (nuevoPromedio == null) ? "-" : String.format(Locale.US, "%.1f", nuevoPromedio);

        return ResponseEntity.ok(promedioTexto);
    }
}