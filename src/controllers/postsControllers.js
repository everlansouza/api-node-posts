import { getTodosPosts, criarPost, AtualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/germiniServices.js"

export async function listarPosts(req, res) {
    // Chama a função para buscar os posts
    const posts = await getTodosPosts();

    // Envia os posts como resposta em formato JSON com status 200 (OK)
    res.status(200).json(posts);
}

export async function PostarNovoPost(req, res) {
    try {
        const postCriado = await criarPost(req.body);

        res.status(200).json(postCriado);
    }
    catch (erro) {
        console.error(erro.message);

        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    }

    try {
        const postCriado = await criarPost(novoPost);

        const imgAtualizada = `uploads/${postCriado.insertedId}.png`;

        fs.renameSync(req.file.path, imgAtualizada);

        res.status(200).json(postCriado);
    }
    catch (erro) {
        console.error(erro.message);

        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

export async function AtualizarNovoPost(req, res) {
    const urlImagem = `http://localhost:3000/${req.params.id}.png`;

    try {
        const imgBuffer = fs.readFileSync(`uploads/${req.params.id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postAtualizado = await AtualizarPost(req.params.id, post);

        res.status(200).json(postAtualizado);
    }
    catch (erro) {
        console.error(erro.message);

        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}