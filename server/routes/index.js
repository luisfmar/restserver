const express = require('express');
const app = express();

const {appUpload} = require('./upload');

app.use( require('./usuario') );
app.use( require('./login') );
app.use( require('./categoria') );
app.use( require('./producto') );
app.use( appUpload );
app.use( require('./imagenes') );
module.exports = app;