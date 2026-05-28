const prisma = require("../prisma");
const Redis = require("ioredis");

const express = require("express");
const router = express.Router();

const redis = new Redis(process.env.REDIS_URL, {
  tls: {},
  maxRetriesPerRequest: null,
});


/**
 * @swagger
 * /api/grupos:
 *   get:
 *     summary: Obtener todos los grupos
 *     responses:
 *       200:
 *         description: Lista de grupos
 */
router.get("/", async (req, res) => {

  try {

    const grupos = await prisma.grupo.findMany();

    res.status(200).json(grupos);

  } catch (error) {

    res.status(500).json({
      mensaje: "Error obteniendo grupos"
    });

  }

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
router.get("/buscar/:materia", async (req, res) => {

  try {

    const materiaBuscada = req.params.materia;

    const resultados = await prisma.grupo.findMany({
      where: {
        materia: {
          contains: materiaBuscada,
          mode: "insensitive"
        }
      }
    });

    if (resultados.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron grupos"
      });
    }

    res.status(200).json(resultados);

  } catch (error) {

    res.status(500).json({
      mensaje: "Error buscando grupos"
    });

  }

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
router.get("/:id", async (req, res) => {

  try {

    const grupo = await prisma.grupo.findUnique({
      where: {
        id: Number(req.params.id)
      }
    });

    if (!grupo) {
      return res.status(404).json({
        mensaje: "Grupo no encontrado"
      });
    }

    res.status(200).json(grupo);

  } catch (error) {

    res.status(500).json({
      mensaje: "Error obteniendo grupo"
    });

  }

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
router.post("/", async (req, res) => {

  try {

    const { nombre, materia, integrantes } = req.body;

    if (!nombre || !materia || !integrantes) {

      return res.status(400).json({
        mensaje: "Faltan campos obligatorios"
      });

    }

    const nuevoGrupo = await prisma.grupo.create({
      data: {
        nombre,
        materia,
        integrantes
      }
    });

    // EVENTO REDIS
    const evento = {
      tipo: "GRUPO_CREADO",
      payload: nuevoGrupo,
      timestamp: new Date().toISOString()
    };

    await redis.publish(
      "study:grupo:creado",
      JSON.stringify(evento)
    );

    res.status(201).json(nuevoGrupo);

  } catch (error) {

    res.status(500).json({
      mensaje: "Error creando grupo"
    });

  }

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
router.put("/:id", async (req, res) => {

  try {

    const { nombre, materia, integrantes } = req.body;

    const grupoActualizado = await prisma.grupo.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        nombre,
        materia,
        integrantes
      }
    });

    res.status(200).json(grupoActualizado);

  } catch (error) {

    res.status(500).json({
      mensaje: "Error actualizando grupo"
    });

  }

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
router.delete("/:id", async (req, res) => {

  try {

    await prisma.grupo.delete({
      where: {
        id: Number(req.params.id)
      }
    });

    res.status(200).json({
      mensaje: "Grupo eliminado correctamente"
    });

  } catch (error) {

    res.status(500).json({
      mensaje: "Error eliminando grupo"
    });

  }

});
module.exports = router;