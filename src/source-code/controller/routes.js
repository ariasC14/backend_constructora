const express = require("express");
const { StatusCodes } = require("http-status-codes");

const {
  putDynamoDBItem,
  getDynamoDBItem,
  deleteDynamoDBItem,
  scanDynamoDBItems,  // Importar la nueva función
} = require("../aws/dynamodb");

const api = express.Router();

api.use(express.json());

api.route("/create-project")
  .post(async (request, response) => {
    try {
      const projectData = request.body;
      console.log("Datos recibidos:", projectData);

      await putDynamoDBItem(projectData);

      response
        .status(StatusCodes.OK)
        .json({ msg: "Tu proyecto ha sido creado", projectData });
    } catch (error) {
      console.error("Error", error);
      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Internal Server Error" });
    }
  });

api.get("/create-project/:id", async (request, response) => {
  try {
    const projectId = request.params.id;
    console.log("ID del proyecto solicitado:", projectId);

    const project = await getDynamoDBItem({ id: projectId });

    if (project) {
      response.status(StatusCodes.OK).json({ msg: "Proyecto encontrado", project });
    } else {
      response.status(StatusCodes.NOT_FOUND).json({ msg: "Proyecto no encontrado" });
    }
  } catch (error) {
    console.error("Error", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" });
  }
});

api.delete("/create-project/:id", async (request, response) => {
  try {
    const projectId = request.params.id;
    console.log("ID del proyecto a eliminar:", projectId);

    await deleteDynamoDBItem({ id: projectId });

    response.status(StatusCodes.OK).json({ msg: "Proyecto eliminado correctamente" });
  } catch (error) {
    console.error("Error", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" });
  }
});

api.get("/projects", async (request, response) => {
  try {
    const projects = await scanDynamoDBItems();
    response.status(StatusCodes.OK).json({ projects });
  } catch (error) {
    console.error("Error al obtener todos los proyectos", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error al obtener todos los proyectos" });
  }
});

module.exports = api;