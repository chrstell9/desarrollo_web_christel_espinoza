// controlador web tradicional (@Controller).
// cuando entras a http://localhost:8080/ en el navegador, le dice al Spring Boot
//  que muestre al archivo HTML templates/buscador.html

package cl.uchile.cc5002.tarea4.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VistaController {

    @GetMapping({"/", "/buscador"})
    public String inicio() {
        return "buscador";
    }
}