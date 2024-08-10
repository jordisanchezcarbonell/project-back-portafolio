# Task Tracker API

Task Tracker API es una aplicación simple de gestión de tareas construida con Node.js y Express. Esta API RESTful permite a los usuarios crear, leer, actualizar y eliminar tareas, así como marcar tareas como en progreso o completadas.

## Características

- Añadir nuevas tareas.
- Listar todas las tareas o filtrar por estado (`todo`, `in-progress`, `done`).
- Actualizar la descripción de una tarea.
- Eliminar tareas por ID.
- Marcar tareas como en progreso.
- Marcar tareas como completadas.

## Tecnologías

- Node.js
- Express
- JSON para el almacenamiento de datos

## Requisitos Previos

- Node.js (v12 o superior)
- npm (v6 o superior)

## Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tuusuario/task-tracker-api.git
   cd task-tracker-api
   ```

2. **Instalar las dependencias:**

   ```bash
   npm install
   ```

3. **Iniciar el servidor:**

   ```bash
   npm start
   ```

   El servidor se ejecutará en `http://localhost:3000`.

## Uso

### Añadir una nueva tarea

**Endpoint:** `POST /tasks`

```bash
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"description": "Comprar comestibles"}'
```

**Respuesta:**

```json
{
  "message": "Tarea añadida exitosamente",
  "task": {
    "id": 1,
    "description": "Comprar comestibles",
    "status": "todo",
    "createdAt": "2024-08-09T12:34:56.789Z",
    "updatedAt": "2024-08-09T12:34:56.789Z"
  }
}
```

### Listar todas las tareas

**Endpoint:** `GET /tasks`

```bash
curl http://localhost:3000/tasks
```

**Respuesta:**

```json
[
  {
    "id": 1,
    "description": "Comprar comestibles",
    "status": "todo",
    "createdAt": "2024-08-09T12:34:56.789Z",
    "updatedAt": "2024-08-09T12:34:56.789Z"
  }
]
```

### Actualizar una tarea

**Endpoint:** `PUT /tasks/:id`

```bash
curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"description": "Comprar comestibles y cocinar la cena"}'
```

**Respuesta:**

```json
{
  "message": "Tarea 1 actualizada exitosamente"
}
```

### Eliminar una tarea

**Endpoint:** `DELETE /tasks/:id`

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Respuesta:**

```json
{
  "message": "Tarea 1 eliminada exitosamente"
}
```

### Marcar una tarea como en progreso

**Endpoint:** `PATCH /tasks/:id/in-progress`

```bash
curl -X PATCH http://localhost:3000/tasks/1/in-progress
```

**Respuesta:**

```json
{
  "message": "Tarea 1 marcada como en progreso"
}
```

### Marcar una tarea como completada

**Endpoint:** `PATCH /tasks/:id/done`

```bash
curl -X PATCH http://localhost:3000/tasks/1/done
```

**Respuesta:**

```json
{
  "message": "Tarea 1 marcada como completada"
}
```

### Listar tareas por estado

Puedes filtrar las tareas según su estado (`todo`, `in-progress`, `done`).

**Endpoint:** `GET /tasks?status={status}`

```bash
curl http://localhost:3000/tasks?status=in-progress
```

**Respuesta:**

```json
[
  {
    "id": 1,
    "description": "Comprar comestibles y cocinar la cena",
    "status": "in-progress",
    "createdAt": "2024-08-09T12:34:56.789Z",
    "updatedAt": "2024-08-09T12:45:00.123Z"
  }
]
```

## Estructura del Proyecto

El proyecto tiene una estructura simple:

```
task-tracker-api/
│
├── index.js        # Archivo principal del servidor
├── tasks.json      # Archivo JSON que almacena las tareas
├── package.json    # Archivo de configuración de npm
└── README.md       # Documentación del proyecto
```

## Contribuir

Las contribuciones son bienvenidas. Si deseas contribuir:

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza los cambios necesarios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para obtener más detalles.

## Contacto

¡Gracias por utilizar Task Tracker API! Espero que te sea de utilidad para gestionar tus tareas.
