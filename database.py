#Archivo que traduce las tablas de MYySQL a clases Python utilizando SQLAlchemy
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Tabla REGION
class Region(db.Model):
    __tablename__ = 'region'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)

    comunas = db.relationship('Comuna', backref='region', lazy=True)

# Tabla COMUNA
class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)

    voluntarios = db.relationship('Voluntario', backref='comuna', lazy=True)

# Tabla VOLUNTARIO
class Voluntario(db.Model):
    __tablename__ = 'voluntario'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    telefono = db.Column(db.String(15), nullable=True)
    fecha_registro = db.Column(db.DateTime, default=datetime.now, nullable=False)
    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)

    avistamientos = db.relationship('Avistamiento', backref='voluntario', lazy=True)

# Tabla AVE
class Ave(db.Model):
    __tablename__ = 'ave'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)

    avistamientos = db.relationship('Avistamiento', backref='ave', lazy=True)

# Tabla AVISTAMIENTO
class Avistamiento(db.Model):
    __tablename__ = 'avistamiento'
    id = db.Column(db.Integer, primary_key=True)
    voluntario_id = db.Column(db.Integer, db.ForeignKey('voluntario.id'), nullable=False)
    ave_id = db.Column(db.Integer, db.ForeignKey('ave.id'), nullable=False)
    fecha_hora = db.Column(db.DateTime, nullable=False)
    lugar = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text(500), nullable=True)

    registros = db.relationship('Registro', backref='avistamiento', cascade="all, delete-orphan", lazy=True)

# Tabla REGISTRO (Archivos multimedia)
class Registro(db.Model):
    __tablename__ = 'registro'
    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    avistamiento_id = db.Column(db.Integer, db.ForeignKey('avistamiento.id'), nullable=False)


# Funciones para Estadísticas: consultas que agrupen datos para los 3 gráficos
def get_stats_avistamientos_por_dia():
    """
    Obtiene la cantidad de avistamientos agrupados por fecha (día).
    El DATE_FORMAT extrae solo el día.
    """
    db = get_db()
    cursor = db.cursor(dictionary=True)
    sql = """
        SELECT DATE_FORMAT(fecha, '%Y-%m-%d') as dia, COUNT(*) as cantidad
        FROM avistamiento 
        GROUP BY dia
        ORDER BY dia ASC
    """
    cursor.execute(sql)
    resultado = cursor.fetchall()
    cursor.close()
    return resultado

# Tarea 3: ya que se utiliza SQLAlchemy, se debe tener la clase de Comentario
class Comentario(db.Model):
    __tablename__ = 'comentario'
    id = db.Column(db.Integer, primary_key=True)
    avistamiento_id = db.Column(db.Integer, db.ForeignKey('avistamiento.id'), nullable=False)
    nombre = db.Column(db.String(50), nullable=False)
    texto = db.Column(db.Text, nullable=False)
    fecha = db.Column(db.DateTime, default=datetime.now)