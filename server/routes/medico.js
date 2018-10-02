// Require
const express = require('express');
const Medico = require('../models/medico');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

// ==============================================
// Obtener medicos
// ==============================================
app.get('/medico', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Medico.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'name email')
        .populate('hospital', 'name')
        .exec((err, medicoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error cargando la base de datos',
                        err
                    }
                });
            }

            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medico: medicoDB,
                    total: conteo
                });
            })
        });

});

// ==============================================
// Crear un nuevo medico
// ==============================================
app.post('/medico', verificaToken, (req, res) => {

    let body = req.body;

    let medico = new Medico({
        name: body.name,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error cargando la base de datos',
                    err
                }
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoDB
        });
    });

});

// ==============================================
// Actualizar un medico
// ==============================================
app.put('/medico/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let medicoUpdate = {
        name: req.body.name,
        img: req.body.img,
        hospital: req.body.hospital
    }

    Medico.findByIdAndUpdate(id, medicoUpdate, { new: true, runValidators: true }, (err, medicoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error cargando la base de datos',
                    err
                }
            });
        }

        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe',
                    err
                }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoDB
        });
    });

});

// ==============================================
// Eliminar un medico
// ==============================================
app.delete('/medico/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let medicoEstado = {
        estado: false
    }

    Medico.findByIdAndUpdate(id, medicoEstado, (err, medicoDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error cargando la base de datos',
                    err
                }
            });
        }

        if (!medicoDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe',
                    err
                }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoDelete.name + ' Eliminado'
        });
    });
});


module.exports = app;