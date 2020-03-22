const express = require('express');

let { verificaToken } = require('../middlewares/authorization');

let app = express();

let Producto = require('../models/producto');

/* Muestra todos los producto */
app.get('/producto', verificaToken, (req, res) => {
  let desde = req.query.desde || 0;
  let limite = req.query.limite || 5;
  Producto.find({ disponible: true })
  .skip(Number(desde))
  .limit(Number(limite))
  .sort('nombre')
  .populate('usuario', 'nombre email')
  .populate('categoria', 'description')
  .exec((err, productoBBDD) => {
    if (err) {
      return res.status(500).json({
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


/* Muestra una producto */
app.get('/producto/:id', verificaToken, (req, res) => {
  let id = req.params.id;
  Producto.findById(id, (err, productoBBDD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!productoBBDD) {
      return res.status(500).json({
        ok: false,
        err: 'El ID no es correcto'
      });
    }
    return res.json({
      ok: true,
      producto: productoBBDD
    });
  });
});

/* Muestra una producto */
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
  let termino = req.params.termino;
  let regex = new RegExp(termino, 'i');// no sensible a mayusculas y minusculas
  Producto.find({ nombre: regex })
  .populate('usuario', 'nombre email')
  .populate('categoria', 'description')
  .exec((err, productoBBDD) => {
    if (err) {
      return res.status(500).json({
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

/* Crear una producto */
app.post('/producto', verificaToken, (req, res) => {
  let body = req.body;
  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id
  });

  producto.save( (err, productoBBDD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!productoBBDD) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    return res.status(201).json({
      ok: true,
      producto: productoBBDD
    });
  });

});

/* Crear una producto */
app.put('/producto/:id', (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let data = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria
  }
  Producto.findByIdAndUpdate(id, data, {new: true, runValidators: true}, (err, productoBBDD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!productoBBDD) {
      return res.status(500).json({
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

/* Crear una producto */
app.delete('/producto/:id', [verificaToken], (req, res) => {
  let id = req.params.id;

  let data = {
    disponible: false
  }
  Producto.findByIdAndUpdate(id, data, {new: true, runValidators: true}, (err, productoBBDD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!productoBBDD) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      res: {
        mensaje: 'Producto dado de baja',
        producto: productoBBDD
      }
    });
  });
});


module.exports = app;