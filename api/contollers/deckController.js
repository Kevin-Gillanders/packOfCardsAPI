var mongoose = require('mongoose');
const Deck = require('../models/deckModel')
const Card = require('../models/cardModel')
var deckModel = mongoose.model('Deck');
var cardModel = mongoose.model('Card');

exports.createANewDeck = async (req, res) => 
{
    try{
        console.log('here in deck controller')
        console.log(`Params given ${JSON.stringify(req.query)}`);
        var deck = new Deck
        ({
            shuffled: (req.query.shuffled !== undefined ? (req.query.shuffled === 'true'): false),
            replacement: (req.query.replacement !== undefined ?  (req.query.replacement === 'true') : false),
            // suit: (req.query.suits !== undefined ? (parseInt(req.query.suits) ? req.query.suits : 4)  : 4),
            suit: (parseInt(req.query.suits) ? req.query.suits : 4) ,
            joker: (req.query.joker !== undefined ? (req.query.joker === 'true') : false),
            acesHigh: (req.query.aces !== undefined ? (req.query.aces  === 'true') : false),
            style: (req.query.style !== undefined ? req.query.style : "Standard")
        });
        
        // console.log(`Save me ${deck}`);

        var cards = await generateCards(deck);
        // deck.cards =  cards;
        for(var card of cards)
        {
            card.save();
        }
        deck.cards = cards;
        deck.cardsRemaining = cards.length;
        deck.save({}, (err, data) =>{
            if(err) 
            {
                console.log(err);
                throw err;
            }
            else{
                if(data.shuffled)
                {
                    console.log("shuffle data");
                    console.log(data._id);
                    shuffleDeck(data._id);
                }
            }
        });
        // console.log(`ID : ${JSON.stringify(deck._id)}`);
        // console.log(`Response : ${JSON.stringify(deck)}`);
        
        
        
        
        deck.discard = [];
        
        
        console.log(`Bye`);
        res.json(deck);
        
        
    }
    catch(error)
    {
        res.status(500);
        res.json({error:"Something went wrong"});
        console.log(error);
    }
    finally
    {
        res.end();
    }
}

async function generateCards(options)
{
    return new Promise((resolve, reject) =>{
        try
        {
            console.log("here in generation");
            // make this database calls or a central data store
            var suits = [
                            {code:"H", suit:"Heart"},
                            {code:"C", suit:"Club"}, 
                            {code:"D", suit:"Diamond"}, 
                            {code:"S", suit:"Spade"}
                        ];
            //Change these to objects
            var king  = {code :'K', name : "King"};
            var queen = {code :'Q', name : "Queen"};
            var jack  = {code :'J', name : "Jack"};
            var ace   = {code :'A', name : "Ace"};

            var aceValue   = (options.acesHigh ? 14 : 1);
            var kingValue  = 13;
            var queenValue = 12;
            var jackValue  = 11;

            var offset =  (options.acesHigh ? 1 : 0)
            var highestValue = 13 + offset;
            var lowestValue  = 1  + offset;

            var cards = [];

            for(let [idx, suit] of suits.entries())
            {
                for(var val = lowestValue; val <= highestValue; val++ )
                {
                    // console.log(`(${idx} * (${highestValue} - ${offset})) + (${val} - ${offset}) = ${(idx * (highestValue - offset)) + (val - offset)}`);
                    var cardDetails = new Card({
                        suit     : suit.suit,
                        value    : val,
                        deckID     : options._id,
                        position : (idx * (highestValue - offset)) + (val - offset)
                    });
                    switch(val)
                    {
                        case aceValue:
                            cardDetails.code = ace.code + suit.code;
                            cardDetails.name = ace.name;
                            break;
                        case kingValue:
                            cardDetails.code = king.code + suit.code;
                            cardDetails.name = king.name;
                            break;
                        case queenValue:
                            cardDetails.code = queen.code + suit.code;
                            cardDetails.name = queen.name;
                            break;
                        case jackValue:
                            cardDetails.code = jack.code + suit.code;
                            cardDetails.name = jack.name;
                            break;
                        default:
                            cardDetails.code = val.toString() + suit.code;
                            cardDetails.name = val.toString();
                            break;
                    }
                    cards.push(cardDetails);
                }
            }
            if(options.joker){
                var joker = {
                        suit  : "Joker",
                        value : 0,
                        deck  : res._id,
                        position : 0,
                        code: "Jo",
                        name: "Joker"
                };
                cards.push(joker);
                cards.push(joker);
            }
            // console.log(cards);
            resolve(cards);
        }
        catch(err)
        {
            reject(err);
        }
    });
}

