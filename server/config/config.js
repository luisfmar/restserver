
/* PUERTO */
process.env.PORT = process.env.PORT || 3000;

/* ENTORNO */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = process.env.MONGO_URI;
}

/* URL DE MONGO*/
process.env.urlDB = urlDB;

/* TOKEN: FECHA DE EXPIRACION
*
* 60 seg
* 60 min
* 24 horas
* 30 días
*
* */

process.env.CADUCIDAD_TOKEN = '24h';

/* TOKEN: SEED DE AUTENTIFICACION*/

process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'secret';

/* GOOGLE CLIENT*/

process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'XXXXXXXX';