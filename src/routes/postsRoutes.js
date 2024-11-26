import express from "express";
import multer from "multer";
import { listarPosts, PostarNovoPost, uploadImagem, AtualizarNovoPost } from "../controllers/postsControllers.js";
import cors from "cors"

const corsOpt = {
origin : "http://localhost:8000",
optionsSuccessStatus: 200
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ dest: "./uploads", storage });

const routes = (app) => {
    // Habilita o parsing de JSON no corpo das requisições
    app.use(express.json());

    app.use(cors(corsOpt));

    // Rota GET para buscar todos os posts
    app.get("/posts", listarPosts);

    // Rota POST para cadastrar os posts
    app.post("/posts", PostarNovoPost);

    // Rota POST para cadastrar os posts
    app.post("/upload", upload.single("img"), uploadImagem);

    app.put("/upload/:id", AtualizarNovoPost)
}

export default routes;