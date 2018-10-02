// Require
const express = require('express');
const { buscarHospitales, buscarMedicos, buscarUsuarios } = require('../middlewares/busqueda');

const app = express();

// ==============================================
// Busqueda por Tipo
// ==============================================
app.get('/busqueda/coleccion/:tabla/:termino', (req, res) => {

    let tabla = req.params.tabla;
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    let promesa;

    switch (tabla) {
        case 'hospitales':
            promesa = buscarHospitales(regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(regex);
            break;
        case 'usuarios':
            promesa = buscarUsuarios(regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La tabla: ' + tabla + ' no existe',
                }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

});


// ==============================================
// Busqueda General
// ==============================================
app.get('/busqueda/todo/:termino', (req, res, next) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Promise.all([
            buscarHospitales(regex),
            buscarMedicos(regex),
            buscarUsuarios(regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospital: respuestas[0],
                medico: respuestas[1],
                usuario: respuestas[2]
            });
        });

});

module.exports = app;