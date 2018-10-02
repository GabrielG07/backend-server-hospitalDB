// Require
const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

// ==============================================
// Obtener todos los usuarios
// ==============================================
app.get('/usuario', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'name email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error cargando la base de datos',
                        err
                    }
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    usuario: usuarios,
                    total: conteo
                });
            });
        });

});


// ==============================================
// Crear un nuevo usuario
// ==============================================
app.post('/usuario', verificaToken, (req, res, next) => {

    let body = req.body;

    if (!body.password) {
        res.status(400).json({
            ok: false,
            err: 'El password es necesario'
        });
    }

    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error al cargar la base de datos',
                    err
                }
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

// ==============================================
// Actualizar un usuario
// ==============================================
app.put('/usuario/:id', verificaToken, (req, res, next) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['name', 'email', 'img', 'role']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error cargando la base de datos',
                    err
                }
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.status(200).json({
            ok: true,
            userUpdated: usuarioDB
        });
    });

});

// ==============================================
// Eliminar un usuario
// ==============================================
app.delete('/usuario/:id', verificaToken, (req, res, next) => {

    let id = req.params.id;

    let newEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, newEstado, { new: true }, (err, usuarioDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error cargando la base de datos',
                    err
                }
            });
        }

        if (!usuarioDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado',
                    err
                }
            });
        }

        res.status(200).json({
            ok: true,
            userDelete: usuarioDelete
        });
    });

});


module.exports = app;