const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
  description:{
    type: String,
    unique: true,
    require: [true, 'El campo descripcion es obligatorio']
  },
  usuario:{
    type: Schema.Types.ObjectId, ref: 'Usuario'
  }
});

module.exports = mongoose.model('Categoria', categoriaSchema);