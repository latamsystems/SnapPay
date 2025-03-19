import express from "express";
import cors from "cors";

function setGatewayMiddlewares(app: express.Application) {
    // CORS (permite solicitudes desde diferentes dominios)
    app.use(cors());

    // Habilitar JSON y URL-encoded para req.body
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));

    // Servir archivos estáticos
    app.use(express.static("public"));
}

export default setGatewayMiddlewares;
