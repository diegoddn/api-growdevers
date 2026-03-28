import express from 'express';
import * as dotenv from 'dotenv';
import { growdevers } from './dados.js';
import { randomUUID } from 'crypto';
import { logBodyMiddleware, logMiddleware, logRequestMiddleware, validarGrowdeverMatriculadoMiddleware, validateGrowdeverMiddleware } from "./middlewares.js";
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(logMiddleware);

// Criar nossas rotas

// GET /growdevers - Listar growdevers
// QUERY PARAMS    /growdevers?idade=20
app.get("/growdevers", [logMiddleware, logRequestMiddleware], (req, res) => {
    try {
        const { idade, nome, email, email_includes } = req.query;

        let dados = growdevers;
        if(idade) {
            dados = dados.filter(item => item.idade === Number(idade));
    }

        if(nome) {
            dados = dados.filter(item => item.nome.includes(nome));

    }

        if(email) {
            dados = dados.filter(item => item.email === email);
    }

        if(email_includes) {
            dados = dados.filter(item => item.email.includes(email_includes));
    }


        res.status(200).send({
            ok: true,
            mensagem: "Growdevers listados com sucesso",
            dados
    })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            mensagem: error.toString()
        });
    }
})

// POST /growdevers - Criar um growdever
app.post("/growdevers", [logMiddleware, validateGrowdeverMiddleware, logBodyMiddleware], (req, res) => {
    try {
        // 1- entrada
        const body = req.body;

        const novoGrowdever = {
            id: randomUUID(),
            nome: body.nome,
            email: body.email,
            idade: body.idade,
            matriculado: body.matriculado
    }

        // 2- processamento
        growdevers.push(novoGrowdever);

        // 3- saida
        res.status(201).send ({
            ok: true,
            mensagem: "Growdever criado com sucesso",
            dados: growdevers
        });   
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            mensagem: error.toString()
        });
    }
})

// GET /growdevers/:id - Obter um growdever pelo seu id
app.get("/growdevers/:id", [ logRequestMiddleware], (req, res) => {
    try {
        // 1- entrada
        const { id } = req.params;

        // 2- processamento
        const growdever = growdevers.find((item) => item.id === id)
        if(!growdever) {
            return res.status(404).send({
                ok:false,
                mensagem: "Growdever não encontrado"
        });
    }

        // 3- saida
        res.status(200).send({
            ok: true,
            mensagem: "Growdever obtido com sucesso",
            dados: growdever
    })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            mensagem: error.toString()
        });
    }
})

// PUT /growdevers/:id = Aualizar um growdever especifico
app.put("/growdevers/:id", [validateGrowdeverMiddleware, logBodyMiddleware, validarGrowdeverMatriculadoMiddleware], (req, res) => {
    try {
        //1- entrada
        const { id } = req.params;
        const { nome, email, idade, matriculado } = req.body;

        //2-processamento
        const growdever = growdevers.find(item => item.id === id);
        if(!growdever) {
            return res.status(404).send({
                ok: false,
                mensagem: "Growdever não encontrado"
        })
    }

        growdever.nome = nome;
        growdever.email = email;
        growdever.idade = idade;
        growdever.matriculado = matriculado;

        //3-saida
        res.status(200).send({
            ok:true,
            mensagem: "Growdever atualizado com sucesso",
            dados: growdevers
    })   
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            mensagem: error.toString()
        });
    }
})

// PATCH /growdevers/:id - Toggle do campo matriculado
app.patch("/growdevers/:id", (req, res) => {
    try {
        //1- Entrada
        const { id } = req.params;

        //2- processamnento
        const growdever = growdevers.find(item => item.id === id);
        if(!growdever) {
            return res.status(404).send({
                ok: false,
                mensagem: "Growdever não encontrado"
        })
    }

        growdever.matriculado = !growdever.matriculado;

        //3- Saida
        res.status(200).send({
            ok: true,
            mensagem: "Growdever atualizado (matricula) com sucesso",
            dados: growdevers
    })   
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            mensagem: error.toString()
        });
    }
})

// DELETE /growdevers/:id - Excluir um growdever 
app.delete("/growdevers/:id", (req, res) => {
    try {
        //1- Entrada
        const { id } = req.params;

        //2- Processamento
        const growdeverIndex = growdevers.findIndex(item => item.id === id)
        if(growdeverIndex < 0) {
            return res.status(404).send ({
                ok: false,
                mensagem: "Growdever não encontrado"
        })
    }

        growdevers.splice(growdeverIndex, 1);

        //3- Saida
        res.status(200).send({
            ok: true,
            mensagem: "Growdever excluido com sucesso",
            dados: growdevers
    })   
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            mensagem: error.toString()
        });
    }
})

const porta = process.env.PORT;
app.listen(porta, () => {
    console.log("O servidor está executando na porta " + porta);
})