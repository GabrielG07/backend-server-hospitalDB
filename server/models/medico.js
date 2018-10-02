// Require
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let medicoSchema = new Schema({

    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    img: {
        type: String,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Asignar un usuario es necesario']
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'Asignar un hospital es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Medico', medicoSchema);