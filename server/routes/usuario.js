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
app.get('/usuario', verificaToken, (req, res, next) => {

    Usuario.find({}, (err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error cargando usuarios',
                err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarios
        });
    });

});


// ==============================================
// Crear un nuevo usuario
// ==============================================
app.post('/usuario', (req, res, next) => {

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
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
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
app.put('/usuario/:id', (req, res, next) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['name', 'email', 'img', 'role']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error al buscar usuario'
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
app.delete('/usuario/:id', (req, res, next) => {

    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error al buscar usuario'
                }
            });
        }

        if (!usuarioDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
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