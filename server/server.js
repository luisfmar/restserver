require('../config/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/usaurios', function (req, res) {
  res.json('get usuarios');
});

app.post('/usuario', function (req, res) {
  let body = req.body;
  if (!body.nombre) {
    res.status(400).json({
      ok: false,
      mensaje: 'El campo nombre es necesario'
    });
  } else {
    res.json(body);
  }
});

app.put('/usuario/:id', function (req, res) {
  let id = req.params.id;
  res.json({
    id
  });
});

app.delete('/usuario/:id', function (req, res) {
  res.json('delete usuario');
});

app.listen(process.env.PORT, () => {
  console.log(`Listening in port: ${process.env.PORT}`)
});