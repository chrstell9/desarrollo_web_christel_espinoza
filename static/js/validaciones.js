/*
* - validación dinámica de regiones y comuna: al cambiar la región, se actualiza las comunas correspondientes.
* - campos condicionales e inputs: si se selecciona "otra especie", se habilita un campo de texto.
*                                  deberia permitir agregar más fotos con "agregar otra foto".
* - validación y resctricción al enviar: - campos no vacios
*                                        - validación de correo (ej: ejemplo@dominio.cl)
*                                        - validacion opcional del celular en formato chileno
*/

// DATOS DE REGIONES Y COMUNES DE CHILE //
var REGIONES_COMUNAS= "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Laxre"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Verde"],
    "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juchuraba", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
    "Metropolitana de Santiago": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "Santiago", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
    "O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchigüe", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
    "Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "San Javier", "Villa Alegre", "Yerbas Buenas"],
    "Ñuble": ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ranquil", "Treguaco", "San Carlos", "Coihueco", "San Fabián", "San Nicolás"],
    "Bío Bío": ["Concepción", "Coronel", "Chiguayante", "Florida", "San Pedro de la Paz", "Santa Juana", "Lota", "Penco", "Tomé", "Hualqui", "Talcahuano", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
    "La Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumabaco", "Purén", "Renaico", "Traiguén", "Victoria"],
    "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
    "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
    "Aysén": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
    "Magallanes": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
};

/* ==========================================================================
   CC5002 - Tarea 1: Lógica de Validación y Funcionalidad Dinámica (JS Vanilla)
   ========================================================================== */

// Datos de Regiones y Comunas de Chile para poblar dinámicamente los <select>
var REGIONES_COMUNAS = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Laxre"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Verde"],
    "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juchuraba", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
    "Metropolitana de Santiago": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "Santiago", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
    "O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchigüe", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
    "Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "San Javier", "Villa Alegre", "Yerbas Buenas"],
    "Ñuble": ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ranquil", "Treguaco", "San Carlos", "Coihueco", "San Fabián", "San Nicolás"],
    "Bío Bío": ["Concepción", "Coronel", "Chiguayante", "Florida", "San Pedro de la Paz", "Santa Juana", "Lota", "Penco", "Tomé", "Hualqui", "Talcahuano", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
    "La Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumabaco", "Purén", "Renaico", "Traiguén", "Victoria"],
    "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
    "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
    "Aysén": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
    "Magallanes": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
};

document.addEventListener("DOMContentLoaded", function () {

    // Inicializar selectores dinámicos de Región y Comuna
    inicializarRegionComuna();

    // Detectar en qué formulario estamos
    var formAvistamiento = document.getElementById("form-avistamiento");
    var formVoluntario = document.getElementById("form-voluntario");

    if (formAvistamiento) {
        configurarFormularioAvistamiento(formAvistamiento);
    }

    if (formVoluntario) {
        configurarFormularioVoluntario(formVoluntario);
    }
});

/* --------------------------------------------------------------------------
   1. POBLAR SELECTS DE REGIÓN Y COMUNA
   -------------------------------------------------------------------------- */
function inicializarRegionComuna() {
    var selectRegion = document.getElementById("region");
    var selectComuna = document.getElementById("comuna");

    if (!selectRegion || !selectComuna) return;

    // Llenar select de regiones
    selectRegion.innerHTML = '<option value="">Seleccione una región...</option>';
    for (var region in REGIONES_COMUNAS) {
        var option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        selectRegion.appendChild(option);
    }

    // Evento al cambiar región
    selectRegion.addEventListener("change", function () {
        var regionSeleccionada = this.value;
        selectComuna.innerHTML = '<option value="">Seleccione una comuna...</option>';

        if (regionSeleccionada && REGIONES_COMUNAS[regionSeleccionada]) {
            REGIONES_COMUNAS[regionSeleccionada].forEach(function (comuna) {
                var opt = document.createElement("option");
                opt.value = comuna;
                opt.textContent = comuna;
                selectComuna.appendChild(opt);
            });
        }
    });
}

/* --------------------------------------------------------------------------
   2. CONFIGURACIÓN DEL FORMULARIO DE AVISTAMIENTOS
   -------------------------------------------------------------------------- */
