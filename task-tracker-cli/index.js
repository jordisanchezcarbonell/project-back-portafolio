// Importamos los módulos necesarios
const express = require("express"); // Importa el framework Express para crear el servidor web
const fs = require("fs"); // Importa el módulo de sistema de archivos (filesystem) para manejar archivos
const path = require("path"); // Importa el módulo de path para manejar y transformar rutas de archivos

const app = express(); // Crea una instancia de Express
const PORT = process.env.PORT || 3000; // Define el puerto en el que se ejecutará el servidor (3000 por defecto)

// Middleware para parsear JSON en las solicitudes
app.use(express.json()); // Permite que la aplicación acepte y procese datos JSON en el cuerpo de las solicitudes

const tasksFile = path.join(__dirname, "tasks.json"); // Define la ruta al archivo JSON donde se almacenarán las tareas

// Inicializar el archivo JSON si no existe
if (!fs.existsSync(tasksFile)) {
  fs.writeFileSync(tasksFile, JSON.stringify([])); // Si el archivo no existe, se crea y se inicializa con un array vacío
}

// Función para cargar las tareas desde el archivo JSON
function loadTasks() {
  const data = fs.readFileSync(tasksFile); // Lee el contenido del archivo JSON
  return JSON.parse(data); // Convierte los datos en un objeto JavaScript
}

// Función para guardar las tareas en el archivo JSON
function saveTasks(tasks) {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2)); // Escribe el array de tareas en el archivo JSON con una identación de 2 espacios
}

// Rutas de la API

// Ruta para añadir una nueva tarea
app.post("/tasks", (req, res) => {
  const tasks = loadTasks(); // Carga las tareas existentes
  const newTask = {
    id: tasks.length + 1, // Asigna un ID único a la nueva tarea
    description: req.body.description, // Toma la descripción de la tarea desde el cuerpo de la solicitud
    status: "todo", // Establece el estado inicial de la tarea como 'todo'
    createdAt: new Date().toISOString(), // Guarda la fecha y hora de creación en formato ISO
    updatedAt: new Date().toISOString(), // Guarda la fecha y hora de la última actualización (igual a la de creación inicialmente)
  };
  tasks.push(newTask); // Añade la nueva tarea al array de tareas
  saveTasks(tasks); // Guarda el array actualizado en el archivo JSON
  res
    .status(201)
    .json({ message: "Tarea añadida exitosamente", task: newTask }); // Envía una respuesta con la nueva tarea creada
});

// Ruta para listar todas las tareas o por estado
app.get("/tasks", (req, res) => {
  const tasks = loadTasks(); // Carga todas las tareas
  const { status } = req.query; // Obtiene el estado (status) desde los parámetros de la consulta (query)

  if (status) {
    // Si se especifica un estado, filtra las tareas por ese estado
    const filteredTasks = tasks.filter((task) => task.status === status);
    res.json(filteredTasks); // Envía las tareas filtradas como respuesta
  } else {
    // Si no se especifica un estado, devuelve todas las tareas
    res.json(tasks);
  }
});

// Ruta para actualizar una tarea
app.put("/tasks/:id", (req, res) => {
  let tasks = loadTasks(); // Carga todas las tareas
  const taskId = parseInt(req.params.id, 10); // Convierte el ID de la tarea desde el parámetro de la ruta a un número entero
  const updatedDescription = req.body.description; // Toma la nueva descripción de la tarea desde el cuerpo de la solicitud

  let taskUpdated = false; // Variable para rastrear si la tarea fue actualizada
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      // Si se encuentra la tarea con el ID especificado, se actualiza
      taskUpdated = true;
      return {
        ...task,
        description: updatedDescription,
        updatedAt: new Date().toISOString(),
      }; // Actualiza la descripción y la fecha de actualización
    }
    return task; // Devuelve la tarea sin cambios si el ID no coincide
  });

  if (taskUpdated) {
    // Si la tarea fue actualizada, se guarda y se envía una respuesta de éxito
    saveTasks(tasks);
    res.json({ message: `Tarea ${taskId} actualizada exitosamente` });
  } else {
    // Si no se encontró la tarea, se envía una respuesta de error
    res.status(404).json({ message: `Tarea ${taskId} no encontrada` });
  }
});

// Ruta para eliminar una tarea
app.delete("/tasks/:id", (req, res) => {
  let tasks = loadTasks(); // Carga todas las tareas
  const taskId = parseInt(req.params.id, 10); // Convierte el ID de la tarea desde el parámetro de la ruta a un número entero

  const initialLength = tasks.length; // Guarda la longitud inicial del array de tareas
  tasks = tasks.filter((task) => task.id !== taskId); // Filtra las tareas eliminando la que coincide con el ID

  if (tasks.length < initialLength) {
    // Si la longitud del array cambió, significa que la tarea fue eliminada
    saveTasks(tasks);
    res.json({ message: `Tarea ${taskId} eliminada exitosamente` });
  } else {
    // Si la longitud no cambió, la tarea no fue encontrada
    res.status(404).json({ message: `Tarea ${taskId} no encontrada` });
  }
});

// Ruta para marcar una tarea como en progreso
app.patch("/tasks/:id/in-progress", (req, res) => {
  let tasks = loadTasks(); // Carga todas las tareas
  const taskId = parseInt(req.params.id, 10); // Convierte el ID de la tarea desde el parámetro de la ruta a un número entero

  let taskUpdated = false; // Variable para rastrear si la tarea fue actualizada
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      // Si se encuentra la tarea con el ID especificado, se actualiza el estado a 'in-progress'
      taskUpdated = true;
      return {
        ...task,
        status: "in-progress",
        updatedAt: new Date().toISOString(),
      }; // Actualiza el estado y la fecha de actualización
    }
    return task; // Devuelve la tarea sin cambios si el ID no coincide
  });

  if (taskUpdated) {
    // Si la tarea fue actualizada, se guarda y se envía una respuesta de éxito
    saveTasks(tasks);
    res.json({ message: `Tarea ${taskId} marcada como en progreso` });
  } else {
    // Si no se encontró la tarea, se envía una respuesta de error
    res.status(404).json({ message: `Tarea ${taskId} no encontrada` });
  }
});

// Ruta para marcar una tarea como completada
app.patch("/tasks/:id/done", (req, res) => {
  let tasks = loadTasks(); // Carga todas las tareas
  const taskId = parseInt(req.params.id, 10); // Convierte el ID de la tarea desde el parámetro de la ruta a un número entero

  let taskUpdated = false; // Variable para rastrear si la tarea fue actualizada
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      // Si se encuentra la tarea con el ID especificado, se actualiza el estado a 'done'
      taskUpdated = true;
      return { ...task, status: "done", updatedAt: new Date().toISOString() }; // Actualiza el estado y la fecha de actualización
    }
    return task; // Devuelve la tarea sin cambios si el ID no coincide
  });

  if (taskUpdated) {
    // Si la tarea fue actualizada, se guarda y se envía una respuesta de éxito
    saveTasks(tasks);
    res.json({ message: `Tarea ${taskId} marcada como completada` });
  } else {
    // Si no se encontró la tarea, se envía una respuesta de error
    res.status(404).json({ message: `Tarea ${taskId} no encontrada` });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`); // Muestra un mensaje en la consola cuando el servidor está listo
});
