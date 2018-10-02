// Requires
const fs = require('fs');
const path = require('path');

// Models
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error cargando la base de datos',
                    err
                }
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe',
                    err
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });

}

function imagenMedico(id, res, nombreArchivo) {

    Medico.findById(id, (err, medicoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'medicos')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error cargando la base de datos',
                    err
                }
            });
        }

        if (!medicoDB) {
            borrarArchivo(nombreArchivo, 'medicos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Medico no existe',
                    err
                }
            });
        }

        borrarArchivo(medicoDB.img, 'medicos');

        medicoDB.img = nombreArchivo;

        medicoDB.save((err, medicoGuardado) => {
            res.status(200).json({
                ok: true,
                medico: medicoGuardado,
                img: nombreArchivo
            });
        });
    });

}

function imagenHospital(id, res, nombreArchivo) {

    Hospital.findById(id, (err, hospitalDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'hospitales')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error cargando la base de datos',
                    err
                }
            });
        }

        if (!hospitalDB) {
            borrarArchivo(nombreArchivo, 'hospitales');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Hospital no existe',
                    err
                }
            });
        }

        borrarArchivo(hospitalDB.img, 'hospitales');

        hospitalDB.img = nombreArchivo;

        hospitalDB.save((err, hospitalGuardado) => {
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
                img: nombreArchivo
            });
        });
    });

}

function borrarArchivo(nombreImagen, tipo) {

    let pathUrl = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }

}

module.exports = {
    imagenUsuario,
    imagenMedico,
    imagenHospital
}