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
   