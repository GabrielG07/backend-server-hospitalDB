// Require
const express = require('express');
const Hospital = require('../models/hospital');

const app = express();

app.get('/hospital', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Petición GET Hospitales'
    });
});

module.exports = app;