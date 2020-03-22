const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const uuid = require('uuid');
const fs = require('fs');

let pathProductos = '../../uploads/producto';
let pathUsuario = '../../uploads/usuario';

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
  let tipo  = req.params.tipo;
  let id  = req.params.id;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400)
              .json({
                ok: false,
                err: {
                  message: 'No files were uploaded.'
                }
              });
  }

  validartipo(tipo, res);

  let file = req.files.file
  let fileName = req.files.file.name;
  let extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];
  let nameFileSplited = fileName.split('.');
  let extension = nameFileSplited[nameFileSplited.length - 1];
  if ( extensionesPermitidas.indexOf( extension ) < 0 ) {
    return res.status(400)
              .json({
                ok: false,
                err: {
                  message: 'Las extensiones permitidas son: ' + extensionesPermitidas.join(', ')
                }
              });
  }
  let randomUuid = uuid.v4();
  fileName = randomUuid + '-' + fileName;
  console.log(fileName);
  let pathFile =  path.resolve(__dirname, `../../uploads/${tipo}/${fileName}`);
  // Use the mv() method to place the file somewhere on your server
  file.mv(pathFile, (err) => {
    if (err)
      return res.status(500)
                .json({
                  ok: false,
                  err: err
                });
    if (tipo === 'usuario') {
      imagenUsuario(id, fileName, res);
    } else {
      imagenProducto(id, fileName, res);
    }

  });
});

let existFile = (pathFolder, fileName) => {
  let pathFile= path.resolve(__dirname, `${pathFolder}/${fileName}`);
  return fs.existsSync(pathFile);
}

function removeFile(pathFolder, fileName) {
  if (fileName && existFile(pathFolder, fileName)) {
    let pathFile= path.resolve(__dirname, `${pathFolder}/${fileName}`);
    fs.unlinkSync(pathFile);
  }
}

function imagenUsuario(id, fileName, res) {
  Usuario.findById(id, (err, usuarioBBDD) => {
    if(err) {
      removeFile(pathUsuario, fileName);
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioBBDD) {
      removeFile(pathUsuario, fileName);
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no existe'
        }
      });
    }

    removeFile(pathUsuario, usuarioBBDD.img);

    usuarioBBDD.img = fileName;

    usuarioBBDD.save( (err, usuarioBBDD) => {
      if (err) {
        removeFile(pathUsuario, fileName);
        return res.status(400).json({
          ok: false,
          err
        });
      }
      return res.json({
        ok: true,
        usuario: usuarioBBDD
      });
    });

  });
}

function imagenProducto(id, fileName, res) {
  Producto.findById(id, (err, productoBBDD) => {
    if(err) {
      removeFile(pathProductos, fileName);
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoBBDD) {
      removeFile(pathProductos, fileName);
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no existe'
        }
      });
    }

    removeFile(pathProductos, productoBBDD.img);

    productoBBDD.img = fileName;

    productoBBDD.save( (err, productoBBDD) => {
      if (err) {
        removeFile(pathProductos, fileName);
        return res.status(400).json({
          ok: false,
          err
        });
      }
      return res.json({
        ok: true,
        producto: productoBBDD
      });
    });

  });
}

let validartipo = (tipo, res) => {
  /* Validar tipos */
  let tipos_validos = ['producto', 'usuario'];
  if ( tipos_validos.indexOf( tipo ) < 0 ) {
    return res.status(400)
    .json({
      ok: false,
      err: {
        message: 'Los tipos permitidos son: ' + tipos_validos.join(', ')
      }
    });
  }
}


module.exports = {
  appUpload: app,
  validartipo
}