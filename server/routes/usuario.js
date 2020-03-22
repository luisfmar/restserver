const express = require('express');
const bycrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/authorization');
app.get('/usuario', verificaToken, (req, res) => {
  let desde = req.query.desde || 0;
  let limite = req.query.limit || 5;
  desde = Number(desde);
  limite = Number(limite);
  Usuario.find({ estado: true}, 'nombre email google emal role')
    .skip(desde)
    .limit(limite)
    .exec( (err, usuarios) => {
      if (err) {
        res.status(400).json({
          ok: false,
          err
        });
      }
      Usuario.count({estado: true}, (err, total) => {
        res.json({
          ok: true,
          total: total,
          usuarios
        });
      });
    });
});

app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bycrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save( (err, usuarioBBDD) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBBDD
    });
  });
});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'estado', 'img', 'role']);
  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioBD) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      usuario: usuarioBD
    });
  });
});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;
  let data = {
    estado: false
  }
  Usuario.findByIdAndUpdate(id, data, {new: true}, (err, usuarioBD) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      usuario: usuarioBD
    });
  });
  /*Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err
      });
    }
    let responseBody = usuarioBorrado ? usuarioBorrado : "Usuario no encontrado";
    res.json({
      ok: true,
      usuario: responseBody
    });

  });*/
});


module.exports = app;