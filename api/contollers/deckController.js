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
        var response = new Deck
        ({
            shuffled: (req.query.shuffled !== undefined ? (req.query.shuffled === 'true'): false),
            replacement: (req.query.replacement !== undefined ?  (req.query.replacement === 'true') : false),
            // suit: (req.query.suits !== undefined ? (parseInt(req.query.suits) ? req.query.suits : 4)  : 4),
            suit: (parseInt(req.query.suits) ? req.query.suits : 4) ,
            joker: (req.query.joker !== undefined ? (req.query.joker === 'true') : false),
            acesHigh: (req.query.aces !== undefined ? (req.query.aces  === 'true') : false),
            style: (req.query.style !== undefined ? req.query.style : "Standard")
        });
        
        // console.log(`Save me ${response}`);

        var cards = await generateCards(response);
        // response.cards =  cards;
        for(var card of cards)
        {
            card.save();
        }
        response.cards = cards;
        response.save({}, (err, data) =>{
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
        // console.log(`ID : ${JSON.stringify(response._id)}`);
        // console.log(`Response : ${JSON.stringify(response)}`);
        
        
        
        
        response.discard = [];
        response.remaining = cards.length;
        
        
        console.log(`Bye`);
        res.json(response);
        
        
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
                            {code:"S", suit:"Spade"},
                            {code:"D", suit:"Diamond"}, 
                            {code:"C", suit:"Club"}, 
                            {code:"H", suit:"Heart"}
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
            console.log("shuffle data");
            console.log(deckID);
            cardModel.find({deckID : deckID, value: 5}).sort( 'position').exec((err, cardssreturned) =>
            {
                if(err) 
                {
                    console.log(err);
                    reject(err)
                }
                console.log(cardssreturned);
                console.log(`before update`);
                for(var card of cardssreturned)
                {
                    cardModel.updateOne({_id:card._id}, {position: 100}, (err, result) =>
                    {
                        if (err) {
                            res.send(err);
                        } else {
                            console.log(result);
                        }
                    });
                    console.log("during");
                }
                console.log("after");
                resolve(cardssreturned);
            });
        }
        catch(err)
        {
            reject(err);
        }
    });
}

exports.shuffle = async (req, res) =>
{
    var deckID = req.deckID;
    await shuffleDeck(deckID);
}
