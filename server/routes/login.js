const express = require('express');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const {OAuth2Client} = require('google-auth-library');
const Usuario = require('../models/usuario');
const config = require('../config/config');
const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


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

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}

app.post('/logingoogle', async (req, res) => {
  let token = req.body.idtoken;
  let googleUser = await verify(token)
      .catch( e => {
        return res.status(403).json({
          ok: false,
          err: e
        });
      });
  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (usuarioDB) {
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          message: "Debe usar la autenticación normal"
        });
      } else {
        let token = jwt.sign({
          usuario: usuarioDB
        }, process.env.SEED_TOKEN, {expiresIn: process.env.CADUCIDAD_TOKEN});
        return res.json({
          ok: true,
          token
        });
      }
    } else {
      // El usuario no existe en BBDD
      let user = new Usuario({
        nombre: googleUser.nombre,
        email: googleUser.email,
        img: googleUser.img,
        google: googleUser.google,
        password: ':)'
      });
      user.save((err, usuarioBBDD) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }
        let token = jwt.sign({
          usuario: usuarioDB
        }, process.env.SEED_TOKEN, {expiresIn: process.env.CADUCIDAD_TOKEN});
        return res.json({
          ok: true,
          usuario: usuarioBBDD,
          token
        });
      });
    }
  });

});


module.exports = app;