// Require
const express = require('express');
const Medico = require('../models/medico');

const app = express();

app.get('/medico', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Petición GET Medicos'
    });
});

module.exports = app;