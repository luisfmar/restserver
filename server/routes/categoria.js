const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/authorization');

let app = express();

let Categoria = require('../models/categoria');

/* Muestra todas la categorias */
app.get('/categoria', verificaToken, (req, res) => {
  Categoria.find({})
    .sort('description')
    .populate('usuario', 'nombre email')
    .exec((err, categoriaBBDD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      return res.json({
        ok: true,
        categoria: categoriaBBDD
      });
    });
});

/* Muestra una categoria */
app.get('/categoria/:id', verificaToken, (req, res) => {
  let id = req.params.id;
  Categoria.findById(id, (err, categoriaBBDD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!categoriaBBDD) {
      return res.status(500).json({
        ok: false,
        err: 'El ID no es correcto'
      });
    }
    return res.json({
      ok: true,
      categoria: categoriaBBDD
    });
  });
});

/* Crear una categoria */
app.post('/categoria', verificaToken, (req, res) => {
  let body = req.body;
  let categoria = new Categoria({
    description: body.description,
    usuario: req.usuario._id
  });

  categoria.save( (err, categoriaBBDD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!categoriaBBDD) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      categoria: categoriaBBDD
    });
  });

});

/* Crear una categoria */
app.put('/categoria/:id', (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let data = {
    description: body.description
  }
  Categoria.findByIdAndUpdate(id, data, {new: true, runValidators: true}, (err, categoriaBBDD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!categoriaBBDD) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      categoria: categoriaBBDD
    });
  });
});

/* Crear una categoria */
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;

  Categoria.findByIdAndRemove(id, (err, categoriaBBDD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!categoriaBBDD) {
      return res.status(500).json({
        ok: false,
        err: {
          message: 'El id no existe'
        }
      });
    }

    return res.json({
      ok: true,
      msg: {
        mensage: 'Categoria borrada',
        categoria: categoriaBBDD
      }
    });
  });
});




module.exports = app;

