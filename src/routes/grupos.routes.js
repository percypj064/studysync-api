const express = require("express");
const router = express.Router();

const grupos = require("../data/grupos");

/**
 * @swagger
 * /api/grupos:
 *   get:
 *     summary: Obtener todos los grupos
 *     responses:
 *       200:
 *         description: Lista de grupos
 */
router.get("/", (req, res) => {
  res.status(200).json(grupos);
});

/**
 * @swagger
 * /api/grupos/buscar/{materia}:
 *   get:
 *     summary: Obtener grupos por materia
 *     parameters:
 *       - in: path
 *         name: materia
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de grupos por materia
 */
router.get("/buscar/:materia", (req, res) => {

  const materiaBuscada = req.params.materia.toLowerCase();

  const resultados = grupos.filter(g =>
    g.materia.toLowerCase().includes(materiaBuscada)
  );

  if (resultados.length === 0) {
    return res.status(404).json({
      mensaje: "No se encontraron grupos"
    });
  }

  res.status(200).json(resultados);
});

/**
 * @swagger
 * /api/grupos/{id}:
 *   get:
 *     summary: Obtener grupo por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grupo encontrado
 */
router.get("/:id", (req, res) => {
  const grupo = grupos.find(g => g.id == req.params.id);

  if (!grupo) {
    return res.status(404).json({
      mensaje: "Grupo no encontrado"
    });
  }

  res.status(200).json(grupo);
});

/**
 * @swagger
 * /api/grupos:
 *   post:
 *     summary: Crear un nuevo grupo
 *     responses:
 *       201:
 *         description: Grupo creado correctamente
 */
router.post("/", (req, res) => {
  const { nombre, materia, integrantes } = req.body;

  if (!nombre || !materia || !integrantes) {
    return res.status(400).json({
      mensaje: "Faltan campos obligatorios"
    });
  }

  const nuevoGrupo = {
    id: grupos.length + 1,
    nombre,
    materia,
    integrantes
  };

  grupos.push(nuevoGrupo);

  res.status(201).json(nuevoGrupo);
});

/**
 * @swagger
 * /api/grupos/{id}:
 *   put:
 *     summary: Actualizar un grupo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grupo actualizado correctamente
 */
router.put("/:id", (req, res) => {
  const grupo = grupos.find(g => g.id == req.params.id);

  if (!grupo) {
    return res.status(404).json({
      mensaje: "Grupo no encontrado"
    });
  }

  const { nombre, materia, integrantes } = req.body;

  grupo.nombre = nombre;
  grupo.materia = materia;
  grupo.integrantes = integrantes;

  res.status(200).json(grupo);
});

/**
 * @swagger
 * /api/grupos/{id}:
 *   delete:
 *     summary: Eliminar un grupo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grupo eliminado correctamente
 */
router.delete("/:id", (req, res) => {
  const index = grupos.findIndex(g => g.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({
      mensaje: "Grupo no encontrado"
    });
  }

  grupos.splice(index, 1);

  res.status(200).json({
    mensaje: "Grupo eliminado correctamente"
  });
});

module.exports = router;