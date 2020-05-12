// require('dotenv').config();
const http = require('http');
const express = require('express');
const app = express();
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const path = require('path');


const hostname = '127.0.0.1';
const port = 3000;

// app.use(bodyParser.urlencoded({extended : false}));
// app.use(express.json());

app.use(favicon(path.join(__dirname , 'public', 'favicon.ico')));

app.set('views', 'views');
app.set('view engine', 'pug')




/*
===========================================
Index
===========================================
*/
app.get('/', (req, res) => {
    res.send("cards");
});






app.listen(port, () => {
    console.log(`Card api listening at http://localhost:${port}`);
});
