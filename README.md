# Gym Project

Sistema de reservas de clases de gimnasio.

## Estructura
- `gym-api/` — REST API con Flask + PostgreSQL
- `gym-frontend/` — Frontend con React + Vite

## Cómo correr el proyecto

### Backend
```bash
cd gym-api
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Crear .env con DATABASE_URI y JWT_SECRET_KEY
flask --app run.py db upgrade
python run.py
```

### Frontend
```bash
cd gym-frontend
npm install
npm run dev
```

---

## Endpoints

Base URL: `http://127.0.0.1:5000/api/v1`

> **Niveles de autenticación:**
> - `Public` — no requiere token
> - `JWT` — requiere token de cualquier usuario logueado
> - `Admin` — requiere token de usuario con rol ADMIN

---

### Roles

| Método | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/roles` | Public | `{"name": "ADMIN"}` |
| POST | `/roles` | Public | `{"name": "CLIENT"}` |

---

### Autenticación

| Método | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/auth/login` | Public | `{"email": "admin@gym.com", "password": "admin123"}` |

**Respuesta:**
```json
{
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc..."
}
```

> Usar el `access_token` en el header de las siguientes peticiones:
> `Authorization: Bearer eyJhbGc...`

---

### Usuarios

| Método | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/users` | Public | `{"name": "Administrador", "email": "admin@gym.com", "password": "admin123", "role_id": 1}` |
| POST | `/users` | Public | `{"name": "Juan Pérez", "email": "juan@gmail.com", "password": "juan123", "role_id": 2}` |
| GET | `/users` | Admin | — |
| GET | `/users/<id>` | JWT | — |
| PUT | `/users/<id>` | Admin | `{"name": "Nombre Nuevo", "email": "email@gym.com", "role_id": 1}` |
| DELETE | `/users/<id>` | Admin | — |

**Ejemplo crear usuario:**
```json
{
    "name": "Juan Pérez",
    "email": "juan@gmail.com",
    "password": "juan123",
    "role_id": 2
}
```

**Ejemplo respuesta:**
```json
{
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@gmail.com",
    "role_id": 2
}
```

---

### Clases

| Método | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/classes` | Admin | Ver body abajo |
| GET | `/classes` | JWT | — |
| GET | `/classes/<id>` | JWT | — |
| PUT | `/classes/<id>` | Admin | Ver body abajo |
| DELETE | `/classes/<id>` | Admin | — |

**Ejemplo crear clase:**
```json
{
    "name": "Yoga Matutino",
    "description": "Clase de yoga para principiantes",
    "instructor": "María López",
    "schedule": "2026-05-01T08:00:00",
    "capacity": 10
}
```

**Ejemplo respuesta:**
```json
{
    "id": 1,
    "name": "Yoga Matutino",
    "description": "Clase de yoga para principiantes",
    "instructor": "María López",
    "schedule": "2026-05-01 08:00:00",
    "capacity": 10
}
```

---

### Reservas

| Método | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/bookings` | JWT | `{"class_id": 1}` |
| GET | `/bookings` | JWT | — |
| DELETE | `/bookings/<id>` | JWT | — |

**Ejemplo crear reserva:**
```json
{
    "class_id": 1
}
```

**Ejemplo respuesta:**
```json
{
    "id": 1,
    "user_id": 2,
    "class_id": 1,
    "status": "CONFIRMED",
    "created_at": "2026-04-08 16:00:00"
}
```

**Errores de lógica de negocio:**

Reservar una clase que no existe:
```json
{
    "error": "La clase no existe o no está disponible"
}
```

Reservar la misma clase dos veces:
```json
{
    "error": "Ya tienes una reserva confirmada en esta clase"
}
```

Reservar una clase sin lugares:
```json
{
    "error": "La clase ya no tiene lugares disponibles"
}
```

---

## Tecnologías

### Backend
- Flask + Flask-RESTful
- SQLAlchemy + Flask-Migrate
- PostgreSQL
- JWT Authentication (Flask-JWT-Extended)
- Pydantic (validación)
- Bcrypt (hash de contraseñas)

### Frontend
- React + Vite
- React Router DOM
- Axios