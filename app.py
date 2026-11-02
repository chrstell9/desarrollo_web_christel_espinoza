#Archivo de inicio Flask
import os
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, make_response
from werkzeug.utils import secure_filename

from config import Config
#funciones con la base de datos
from database import db, Region, Comuna, Voluntario, Ave, Avistamiento, Registro, Comentario

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

# Extensiones de archivo permitidas para subir
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi', 'mkv'}

def archivo_permitido(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 1. Ruta Inicio
@app.route('/')
def index():
    ultimos_avistamientos = Avistamiento.query.order_by(Avistamiento.fecha_hora.desc()).limit(2).all()
    return render_template('index.html', avistamientos=ultimos_avistamientos)

# 2. Ruta Registrar Voluntario
@app.route('/registrar_voluntario', methods=['GET', 'POST'])
def registrar_voluntario():
    if request.method == 'POST':
        nombre = request.form.get('nombre')
        email = request.form.get('email')
        telefono = request.form.get('telefono')
        comuna_id = request.form.get('comuna_id')

        nuevo_voluntario = Voluntario(
            nombre=nombre,
            email=email,
            telefono=telefono,
            comuna_id=comuna_id
        )
        db.session.add(nuevo_voluntario)
        db.session.commit()
        flash('Voluntario registrado exitosamente.', 'success')
        return redirect(url_for('index'))

    regiones = Region.query.all()
    return render_template('registrar_voluntario.html', regiones=regiones, datos={})

# 3. Ruta Agregar Avistamiento (Con guardado de archivos en static/uploads)
@app.route('/agregar_avistamiento', methods=['GET', 'POST'])
def agregar_avistamiento():
    if request.method == 'POST':
        voluntario_id = request.form.get('voluntario_id')
        ave_id = request.form.get('ave_id')
        fecha_hora_str = request.form.get('fecha_hora')
        lugar = request.form.get('lugar')
        descripcion = request.form.get('descripcion')

        # Convertir fecha_hora de string HTML a objeto datetime
        fecha_hora = datetime.strptime(fecha_hora_str, '%Y-%m-%dT%H:%M')

        # Crear registro de Avistamiento
        nuevo_avistamiento = Avistamiento(
            voluntario_id=voluntario_id,
            ave_id=ave_id,
            fecha_hora=fecha_hora,
            lugar=lugar,
            descripcion=descripcion
        )
        db.session.add(nuevo_avistamiento)
        db.session.flush()  # Para obtener el ID generado del avistamiento

        # Guardar archivos multimedia subidos
        if 'archivos' in request.files:
            archivos = request.files.getlist('archivos')
            # Crear la carpeta static/uploads si no existe
            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

            for archivo in archivos[:5]:  # Máximo 5 archivos
                if archivo and archivo.filename != '' and archivo_permitido(archivo.filename):
                    nombre_limpio = secure_filename(archivo.filename)
                    # Agregar timestamp para evitar nombres duplicados
                    nombre_guardado = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{nombre_limpio}"
                    ruta_guardado = os.path.join(app.config['UPLOAD_FOLDER'], nombre_guardado)
                    archivo.save(ruta_guardado)

                    # Guardar ruta relativa para el frontend HTML
                    ruta_relativa = f"uploads/{nombre_guardado}"
                    nuevo_registro = Registro(
                        ruta_archivo=ruta_relativa,
                        nombre_archivo=nombre_limpio,
                        avistamiento_id=nuevo_avistamiento.id
                    )
                    db.session.add(nuevo_registro)

        db.session.commit()
        flash('Avistamiento registrado exitosamente con sus archivos.', 'success')
        return redirect(url_for('index'))

    voluntarios = Voluntario.query.all()
    aves = Ave.query.all()
    return render_template('agregar_avistamiento.html', voluntarios=voluntarios, aves=aves)

# 4. Ruta Listado de Avistamientos (usando listado_avistamientos.html)
@app.route('/listado_avistamientos')
def listado_avistamientos():
    avistamientos = Avistamiento.query.order_by(Avistamiento.fecha_hora.desc()).all()
    return render_template('listado_avistamientos.html', avistamientos=avistamientos)

# 5. Ruta Detalle de Avistamiento (usando detalle_avistamiento.html)
@app.route('/avistamiento/<int:id>')
def detalle_avistamiento(id):
    avistamiento = Avistamiento.query.get_or_404(id)
    return render_template('detalle_avistamiento.html', avistamiento=avistamiento)
# 6. API AJAX para obtener comunas por región
@app.route('/api/comunas/<int:region_id>')
def obtener_comunas(region_id):
    comunas = Comuna.query.filter_by(region_id=region_id).all()
    return jsonify([{'id': c.id, 'nombre': c.nombre} for c in comunas])

#TAREA 3: rutas para estadísticas y comentarios
#7. Vista HTML para la pantalla de Estadísticas
@app.route('/estadisticas')
def estadisticas():
    return render_template('estadisticas.html')

# --- ENDPOINTS SON PARA LOS 3 GRÁFICOS (AJAX / fetch) ---
@app.route('/datos-avistamientos-dia', methods=['GET'])
def datos_avistamientos_dia():
    # GRÁFICO 1: Líneas (Avistamientos por día)
    # Agrupa por la fecha de fecha_hora y cuenta el total por día
    resultados = db.session.query(
        db.func.date_format(Avistamiento.fecha_hora, '%Y-%m-%d').label('dia'),
        db.func.count(Avistamiento.id).label('cantidad')
    ).group_by('dia').order_by('dia').all()

    datos = [{'dia': r.dia, 'cantidad': r.cantidad} for r in resultados]

    resp = make_response(jsonify(datos))
    resp.headers["Content-type"] = "application/json;charset=UTF-8"
    resp.headers["Cache-Control"] = "no-cache"
    return resp

@app.route('/datos-avistamientos-ave', methods=['GET'])
def datos_avistamientos_ave():
    # GRÁFICO 2: Torta (Avistamientos por tipo/nombre de ave)
    resultados = db.session.query(
        Ave.nombre.label('ave'),
        db.func.count(Avistamiento.id).label('cantidad')
    ).join(Avistamiento, Ave.id == Avistamiento.ave_id) \
        .group_by(Ave.nombre).all()

    datos = [{'ave': r.ave, 'cantidad': r.cantidad} for r in resultados]

    resp = make_response(jsonify(datos))
    resp.headers["Content-type"] = "application/json;charset=UTF-8"
    resp.headers["Cache-Control"] = "no-cache"
    return resp

@app.route('/datos-voluntarios-comuna', methods=['GET'])
def datos_voluntarios_comuna():
    # Gráfico 3: Barras (Voluntarios por comuna)
    resultados = db.session.query(
        Comuna.nombre.label('comuna'),
        db.func.count(Voluntario.id).label('cantidad')
    ).join(Voluntario, Comuna.id == Voluntario.comuna_id) \
        .group_by(Comuna.nombre).all()

    datos = [{'comuna': r.comuna, 'cantidad': r.cantidad} for r in resultados]

    resp = make_response(jsonify(datos))
    resp.headers["Content-type"] = "application/json;charset=UTF-8"
    resp.headers["Cache-Control"] = "no-cache"
    return resp

# --- ENDPOINTS AJAX PARA COMENTARIOS ---
@app.route('/api/avistamiento/<int:id>/comentarios', methods=['GET'])
def obtener_comentarios(id):
    # Obtener comentarios de un avistamiento del más reciente al más antiguo
    comentarios = Comentario.query.filter_by(avistamiento_id=id) \
        .order_by(Comentario.fecha.desc()).all()

    datos = [{
        'nombre': c.nombre,
        'texto': c.texto,
        'fecha': c.fecha.strftime('%d-%m-%Y %H:%M')
    } for c in comentarios]

    resp = make_response(jsonify(datos))
    resp.headers["Content-type"] = "application/json;charset=UTF-8"
    resp.headers["Cache-Control"] = "no-cache"
    return resp

@app.route('/api/avistamiento/<int:id>/comentarios', methods=['POST'])
def agregar_comentario(id):
    data = request.get_json() or request.form
    nombre = data.get('nombre', '').strip()
    texto = data.get('texto', '').strip()

    # Validaciones del lado del servidor (exigidas por enunciado)
    errores = []
    if not nombre or len(nombre) < 3 or len(nombre) > 50:
        errores.append("El nombre es obligatorio y debe tener entre 3 y 50 caracteres.")
    if not texto or len(texto) < 5:
        errores.append("El comentario es obligatorio y debe tener al menos 5 caracteres.")

    if errores:
        return jsonify({'success': False, 'errores': errores}), 400

    # Crear el objeto Comentario usando SQLAlchemy
    nuevo_comentario = Comentario(
        avistamiento_id=id,
        nombre=nombre,
        texto=texto,
        fecha=datetime.now()
    )
    db.session.add(nuevo_comentario)
    db.session.commit()

    return jsonify({'success': True, 'mensaje': 'Comentario agregado con éxito.'})

if __name__ == '__main__':
    app.run(debug=True)