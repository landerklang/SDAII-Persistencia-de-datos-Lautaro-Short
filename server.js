const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// Almacenamiento en memoria por IP
const datosPorIP = {};

function obtenerIP(req) {
  return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
}

app.get("/api/alumnos", (req, res) => {
  const ip = obtenerIP(req);
  res.json(datosPorIP[ip] || []);
});

app.post("/api/alumnos", (req, res) => {
  const ip = obtenerIP(req);
  const { nombre, edad, nota } = req.body;

  if (!datosPorIP[ip]) {
    datosPorIP[ip] = [];
  }

  datosPorIP[ip].push({ nombre, edad, nota });

  // Ordenar
  datosPorIP[ip].sort((a, b) => {
    if (b.nota !== a.nota) return b.nota - a.nota;
    return a.nombre.localeCompare(b.nombre);
  });

  res.json(datosPorIP[ip]);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
