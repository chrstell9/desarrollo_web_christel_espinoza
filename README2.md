# Tarea 2 - CC5002 Desarrollo de Aplicaciones Web
## Avistamiento de Aves (aplicación web completa)

En esta segunda parte pasamos de tener un prototipo simple a una página web real y conectada. Ahora tenemos una base de datos MySQL, guardamos la información de los formularios de verdad y podemos subir archivos multimedia.

Para correr el proyecto solo hay que ejecutar `python app.py` en la consola y abrir `http://127.0.0.1:5000/` en el navegador.

---

## Realiza:

### Conexión a la base de datos
- En vez de escribir consultas SQL a mano para todo, usamos SQLAlchemy en Python para manejar las tablas (`Region`, `Comuna`, `Voluntario`, `Ave`, `Avistamiento`, `Registro`) de forma más directa y limpia.
- Dejamos todo bien amarrado con claves foráneas para que si buscamos un avistamiento, podamos sacar de inmediato el nombre del observador, su comuna y su región sin dar tanta vuelta.

### Estructura del código y las páginas
- Mantuvimos la plantilla `base.html` para no tener que estar copiando y pegando el menú de navegación y el pie de página en cada archivo HTML.
- Todo lo principal de Python quedó centralizado en `app.py`, donde recibimos las peticiones, procesamos lo que envía el usuario y mostramos las vistas.

### Guardar la información de los formularios
- A diferencia de la Tarea 1 donde todo era de mentira, acá los formularios sí usan método `POST` y guardan los datos directamente en la base de datos MySQL al presionar los botones.
- No pusimos un sistema de inicio de sesión o clave para los voluntarios porque no se pedía, así que cualquier persona puede seleccionar un voluntario guardado y asignarle un avistamiento.

### Regiones y comunas dependientes
- Para que no se recargara la página completa cada vez que alguien elige una región, hicimos una pequeña ruta en el servidor que nos devuelve las comunas de esa región en específico.
- Con un script básico en JavaScript detectamos el cambio en el selector de regiones y cargamos las comunas al instante.

### Subida de imágenes y videos
- En el formulario de avistamientos permitimos subir fotos y videos.
- Le cambiamos el nombre a los archivos agregándoles la fecha y hora exacta en que se subieron para evitar que dos archivos con el mismo nombre se borren o se pisen entre sí.
- Los archivos físicamente se guardan en la carpeta `static/uploads/`, y en la base de datos solo guardamos la ruta para poder mostrarlos en la página.

### Mostrar los datos y el detalle
- Creamos una pantalla para ver la tabla completa con todos los avistamientos cargados hasta el momento.
- Creamos otra pantalla de detalle donde se puede ver toda la información de un avistamiento en específico y sus fotos o videos en tamaño grande.

---

## Detalles:

- Dejamos el archivo `requirements.txt` listo con todas las librerías que se usaron para que cualquiera pueda instalarlas rápido con `pip`.
- Agregamos un archivo `.gitignore` para no subir la carpeta del entorno virtual (`venv`) ni archivos pesados que no son necesarios en el repositorio de Git.