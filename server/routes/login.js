const express = require('express');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const config = require('../config/config');
const app = express();


app.post('/login', function (req, res) {
  let body = req.body;

  Usuario.findOne({
    email: body.email
  }, (err, usuarioDB) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioDB) {
      res.status(400).json({
        ok: false,
        usuario: "El usuario o constraseña no es correcto" // El usuario no ha sido encontrado
      });
    }

    if(!bycrypt.compareSync(body.password, usuarioDB.password)) {
      res.status(400).json({
        ok: false,
        usuario: "El usuario o constraseña no es correcto" // El usuario no ha sido encontrado
      });
    }

    let token = jwt.sign({
      usuario: usuarioDB
    }, process.env.SEED_TOKEN, {expiresIn: process.env.CADUCIDAD_TOKEN});

    res.json({
      ok: true,
      token
    });

  });
});



module.exports = app;