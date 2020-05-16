

exports.createANewDeck = async (req, res) => 
{
    try{
        console.log('here in deck controller')
        console.log(`Params given ${JSON.stringify(req.query)}`);
        var response = 
        {
            shuffled: (req.query.shuffled !== undefined ? (req.query.shuffled === 'true'): false),
            replacement: (req.query.replacement !== undefined ?  (req.query.replacement === 'true') : false),
            // suit: (req.query.suits !== undefined ? (parseInt(req.query.suits) ? req.query.suits : 4)  : 4),
            suit: (parseInt(req.query.suits) ? req.query.suits : 4) ,
            joker: (req.query.joker !== undefined ? (req.query.joker === 'true') : false),
            acesHigh: (req.query.aces !== undefined ? (req.query.aces  === 'true') : false),
            style: (req.query.style !== undefined ? req.query.style : "Standard")
        };
        
        var cards = await generateDeck(response);
        response.cards =  cards;
        
        
        //Write to database at this stage
        response.deckID = 'temp';
        if(response.shuffled)
        {
            console.log("shuffling, implement me");
        }

        response.discard = [];
        response.remaining = cards.length;
        console.log(`You have picked ${JSON.stringify(response)}`);
        
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

async function generateDeck(options)
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
            var king  = 'K';
            var queen = 'Q';
            var jack  = 'J';
            var ace   = 'A';

            var aceValue   = (options.acesHigh ? 14 : 1);
            var kingValue  = 13;
            var queenValue = 12;
            var jackValue  = 11;

            var highestValue = (options.acesHigh ? 14 : 13);
            var lowestValue  = (options.acesHigh ? 2  : 1);

            var cards = [];

            for(let suit of suits)
            {
                for(var val = lowestValue; val <= highestValue; val++ )
                {
                    var cardDetails = {
                        value : val,
                        suit  : suit.suit
                    };
                    switch(val)
                    {
                        case aceValue:
                            cardDetails.code = ace + suit.code;
                            break;
                        case kingValue:
                            cardDetails.code = king + suit.code;
                            break;
                        case queenValue:
                            cardDetails.code = queen + suit.code;
                            break;
                        case jackValue:
                            cardDetails.code = jack + suit.code;
                            break;
                        default:
                            cardDetails.code = val.toString() + suit.code;
                            break;
                    }
                    cards.push(cardDetails);
                }
            }
            if(options.joker){
                var joker = {
                    value : 0,
                    suit  : "Joker",
                    cardDetails: "Joker"
                };
                cards.push(joker);
                cards.push(joker);
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

async function shuffleDeck(deckID)
{

}
