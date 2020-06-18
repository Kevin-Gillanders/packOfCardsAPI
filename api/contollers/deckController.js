var mongoose = require('mongoose');

const Deck = require('../models/deckModel')
const Card = require('../models/cardModel')
const DeckSpec = require('../models/deckSpecificationModel')

var deckModel = mongoose.model('Deck');
var cardModel = mongoose.model('Card');
var deckSpecificationModel = mongoose.model('DeckSpecification')

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
            //TODO break this method down into different methods
            // Per suit - One for number cards and  and then seperate method for face cards
            // Another for special cards jokers and tarot
            console.log("here in generation");
            
            var deckStyle   = getDeckSpecification(options.style);

            // console.log(`Here is deckStyle ${deckStyle}`);
            
            var suits       = deckStyle.suits;
            var faceCards   = deckStyle.faceCards;
            var maxNumCards = deckStyle.maxNumber;
            var minNumCards = deckStyle.minNumber;
            var maxSuitSize = maxNumCards + faceCards.length;
            var offset      = (options.acesHigh ? 0 : 1)  
            //#region set face values put into own method
            for(var idx = 0; idx < faceCards.length; idx++)
            {
                var faceValue = maxNumCards + (idx + 1); 

                if(faceCards[idx].name.toLowerCase() == "ace")
                {
                    faceCards[idx].value = (options.acesHigh ? faceValue : 1);
                }
                else
                {
                    console.log(`face value ${faceValue}`);
                    faceCards[idx].value = faceValue;
                }
            }
            //#endregion

            console.log(`Min ${minNumCards}, max ${maxNumCards}`);
            var cards = [];
            let pos
            for(let [idx, suit] of suits.entries())
            {
                // console.log("Making pack...");
                // console.log(`suit ${suit.name}`);
                pos = (idx * maxSuitSize) + 1 + offset;
                let cardDetails;
                for(var val = minNumCards; val <= maxNumCards; val++ )
                {
                   
                    cardDetails = { code : val.toString() + suit.code,
                                    name : val.toString()};
                    // console.log(`here are carddeets ${cardDetails}`);
                    cardDetails =  generateCard(suit.name, val, options._id, pos, cardDetails);
                    pos++;
                    console.log(`Card made here ${cardDetails}`);
                    cards.push(cardDetails);
                }
                for(var faceCard of  faceCards)
                {
                    var facePos = pos;
                    cardDetails = { code : faceCard.code + suit.code,
                                    name : faceCard.name};
                    
                    if(cardDetails.name.toLowerCase() == "ace" && !options.acesHigh )
                        facePos = (idx * maxSuitSize) + 1;

                    cardDetails =  generateCard(suit.name, faceCard.value, options._id, facePos, cardDetails);
                    pos++;
                    console.log(`Face card made here ${cardDetails}`);
                    cards.push(cardDetails);
                }
            }
            if(options.joker){
                // var joker = generateCard("Joker", 0, res._id, 53, {code :"Jo", name : "Joker"})
                cards.push(generateCard("Joker", 0, options._id, pos, {code :"Jo", name : "Joker"}));
                pos++;
                cards.push(generateCard("Joker", 0, options._id, pos, {code :"Jo", name : "Joker"}));
                pos++;
            }
            console.log(cards);
            resolve(cards);
        }
        catch(err)
        {
            reject(err);
        }
    });
}

function getDeckSpecification(style)
{
    var testSpec = new DeckSpec
    ({
        style : style,
        suits : 
        [   
            {code:"H", name:"Heart"},
            {code:"C", name:"Club"}, 
            {code:"D", name:"Diamond"}, 
            {code:"S", name:"Spade"}
        ],
        maxNumber : 7,
        minNumber : 2,
        faceCards : 
        [
            {code :'J', name : "Jack"},
            {code :'Q', name : "Queen"},
            {code :'K', name : "King"},
            {code :'A', name : "Ace"}
        ], 
        specialCards:
        [
            {code :'Jo', name : "Joker", Amount: 2}
        ]
    });
    return testSpec;
}

 function generateCard(suit, val, deckID, pos, cardDetails)
{
    //TODO move this method to the card controller

    try
    {
        var card = new Card({
            suit      : suit,
            value     : val,
            deckID    : deckID,
            position  : pos,
            reversed  : Math.random() > .5,
            code      : cardDetails.code,
            name      : cardDetails.name
        });
        console.log(`This is what the card data is ${card}`);
        return(card);
    }
    catch(err)
    {
        console.log(err);
        throw(err)
    }
 
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
                setShuffled(deckID);
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
                resolve(result);
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

async function getNextCard(deckID)
{
    //TODO move this logic to a card controller
    console.log("Now thats what I call drawing...");
    return new Promise((resolve, reject) =>{
        // cardModel.findOneAndUpdate(
        //     {deckID : deckID, drawn:false},  //query
        //     {$set: { drawn: true } },  //update
        //     {sort: {position:1}, new: true, useFindAndModify: false}, //options
            
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
            { select: "suit value name code position", sort: {position:1}, new: true, useFindAndModify: false}, //options
                
            (error, result) =>{
                if(error)
                    reject(error);
                else
                {
                    if(result)
                    {
                        deckModel.updateOne(
                            {_id : deckID},
                            {$inc : {cardsRemaining: -1, cardsDrawn: 1} },
                            {new: true, useFindAndModify: false},
                            (error, deck) => {
                                if(error) 
                                    reject(error);
                                else 
                                    console.log(`deck counts changed ${deck}`);
                        });
                    }
                    console.log(result);
                    resolve(result);
                }
            });
    }); 
}

async function getDeck(deckID)
{
    return new Promise((resolve, reject) =>
    {
        deckModel.findById(
            deckID,
            (error, deck) => {
                if(error) 
                    reject(error);
                else 
                    resolve(deck);
            });
    });

}



async function drawFromDeck(deckID)
{
    let card = await getNextCard(deckID);
    console.log(`Card here ${card}`);

    let deck = await getDeck(deckID);
    console.log("Deck here");
    console.log({"Card" : card, "Deck" : deck});
    return {"Card" : card, "Deck" : deck};
}

exports.shuffle = async (req, res) =>
{
    console.log("Shuffling...");
    try 
    {
        let deckID = req.query.deckID;
        await shuffleDeck(deckID);
        let deck = await getDeck(deckID);
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
        let draw = await drawFromDeck(deckID);

        res.json(draw);//, "Deck" : deck});
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


