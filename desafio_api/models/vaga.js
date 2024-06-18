const mongoose = require('mongoose');

const vagaSchema = new mongoose.Schema({
    descricao: {type: String, required: true},
    cargo: {type: String, required: true},
    tipoContratacao: {type: String, required: true},
    salario: {type: String, required: true},
    localTrabalho: {type: String, required: true},
    status: { type: String, enum: ['Aberta', 'Encerrada'], default: 'Aberta' }
});

module.exports = mongoose.model('Vaga', vagaSchema);