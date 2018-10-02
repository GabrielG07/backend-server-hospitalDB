// Require
const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

const Hospital = require('../models/hospital');

const app = express();

// ==============================================
// Mostrar todos los hospitales
// ==============================================
app.get('/hospital', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Hospital.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'name email')
        .exec((err, hospitalDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error cargando la base de datos',
                        err
                    }
                });
            }

            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    hospital: hospitalDB,
                    total: conteo
                });
            })
        });

});

// ==============================================
// Crear un Hospital
// ==============================================
app.post('/hospital', verificaToken, (req, res) => {

    let body = req.body;

    let hospital = new Hospital({
        name: body.name,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalDB) => {
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
            hospital: hospitalDB
        });
    });

});

// ==============================================
// Actualizar un Hospital
// ==============================================
app.put('/hospital/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = req.body;

    let hospitalUpdate = {
        name: body.name,
        img: body.img,
        usuario: req.usuario._id
    };

    Hospital.findByIdAndUpdate(id, hospitalUpdate, { new: true, runValidators: true }, (err, hospitalDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error cargando la base de datos',
                    err
                }
            });
        }

        if (!hospitalDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe',
                    err
                }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalDB
        });
    });

});

// ==============================================
// Borrar un hospital
// ==============================================
app.delete('/hospital/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, HospitalDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error cargando la base de datos',
                    err
                }
            });
        }

        if (!HospitalDelete) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe',
                    err
                }
            });
        }

        res.status(200).json({
            ok: true,
            message: HospitalDelete.name + ' Eliminado'
        });
    });

});

module.exports = app;