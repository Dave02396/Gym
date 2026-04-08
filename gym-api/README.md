# Gym API

REST API para sistema de reservas de clases de gimnasio.

## Tecnologías
- Flask + Flask-RESTful
- SQLAlchemy + Flask-Migrate
- PostgreSQL
- JWT Authentication
- Pydantic

## Instalación

1. Clonar el repositorio
2. Crear entorno virtual: `python -m venv venv`
3. Activar entorno virtual: `venv\Scripts\activate`
4. Instalar dependencias: `pip install -r requirements.txt`
5. Crear archivo `.env` con las variables:
DATABASE_URI=postgresql://postgres:PASSWORD@localhost:5432/gym_db
JWT_SECRET_KEY=tu_clave_secreta

6. Crear la base de datos `gym_db` en PostgreSQL
7. Ejecutar migraciones: `flask --app run.py db upgrade`
8. Correr el servidor: `python run.py`

## Endpoints

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | /api/v1/auth/login | No | Iniciar sesión |
| POST | /api/v1/roles | No | Crear rol |
| POST | /api/v1/users | No | Registrar usuario |
| GET | /api/v1/users | Admin | Listar usuarios |
| GET | /api/v1/users/<id> | JWT | Ver usuario |
| PUT | /api/v1/users/<id> | Admin | Editar usuario |
| DELETE | /api/v1/users/<id> | Admin | Eliminar usuario |
| GET | /api/v1/classes | JWT | Listar clases |
| POST | /api/v1/classes | Admin | Crear clase |
| GET | /api/v1/classes/<id> | JWT | Ver clase |
| PUT | /api/v1/classes/<id> | Admin | Editar clase |
| DELETE | /api/v1/classes/<id> | Admin | Eliminar clase |
| GET | /api/v1/bookings | JWT | Ver mis reservas |
| POST | /api/v1/bookings | JWT | Crear reserva |
| DELETE | /api/v1/bookings/<id> | JWT | Cancelar reserva |

## Lógica de negocio

Al crear una reserva el sistema valida:
1. Que la clase exista y esté activa
2. Que el usuario no tenga ya una reserva en esa clase
3. Que la clase tenga lugares disponibles