function configurarFormularioAvistamiento(form) {
    var selectEspecie = document.getElementById("especie");
    var contenedorOtraEspecie = document.getElementById("contenedor-otra-especie");
    var btnAgregarFoto = document.getElementById("btn-agregar-foto");
    var contenedorFotos = document.getElementById("contenedor-fotos");
    var contadorFotos = 1;

    // Habilitar / deshabilitar campo "Otra especie"
    if (selectEspecie && contenedorOtraEspecie) {
        selectEspecie.addEventListener("change", function () {
            if (this.value === "otra") {
                contenedorOtraEspecie.style.display = "block";
            } else {
                contenedorOtraEspecie.style.display = "none";
                var inputOtra = document.getElementById("otra-especie");
                if (inputOtra) inputOtra.value = "";
            }
        });
    }

    // Permitir agregar entre 1 y 5 archivos de fotos
    if (btnAgregarFoto && contenedorFotos) {
        btnAgregarFoto.addEventListener("click", function () {
            if (contadorFotos >= 5) {
                alert("Máximo se pueden agregar 5 fotos.");
                return;
            }
            contadorFotos++;
            var div = document.createElement("div");
            div.className = "campo-foto";
            div.innerHTML = '<input type="file" name="foto[]" accept="image/png, image/jpeg, image/jpg">';
            contenedorFotos.appendChild(div);
        });
    }

    // Validación al enviar el formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        limpiarErrores();

        var errores = [];

        // Validar Región y Comuna
        var region = document.getElementById("region").value;
        var comuna = document.getElementById("comuna").value;
        if (!region) errores.push("Debe seleccionar una Región.");
        if (!comuna) errores.push("Debe seleccionar una Comuna.");

        // Validar Sector (0 a 100 caracteres)
        var sector = document.getElementById("sector").value.trim();
        if (sector.length > 100) errores.push("El sector no puede superar los 100 caracteres.");

        // Validar Tipo de Avistamiento
        var tipoAvistamiento = document.getElementById("tipo-avistamiento");
        if (tipoAvistamiento && !tipoAvistamiento.value) {
            errores.push("Debe seleccionar un Tipo de Avistamiento.");
        }

        // Validar Especie
        var especie = selectEspecie ? selectEspecie.value : "";
        if (!especie) {
            errores.push("Debe seleccionar una especie.");
        } else if (especie === "otra") {
            var otraEspecieVal = document.getElementById("otra-especie").value.trim();
            if (!otraEspecieVal) {
                errores.push("Especificar el nombre de la otra especie.");
            }
        }

        // Validar Fecha y Hora
        var fechaHora = document.getElementById("fecha-hora") ? document.getElementById("fecha-hora").value : "";
        if (!fechaHora) errores.push("Debe ingresar la fecha y hora del avistamiento.");

        // Validar Fotos (Al menos 1 requerida, formato válido)
        var inputsFotos = contenedorFotos ? contenedorFotos.querySelectorAll('input[type="file"]') : [];
        var fotosValidas = 0;
        var extensionesValidas = ["png", "jpg", "jpeg"];

        for (var i = 0; i < inputsFotos.length; i++) {
            var archivo = inputsFotos[i].files[0];
            if (archivo) {
                var ext = archivo.name.split('.').pop().toLowerCase();
                if (extensionesValidas.indexOf(ext) === -1) {
                    errores.push("La foto '" + archivo.name + "' debe ser en formato PNG, JPG o JPEG.");
                } else {
                    fotosValidas++;
                }
            }
        }
        if (fotosValidas < 1) {
            errores.push("Debe adjuntar al menos una foto (máximo 5).");
        }

        // Validar Nombre Observador
        var nombre = document.getElementById("nombre").value.trim();
        if (!nombre) {
            errores.push("Debe ingresar su Nombre.");
        } else if (nombre.length < 3 || nombre.length > 80) {
            errores.push("El nombre debe tener entre 3 y 80 caracteres.");
        }

        // Validar Email
        var email = document.getElementById("email").value.trim();
        if (!email) {
            errores.push("Debe ingresar su correo electrónico.");
        } else if (!validarEmail(email)) {
            errores.push("El correo electrónico no tiene un formato válido (ejemplo: usuario@dominio.cl).");
        }

        // Validar Celular (Opcional, pero si se ingresa debe ser válido)
        var celular = document.getElementById("celular") ? document.getElementById("celular").value.trim() : "";
        if (celular && !validarCelular(celular)) {
            errores.push("El formato del número celular no es válido (Ejemplo: +56912345678 o 912345678).");
        }

        // Si hay errores, mostrarlos
        if (errores.length > 0) {
            mostrarErrores(errores);
            return;
        }

        // Confirmación mediante modal
        mostrarModalConfirmacion("¿Está seguro que desea enviar este reporte de avistamiento?", function () {
            alert("¡Avistamiento registrado exitosamente!");
            form.reset();
            window.location.href = "index.html";
        });
    });
}

/* --------------------------------------------------------------------------
   3. CONFIGURACIÓN DEL FORMULARIO DE VOLUNTARIOS
   -------------------------------------------------------------------------- */
