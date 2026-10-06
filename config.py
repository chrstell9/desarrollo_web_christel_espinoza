import os

class Config:
    # Clave secreta para manejar sesiones y mensajes flash
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'clave_secreta_tarea2_aves'

    # Cadena de conexión a MySQL usando la librería PyMySQL
    # Formato: mysql+pymysql://usuario:password@host:puerto/nombre_bd
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Ruta absoluta para guardar los archivos subidos (fotos y videos)
    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # Tamaño máximo de archivos subidos (16 MB)