const express = require('express');
const Vaga = require('./models/vaga');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');


//Configuração servidor
const app = express()
const port = 3000

app.listen(port, () => {
    console.log("Servidor rodando!")
})

//liberação de acesso
app.use(cors());

//configuração de resposta JSON
app.use(express.json());

/* credenciais do banco */
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

/* Conexão com o banco */
mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.bipjexe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log('Banco conectado')
    })
    .catch((err) => console.log(err))


/* Rota default */
app.get('/', (req, res) => {
    res.send('Hello World!')
})

//criar vaga
app.post('/register', async (req, res) => {
    const novaVaga = new Vaga(req.body);
    try {
        await novaVaga.save();
        res.status(201).json({ msg: 'Vaga criada com sucesso!' });
    } catch (err) {
        res.status(400).json({ error: "Erro ao criar vaga" });
    }
});

//listar vagas abertas
app.get('/vagasAbertas', async (req, res) => {
    try {
        const vagasAbertas = await Vaga.find({ status: 'Aberta' });
        res.json(vagasAbertas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//listar vagas encerradas
app.get('/vagasEncerradas', async (req, res) => {
    try {
        const vagasEncerradas = await Vaga.find({ status: 'Encerrada' });
        res.json(vagasEncerradas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//listar todas as vagas
app.get('/vagas', async (req, res) => {
    try {
        const vagas = await Vaga.find();
        res.json(vagas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); 

// Atualizar vaga para encerrada
app.put('/:id/encerrada', async (req, res) => {
    const id = req.params.id;
    try {
        const vaga = await Vaga.findByIdAndUpdate(id, { status: 'Encerrada' });
        if (!vaga) {
            return res.status(404).json({ message: 'Vaga não encontrada' });
        }
        res.status(200).json({ message: 'Vaga atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar vaga
app.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Vaga.findByIdAndDelete(id);
        res.status(200).json({ message: 'Vaga deletada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;