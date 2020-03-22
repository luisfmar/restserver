const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { validartipo } = require('./upload');
const { verificaToken, verificaTokenImg } = require('../middlewares/authorization');

let pathProductos = '../../uploads/producto';
let pathUsuario = '../../uploads/usuario';


app.get('/imagen/:tipo/:img', verificaTokenImg , (req, res) => {
  let tipo  = req.params.tipo;
  let img  = req.params.img;

  validartipo(tipo, res);
  let pathFile =  path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
  if (fs.existsSync(pathFile)) {
    return res.sendFile(pathFile);
  } else {
    let defaultFile =  path.resolve(__dirname, '../assets/no_found_image.jpeg');
    return res.sendFile(defaultFile);
  }
});


module.exports = app;