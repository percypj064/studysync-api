require("dotenv").config();

console.log("REDIS URL:");
console.log(process.env.REDIS_URL);

const Redis = require("ioredis");
const chalk = require("chalk").default;

const sub = new Redis(process.env.REDIS_URL, {
  tls: {},
  maxRetriesPerRequest: null,
});

sub.on("connect", () => {
  console.log(chalk.green("Subscriber conectado a Redis"));
});

sub.on("error", (err) => {
  console.error(chalk.red("Error Redis:"), err);
});

async function iniciarSubscriber() {

  try {

    await sub.psubscribe("study:*");

    console.log(
      chalk.yellow("Escuchando canales study:*")
    );

    sub.on("pmessage", (pattern, channel, message) => {

      const data = JSON.parse(message);

      console.log("\n====================================");

      // EVENTO 1
      if (data.tipo === "SESION_CREADA") {

        console.log(
          chalk.blue.bold(" NUEVA SESIÓN CREADA")
        );

        console.log(
          chalk.cyan(" Canal:"), channel
        );

        console.log(
          chalk.cyan(" Usuario:"),
          data.payload.usuario
        );

        console.log(
          chalk.cyan(" Tema:"),
          data.payload.tema
        );

      }

      // EVENTO 2
      else if (data.tipo === "USUARIO_UNIDO") {

        console.log(
          chalk.green.bold(" USUARIO UNIDO")
        );

        console.log(
          chalk.cyan(" Canal:"), channel
        );

        console.log(
          chalk.cyan(" Usuario:"),
          data.payload.usuario
        );

        console.log(
          chalk.cyan(" Grupo:"),
          data.payload.grupo
        );

      }

      // EVENTO 3
      else if (data.tipo === "MATERIAL_PUBLICADO") {

        console.log(
          chalk.magenta.bold(" MATERIAL PUBLICADO")
        );

        console.log(
          chalk.cyan(" Canal:"), channel
        );

        console.log(
          chalk.cyan(" Profesor:"),
          data.payload.profesor
        );

        console.log(
          chalk.cyan(" Materia:"),
          data.payload.materia
        );

        console.log(
          chalk.cyan(" Archivo:"),
          data.payload.archivo
        );

      }

      else if (data.tipo === "GRUPO_CREADO") {

        console.log(
          chalk.blue.bold(" NUEVO GRUPO CREADO")
        );

        console.log(
          chalk.cyan(" Canal:"), channel
        );

        console.log(
          chalk.cyan(" Nombre:"),
          data.payload.nombre
        );

        console.log(
          chalk.cyan(" Materia:"),
          data.payload.materia
        );

        console.log(
          chalk.cyan(" Integrantes:"),
          data.payload.integrantes
        );

      }

      console.log(
        chalk.gray(" Fecha:"),
        data.timestamp
      );

      console.log("====================================");

    });

  } catch (error) {

    console.error(
      chalk.red("Error en subscriber:"),
      error
    );

  }

}

iniciarSubscriber();