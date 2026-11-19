document.addEventListener("DOMContentLoaded", () => {
    const formBuscador = document.getElementById("form-buscador");
    const campoBusqueda = document.getElementById("campo-busqueda");
    const mensajeInicial = document.getElementById("mensaje-inicial");
    const mensajeSinResultados = document.getElementById("mensaje-sin-resultados");
    const contenedorTabla = document.getElementById("contenedor-tabla");
    const cuerpoTabla = document.getElementById("cuerpo-tabla");

    // Elementos del modal de evaluacion
    const modalEvaluacion = document.getElementById("modal-evaluacion");
    const detalleModal = document.getElementById("detalle-avistamiento-modal");
    const selectNota = document.getElementById("select-nota");
    const errorModal = document.getElementById("error-modal");
    const btnCancelarNota = document.getElementById("btn-cancelar-nota");
    const btnGuardarNota = document.getElementById("btn-guardar-nota");

    let temporizadorBusqueda = null;
    let avistamientoSeleccionadoId = null;

    // Evitar recarga si el usuario presiona Enter en el input
    formBuscador.addEventListener("submit", (e) => {
        e.preventDefault();
        ejecutarBusqueda();
    });

    // Buscar automaticamente cuando el usuario comienza a escribir
    campoBusqueda.addEventListener("input", () => {
        clearTimeout(temporizadorBusqueda);
        temporizadorBusqueda = setTimeout(() => {
            ejecutarBusqueda();
        }, 250);
    });

    async function ejecutarBusqueda() {
        const texto = campoBusqueda.value.trim();

        if (texto === "") {
            contenedorTabla.classList.add("oculto");
            mensajeSinResultados.classList.add("oculto");
            mensajeInicial.classList.remove("oculto");
            cuerpoTabla.innerHTML = "";
            return;
        }

        try {
            const url = `/api/avistamientos/buscar?q=${encodeURIComponent(texto)}`;
            const respuesta = await fetch(url);
            if (!respuesta.ok) {
                throw new Error("Error al consultar avistamientos.");
            }

            const avistamientos = await respuesta.json();
            renderizarResultados(avistamientos, texto);
        } catch (error) {
            console.error(error);
            mensajeInicial.classList.add("oculto");
            contenedorTabla.classList.add("oculto");
            mensajeSinResultados.textContent = "Ocurrió un error al buscar los avistamientos.";
            mensajeSinResultados.classList.remove("oculto");
        }
    }

    function renderizarResultados(lista, patron) {
        mensajeInicial.classList.add("oculto");
        cuerpoTabla.innerHTML = "";

        if (!lista || lista.length === 0) {
            contenedorTabla.classList.add("oculto");
            mensajeSinResultados.textContent = "No se encontraron avistamientos que coincidan con tu búsqueda.";
            mensajeSinResultados.classList.remove("oculto");
            return;
        }

        mensajeSinResultados.classList.add("oculto");
        contenedorTabla.classList.remove("oculto");

        lista.forEach((av) => {
            const fila = document.createElement("tr");

            // Columna Dia
            const tdDia = document.createElement("td");
            tdDia.textContent = av.dia;
            fila.appendChild(tdDia);

            // Columna Comuna (con texto destacado)
            const tdComuna = document.createElement("td");
            tdComuna.appendChild(crearTextoDestacado(av.comuna, patron));
            fila.appendChild(tdComuna);

            // Columna Ave (con texto destacado)
            const tdAve = document.createElement("td");
            tdAve.appendChild(crearTextoDestacado(av.ave, patron));
            fila.appendChild(tdAve);

            // Columna Voluntario (con texto destacado)
            const tdVoluntario = document.createElement("td");
            tdVoluntario.appendChild(crearTextoDestacado(av.voluntario, patron));
            fila.appendChild(tdVoluntario);

            // Columna Nota promedio (o "-")
            const tdNota = document.createElement("td");
            tdNota.className = "celda-nota";
            tdNota.id = `nota-avistamiento-${av.id}`;
            tdNota.textContent = av.nota;
            fila.appendChild(tdNota);

            // Columna Opcion Evaluar
            const tdAccion = document.createElement("td");
            const btnEvaluar = document.createElement("button");
            btnEvaluar.type = "button";
            btnEvaluar.className = "btn-evaluar";
            btnEvaluar.textContent = "Evaluar";
            btnEvaluar.addEventListener("click", () => {
                abrirModalEvaluacion(av);
            });
            tdAccion.appendChild(btnEvaluar);
            fila.appendChild(tdAccion);

            cuerpoTabla.appendChild(fila);
        });
    }

    // Resalta las coincidencias usando <mark> de forma segura sin inyeccion HTML
    function crearTextoDestacado(textoOriginal, patron) {
        const fragmento = document.createDocumentFragment();
        if (!textoOriginal || !patron) {
            fragmento.appendChild(document.createTextNode(textoOriginal || ""));
            return fragmento;
        }

        const patronEscapado = patron.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(${patronEscapado})`, "gi");
        const partes = textoOriginal.split(regex);

        partes.forEach((parte) => {
            if (parte.toLowerCase() === patron.toLowerCase()) {
                const marca = document.createElement("mark");
                marca.textContent = parte;
                fragmento.appendChild(marca);
            } else {
                fragmento.appendChild(document.createTextNode(parte));
            }
        });

        return fragmento;
    }

    function abrirModalEvaluacion(avistamiento) {
        avistamientoSeleccionadoId = avistamiento.id;
        detalleModal.textContent = `Avistamiento de ${avistamiento.ave} en ${avistamiento.comuna} (Voluntario: ${avistamiento.voluntario})`;
        selectNota.value = "";
        errorModal.classList.add("oculto");
        errorModal.textContent = "";
        modalEvaluacion.classList.remove("oculto");
        modalEvaluacion.classList.add("activo");
    }

    function cerrarModalEvaluacion() {
        avistamientoSeleccionadoId = null;
        modalEvaluacion.classList.remove("activo");
        modalEvaluacion.classList.add("oculto");
    }

    btnCancelarNota.addEventListener("click", cerrarModalEvaluacion);

    btnGuardarNota.addEventListener("click", async () => {
        if (!avistamientoSeleccionadoId) {
            return;
        }

        const valorNota = selectNota.value.trim();
        if (!/^[1-7]$/.test(valorNota)) {
            errorModal.textContent = "Debes seleccionar una nota entera válida entre 1 y 7.";
            errorModal.classList.remove("oculto");
            return;
        }

        try {
            const respuesta = await fetch(`/api/avistamientos/${avistamientoSeleccionadoId}/evaluar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nota: valorNota })
            });

            if (!respuesta.ok) {
                const msgError = await respuesta.text();
                errorModal.textContent = msgError || "Error al registrar la nota.";
                errorModal.classList.remove("oculto");
                return;
            }

            const nuevoPromedio = await respuesta.text();

            // Actualizar inmediatamente el promedio en la celda de la interfaz
            const celdaNota = document.getElementById(`nota-avistamiento-${avistamientoSeleccionadoId}`);
            if (celdaNota) {
                celdaNota.textContent = nuevoPromedio;
            }

            cerrarModalEvaluacion();
        } catch (error) {
            console.error(error);
            errorModal.textContent = "No se pudo conectar con el servidor.";
            errorModal.classList.remove("oculto");
        }
    });
});