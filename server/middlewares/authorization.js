const jwt = require('jsonwebtoken');

/* Verifacion del token */

let verificaToken = (req, res, next) => {

  let token = req.get('token'); // Token
  jwt.verify(token, process.env.SEED_TOKEN, (err, decode) => {
    if(err) {
      return res.status(401).json({
        ok:false,
        err: {
          message: 'Invalid token'
        }
      });
    }
    req.usuario = decode.usuario;
    next();
  });
}

/* Verifacion ADMIN role */

let verificaAdminRole = (req, res, next) => {
  console.log(req.usuario);
  let usuario = req.usuario
  if (usuario.role === 'ADMIN_ROLE'){
    next();
  } else {
    res.json({
      ok: false,
      err: {
        message: 'El usuario no es administrador'
      }
    });
  }
}


module.exports = {
  verificaToken,
  verificaAdminRole
}