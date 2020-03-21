const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El campo nombre es obligatorio']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El campo email es obligatorio']
  },
  password: {
    type: String,
    required: [true, 'El campo password es obligatorio']
  },
  img: {
    type: Boolean,
    required: false
  }, // Boolean
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  }, // default: 'USER_ROLE
  estado: {
    type: Boolean,
    default: true, // si esta activo o no
    required: true
  },
  google: {
    type: Boolean, // se ha logeado con una cuenta de google
    default: false,
    required: true
  }
});

usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
}

usuarioSchema.plugin( uniqueValidator, {
  message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Usuario', usuarioSchema);