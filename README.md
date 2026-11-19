# Tarea 3 - Avistamiento de Aves

## ¿De qué se trata esta entrega?

Para la Tarea 3 complementé lo que ya venía armando en la Tarea 2. La idea principal de esta entrega fue sumar la pantalla de **Estadísticas con gráficos interactivos** y la opción de **dejar y ver comentarios en los avistamientos** usando llamadas asíncronas (`fetch`) para que todo cargue fluido sin recargar la página.

---

## Lo que se implementó

### 1. Pantalla de Estadísticas (`/estadisticas`)
Armé una nueva vista en Flask que consulta los datos en el servidor y los envía a la página vía JSON para dibujar 3 gráficos:
* **Gráfico de líneas:** Muestra cuántos avistamientos se han hecho por cada día.
* **Gráfico de torta:** Muestra el total de avistamientos divididos por tipo de ave.
* **Gráfico de barras:** Muestra la cantidad de voluntarios registrados por cada comuna.
* **Navegación:** Al final agregué un botón/enlace para volver directo a la portada (`index.html`).

### 2. Sistema de Comentarios en Avistamientos
Dentro de la vista de detalle de un avistamiento (`/avistamiento/<id>`):
* **Lista de comentarios:** Al entrar a la página se cargan dinámicamente con un `fetch` a la API (`/api/avistamiento/<id>/comentarios`). Muestra la fecha, el nombre del comentarista y lo que escribió.
* **Formulario de comentario:** Se pueden enviar nuevos comentarios por `POST` usando `fetch`.
    * **Validación en el cliente:** Se revisa en JS que el nombre tenga entre 3 y 50 caracteres y el texto al menos 5 caracteres.
    * **Validación en el servidor:** En `app.py` se vuelve a validar por seguridad antes de guardar en la base de datos. Si algo falla, la página le avisa al usuario sin borrarle el formulario ni refrescar la pantalla.

---

## Decisiones que tomé en el código

* **Uso de Flask-SQLAlchemy:**  
  Como en la Tarea 2 venía trabajando con SQLAlchemy, mantuve esa misma línea para la tabla `comentario` y para hacer las consultas de agregación (`group_by` y `count`) de los gráficos. Hace que el código en Python quede súper ordenado y seguro.

* **Respuestas de la API (`make_response`):**  
  Para responder las peticiones AJAX/fetch usé `make_response` configurando los encabezados `Content-Type: application/json` y `Cache-Control: no-cache`. Traté de basarme en la estructura y los ejemplos vistos en el material del ramo.

* **Uso de `fetch` nativo de JavaScript:**  
  Utilice `fetch` directamente en vez de librerías extra, porque me comentaron que es la forma estándar de trabajar AJAX ahora, no recarga la página y me permite actualizar partes específicas del sitio manipulando el DOM con `document.getElementById` e `innerHTML`.

* **Elección de Highcharts para los gráficos:**  
  Elegí **Highcharts** integrada por CDN porque es una de las bibliotecas vistas en el ramo, es fácil de configurar y responde perfecto a los datos JSON que le mando desde Flask.

---

## ¿Cómo probar el proyecto?

1. **Crear la tabla en MySQL:**  
   Asegurar de entrar a la base de datos `tarea2` e insertar la tabla `comentario`:
   ```sql
   USE tarea2;

   CREATE TABLE IF NOT EXISTS comentario (
       id INT AUTO_INCREMENT PRIMARY KEY,
       avistamiento_id INT NOT NULL,
       nombre VARCHAR(50) NOT NULL,
       texto TEXT NOT NULL,
       fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (avistamiento_id) REFERENCES avistamiento(id) ON DELETE CASCADE
   );
   ```
    Para mostrar que va por buen camino colocar: 
    ```sql
   SHOW TABLES;
   ```

2. **Ejecutar en la terminal:**
   ```python
    python app.py
    ```
   
3. **Ingresar al link que se encuentra en la terminal**


# Tarea 4 - Buscador y Evaluación de Avistamientos

Para esta tarea migré la funcionalidad de búsqueda y evaluación de avistamientos a **Java 17 con Spring Boot (v3.3.5)** y **Spring Data JPA**, manteniendo la base de datos `tarea2` en MySQL que venía trabajando de entregas anteriores.

## Decisiones de implementación y arquitectura

1. **Separación entre vista y API REST:**
    - Creé `VistaController` para servir la interfaz principal en las rutas `/` y `/buscador` usando la plantilla `templates/buscador.html` (renombrando el `index.html` anterior a `index_tarea3.html` para conservarlo sin que interfiera con la portada).
    - Implementé `AvistamientoApiController` (`@RestController`) con dos endpoints JSON bajo `/api/avistamientos`:
        - `GET /api/avistamientos/buscar?q=...`: busca coincidencias parciales (sin importar mayúsculas o minúsculas) por nombre de ave, nombre de voluntario o nombre de comuna, ordenado desde el avistamiento más reciente.
        - `POST /api/avistamientos/{id}/evaluar`: recibe una nota entera entre 1 y 7, la guarda en la tabla `nota` y devuelve el promedio actualizado redondeado a un decimal.

2. **Alineación con el esquema real de MySQL (`tarea2`):**
    - Al mapear las entidades JPA (`Avistamiento`, `Ave`, `Comuna`, `Voluntario`, `Nota`), ajusté las relaciones según las columnas reales de la base de datos: la fecha en `avistamiento` corresponde a `fecha_hora` y la llave foránea `comuna_id` está asociada directamente a `voluntario`. Por eso las consultas JPQL hacen `JOIN` desde `avistamiento` hacia `voluntario` y luego hacia `comuna`.
    

3. **Interfaz asíncrona sin recargar la página:**
    - La vista `buscador.html` tiene un único campo de texto (`<input type="text">`) que escucha el evento `input` en `static/js/buscador.js`.
    - Cuando llegan resultados desde `fetch`, se construye la tabla dinámicamente y se resaltan con `<mark>` las letras que coinciden con lo escrito, escapando caracteres especiales para evitar inyección de HTML. Si no hay coincidencias, se oculta la tabla y se muestra un aviso.
    - Al hacer clic en **Evaluar**, se abre un modal con opciones enteras del `1` al `7`. Se valida tanto en el navegador como en el servidor que la nota sea un entero válido en ese rango, y al guardar se actualiza solo el cuadro del promedio de esa fila en tiempo real.

## Cómo ejecutar el proyecto

1. Tener MySQL corriendo con la base de datos `tarea2` y haber ejecutado el script `sql/tabla-nota.sql`.
2. Configurar usuario y contraseña de MySQL en `src/main/resources/application.properties`.
3. Ejecutar la clase principal `Tarea4Application.java` y abrir `http://localhost:8080/buscador` en el navegador.