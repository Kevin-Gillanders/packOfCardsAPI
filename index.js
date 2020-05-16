require('dotenv').config();
// const http = require('http');
const express = require('express');
const app = express();
const favicon = require('serve-favicon');
// const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const urljoin = require('url-join');
const mongoose = require('mongoose');
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
const deckRoutes = require('./api/routes/deckRoute');

// app.use(bodyParser.urlencoded({extended : false}));
// app.use(express.json());

app.use(favicon(path.join(__dirname , 'public', 'favicon.ico')));

app.use('/api/deck', deckRoutes);

app.set('views', 'views');
app.set('view engine', 'pug')


app.get("/accessDB", (req, res) => {

    const MongoClient = require('mongodb').MongoClient;
    // const client = new MongoClient(uri, { useNewUrlParser: true });
    mongoose.connect(process.env.connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    res.end();
});



/*
===========================================
Index
===========================================
*/
app.get('/', (req, res) => {
    res.render("demo/newDeckTest");
    res.send("cards");
});

app.get('/getDemo', (req, res)=>{
    var deckURL = urljoin(process.env.endpoint, "deck", "new");
    var config = {
        params: {
            shuffled:"false",
            aces: "true"
        }
    };
    console.log(`deckURL ${deckURL}`);
    axios.get(deckURL, config)
    .then(response =>{
        console.log(`json ${JSON.stringify(response.data)}`);
        res.json(response.data);
        res.end();
    })
    .catch(error =>{
        console.log(error);
        res.end();

    });
});


app.get('/shuffle', (req, res)=>{
    
    var bucket = [];
    var l = 10000
    for (var i=0;i<=l;i++) {
        bucket.push(i);
    }

    var pick =  () => 
    {
        var randomIndex = Math.floor(Math.random()*bucket.length);
        return bucket.splice(randomIndex, 1)[0];
    };

    // will pick a random number between 0 and 10, and can be called 10 times
    console.log("here");
    for (var i=0;i<=l;i++) {
        console.log(`${l}, ${pick()}`);
    }
    console.log("out");
    res.end();

});


app.use((req, res)=>{
    res.status(404);
    res.render("error", {url: req.originalUrl + ' not found'});
});


app.listen(port, () => {
    console.log(`Card api listening at http://localhost:${port}`);
});