async function shuffleDeck(deckID)
{
    return new Promise((resolve, reject) =>{
        try{
            // console.log("shuffle data");
            // console.log(deckID);
            cardModel.find({deckID : deckID, drawn:false}).sort( 'position').exec((err, cardssreturned) =>
            {
                if(err) 
                {
                    console.log(err);
                    reject(err)
                }
                // console.log(cardssreturned);
                // console.log(`before update`);
                // console.log(`This is the amount of cards ${cardssreturned.length}`);
                let positions = cardssreturned.map(x => x.position);
                // console.log(`Before The positions of the cards ${positions}`);
                positions = shuffleList(positions);
                // console.log(`After The positions of the cards ${positions}`);
                for(var idx = 0; idx < cardssreturned.length; idx++)
                {
                    let card = cardssreturned[idx];
                    let position = positions[idx];
                    cardModel.updateOne({_id:card._id}, {position: position}, (err, result) =>
                    {
                        if (err) {
                            res.send(err);
                        } else {
                            // console.log(result);
                        }
                    });
                    // console.log("during");
                }
                //TODO resolve a response success or the deck?
                // console.log("after");
                
                resolve(cardssreturned);
            });
        }
        catch(err)
        {
            reject(err);
        }
    });
}

async function setShuffled(deckID)
{
    return new Promise((resolve, reject) =>{
        deckModel.updateOne({_id:deckID}, {shuffled:true}, (err, result) =>
        {
            if (err) {
                console.log(err)
                reject(err);
            } else {
                deckModel.findById(deckID, (err, result) =>{
                    if(err) 
                        reject(err);
    
                    resolve(result);
                });
            }
        });
    });

}

function shuffleList(positions)
{
    // Fisher–Yates shuffle outlined here 
    // https://bost.ocks.org/mike/shuffle/
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    let currentIndex = positions.length, temporaryValue, randomIndex;

    while(currentIndex !== 0)
    {
        //Pick random element remaining
        randomIndex = Math.floor(Math.random() * currentIndex--);

        //Swap with current element
        temporaryValue = positions[randomIndex];
        positions[randomIndex] = positions[currentIndex];
        positions[currentIndex] = temporaryValue;

    }
    return positions;
}

async function getCard(deckID)
{
    console.log("Now thats what I call drawing...");
    return new Promise((resolve, reject) =>{
        // cardModel.findOneAndUpdate(
        //     {deckID : deckID, drawn:false},  //query
        //     {$set: { drawn: true } },  //update
        //     {sort: {position:1}, new:true, usefindandmodify: false}, //options
            
        //     (error, result) =>{
        //         if(error)
        //             reject(error);
        //         else
        //         {
        //             console.log(result);
        //             resolve(result);
        //         }
        //     });
        cardModel.findOneAndUpdate(
            {deckID : deckID, drawn:false},  //query
            {$set: { drawn: true } },  //update
            { select: "suit value name code position", sort: {position:1}, new:true, usefindandmodify: false}, //options
                
            (error, result) =>{
                if(error)
                    reject(error);
                else
                {
                    console.log(result);
                    resolve(result);
                }
            });
    }); 
}

exports.shuffle = async (req, res) =>
{
    console.log("Shuffling...");
    try 
    {
        let deckID = req.query.deckID;
        await shuffleDeck(deckID);
        let deck = await setShuffled(deckID);
        console.log("Deck here");
        console.log({"Deck" : deck});
        res.json({"Deck" : deck});
    }
    catch(err)
    { 
        throw err;
    }
    finally
    {
        res.end();
    }
}

exports.draw = async (req, res) =>
{
    console.log("Drawing...");
    try 
    {
        let deckID = req.query.deckID;

        let card = await getCard(deckID);
        console.log(`Card here ${card}`);
        //TODO add logic to get the deck and increment the drawn counts
        // let deck = await getDeck(deckID);
        console.log("Deck here");
        console.log({"Card" : card});
        res.json({"Card" : card});//, "Deck" : deck});
    }
    catch(err)
    { 
        throw err;
    }
    finally
    {
        res.end();
    }
}


