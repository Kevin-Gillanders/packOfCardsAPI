// require('dotenv').config();
// const http = require('http');
const express = require('express');
const app = express();
const favicon = require('serve-favicon');
// const bodyParser = require('body-parser');
const path = require('path');


const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

const deckRoutes = require('./api/routes/deckRoute');

// app.use(bodyParser.urlencoded({extended : false}));
// app.use(express.json());

app.use(favicon(path.join(__dirname , 'public', 'favicon.ico')));

app.use('/api/deck', deckRoutes);

app.set('views', 'views');
app.set('view engine', 'pug')




/*
===========================================
Index
===========================================
*/
app.get('/', (req, res) => {
    res.render("demo/newDeckTest");
    res.end();
    // res.send("cards");
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





app.listen(port, () => {
    console.log(`Card api listening at http://localhost:${port}`);
});
