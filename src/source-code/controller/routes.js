const express = require("express");
const multer = require('multer');
const { StatusCodes } = require("http-status-codes");

const upload = multer({ storage: multer.memoryStorage() });

// Importing the functions from the DynamoDB SDK
const {
  putDynamoDBItem,
  getDynamoDBItem,
  deleteDynamoDBItem,
} = require("../aws/dynamodb");

// Importing the functions from the S3 SDK
const {
  uploadS3File,
  ListS3Files,
  getS3File,
  deleteS3File,
} = require("../aws/s3");

const api = express.Router();

// Endpoint para crear un proyecto de vivienda (POST, GET, DELETE)
api.route("/create-project")
  // POST: Crear un proyecto
  .post(async (request, response) => {
    try {
      const projectData = request.body; // Utiliza los datos del cuerpo de la solicitud

      // Guardar el proyecto en DynamoDB
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

// GET: Obtener un proyecto
api.get("/create-project/:id", async (request, response) => {
  try {
    const projectId = request.params.id; // Utiliza el ID proporcionado en los parámetros de ruta

    // Obtener el proyecto de DynamoDB utilizando el ID proporcionado
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

// DELETE: Eliminar un proyecto
api.delete("/create-project/:id", async (request, response) => {
  try {
    const projectId = request.params.id; // Se utiliza el ID proporcionado en los parámetros de ruta

    // Eliminar el proyecto de DynamoDB utilizando el ID proporcionado
    await deleteDynamoDBItem({ id: projectId });

    response.status(StatusCodes.OK).json({ msg: "Proyecto eliminado correctamente" });
  } catch (error) {
    console.error("Error", error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" });
  }
});
/*
api.post("/path2", upload.single("file"), async (request, response) => {
  try {
    console.info("BODY", request.file);

    const fileInfo = request.file;
    console.info("FILE INFO", fileInfo);

    const { originalname, buffer, mimetype } = fileInfo;

    // Subir un archivo a S3
    await uploadS3File({ key: originalname, buffer, mimetype });

    // Listar todos los archivos de S3
    const s3Files = await ListS3Files();
    console.info("S3 Files", s3Files);

    // Obtener el archivo de S3
    const s3File = await getS3File(originalname);
    console.info(`S3 File With Name ${originalname}`, s3File);

    // Eliminar el archivo de S3
    await deleteS3File(originalname);

    response
      .status(StatusCodes.OK)
      .json({ msg: "Hello from path2" });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});
*/
module.exports = api;