function configurarFormularioVoluntario(form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        limpiarErrores();

        var errores = [];

        // Validar Nombre
        var nombre = document.getElementById("nombre").value.trim();
        if (!nombre) {
            errores.push("Debe ingresar su Nombre completo.");
        } else if (nombre.length < 3 || nombre.length > 80) {
            errores.push("El nombre debe tener entre 3 y 80 caracteres.");
        }

        // Validar Email
        var email = document.getElementById("email").value.trim();
        if (!email) {
            errores.push("Debe ingresar su correo electrónico.");
        } else if (!validarEmail(email)) {
            errores.push("El correo electrónico ingresado no es válido.");
        }

        // Validar Celular (Opcional, si se llena debe ser correcto)
        var celular = document.getElementById("celular") ? document.getElementById("celular").value.trim() : "";
        if (celular && !validarCelular(celular)) {
            errores.push("El formato del celular es inválido.");
        }

        // Validar Región y Comuna
        var region = document.getElementById("region").value;
        var comuna = document.getElementById("comuna").value;
        if (!region) errores.push("Debe seleccionar una Región.");
        if (!comuna) errores.push("Debe seleccionar una Comuna.");

        // Validar Temas de Interés (Al menos 1 checkbox seleccionado)
        var checkboxesInteres = document.querySelectorAll('input[name="intereses[]"]:checked, input[name="interes"]:checked');
        if (checkboxesInteres.length === 0) {
            errores.push("Debe seleccionar al menos un tema de interés.");
        }

        if (errores.length > 0) {
            mostrarErrores(errores);
            return;
        }

        // Confirmación mediante modal
        mostrarModalConfirmacion("¿Desea registrarse como voluntario con los datos ingresados?", function () {
            alert("¡Registro de voluntario realizado con éxito!");
            form.reset();
            window.location.href = "index.html";
        });
    });
}

/* --------------------------------------------------------------------------
   4. FUNCIONES AUXILIARES (Validación, Manejo de Errores y Modales)
   -------------------------------------------------------------------------- */
function validarEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validarCelular(celular) {
    // Acepta números de 9 dígitos (9XXXXXXXX) o con prefijo (+569XXXXXXXX)
    var re = /^(\+?56)?\s?9\d{8}$/;
    return re.test(celular.replace(/\s+/g, ''));
}

function limpiarErrores() {
    var contenedorError = document.getElementById("contenedor-errores");
    if (contenedorError) {
        contenedorError.innerHTML = "";
        contenedorError.style.display = "none";
    }
}

function mostrarErrores(errores) {
    var contenedorError = document.getElementById("contenedor-errores");
    if (!contenedorError) {
        contenedorError = document.createElement("div");
        contenedorError.id = "contenedor-errores";
        contenedorError.style.backgroundColor = "#f8d7da";
        contenedorError.style.color = "#721c24";
        contenedorError.style.padding = "15px";
        contenedorError.style.marginBottom = "20px";
        contenedorError.style.border = "1px solid #f5c6cb";
        contenedorError.style.borderRadius = "5px";

        var formulario = document.querySelector("form");
        formulario.insertBefore(contenedorError, formulario.firstChild);
    }

    var html = "<strong>Por favor corrige los siguientes errores:</strong><ul>";
    errores.forEach(function (err) {
        html += "<li>" + err + "</li>";
    });
    html += "</ul>";

    contenedorError.innerHTML = html;
    contenedorError.style.display = "block";
    window.scrollTo(0, 0);
}

function mostrarModalConfirmacion(mensaje, callbackAceptar) {
    var overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "9999";

    var cajaModal = document.createElement("div");
    cajaModal.style.background = "#fff";
    cajaModal.style.padding = "20px";
    cajaModal.style.borderRadius = "8px";
    cajaModal.style.maxWidth = "400px";
    cajaModal.style.textAlign = "center";

    cajaModal.innerHTML = '<p style="margin-bottom:20px;">' + mensaje + '</p>' +
        '<button id="modal-btn-confirmar" style="margin-right:10px; padding:8px 15px; background:#28a745; color:white; border:none; border-radius:4px; cursor:pointer;">Sí, enviar</button>' +
        '<button id="modal-btn-cancelar" style="padding:8px 15px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer;">Cancelar</button>';

    overlay.appendChild(cajaModal);
    document.body.appendChild(overlay);

    document.getElementById("modal-btn-confirmar").addEventListener("click", function () {
        document.body.removeChild(overlay);
        callbackAceptar();
    });

    document.getElementById("modal-btn-cancelar").addEventListener("click", function () {
        document.body.removeChild(overlay);
    });
}