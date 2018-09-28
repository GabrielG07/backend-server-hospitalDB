// Requires
const express = require('express');

const app = express();

app.use(require('./usuario'));
app.use(require('./medico'));
app.use(require('./hospital'));
app.use(require('./login'));

module.exports = app;