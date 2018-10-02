// Requires
const express = require('express');
const fileUpload = require('express-fileupload');
const { imagenUsuario, imagenMedico, imagenHospital } = require('../middlewares/imagenes');

const app = express();

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // Validar tipo
    let tiposValidos = ['usuarios', 'hospitales', 'medicos']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesPermitidas.join(', ')
            }
        });
    }

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error moviendo la imagen',
                    err
                }
            });
        }

        // Imagen cargada
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'medicos':
                imagenMedico(id, res, nombreArchivo);
                break;
            case 'hospitales':
                imagenHospital(id, res, nombreArchivo);
                break;
            default:
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El tipo no es valido'
                    }
                });
        }

    });

});

module.exports = app;