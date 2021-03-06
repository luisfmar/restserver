require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// habilitar rutas
app.use( require('./routes/index') );

app.use( express.static( path.resolve(__dirname, '../public')));

mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
  if ( err ) throw err;
  console.log(`Base de datos conectada.`);
});


app.listen(process.env.PORT, () => {
  console.log(`Listening in port: ${process.env.PORT}`);
});