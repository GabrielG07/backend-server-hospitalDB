// Require
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let hospitalSchema = new Schema({

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
        required: [true, 'El usuario es necesario']
    }

}, { collection: 'hospitales' });

module.exports = mongoose.model('Hospital', hospitalSchema);