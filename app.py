#Archivo de inicio Flask
import os
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from werkzeug.utils import secure_filename

from config import Config
from database import db, Region, Comuna, Voluntario, Ave, Avistamiento, Registro

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

if __name__ == '__main__':
    app.run(debug=True)