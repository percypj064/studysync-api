require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

const gruposRoutes = require("./routes/grupos.routes");

app.use("/api/grupos", gruposRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({
    mensaje: "Error interno del servidor"
  });
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API StudySync funcionando correctamente");
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});