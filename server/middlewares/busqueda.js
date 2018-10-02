// Models
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

function buscarHospitales(regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex })
            .populate('usuario', 'name email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            })
    });

}

function buscarMedicos(regex) {

    return new Promise((resolve, reject) => {
        Medico.find({ name: regex, estado: true })
            .populate('usuario', 'name email')
            .populate('hospital', 'name')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });

}

function buscarUsuarios(regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({ estado: true }, 'name email role')
            .or([{ 'name': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });

}

module.exports = {
    buscarHospitales,
    buscarMedicos,
    buscarUsuarios
}