

exports.createANewDeck = async (req, res) => 
{
    console.log('here in deck controller')
    console.log(`Params given ${JSON.stringify(req.query)}`);
    var options = 
    {
        shuffled: (req.query.shuffled !== undefined ? (req.query.shuffled === 'true'): false),
        replacement: (req.query.replacement !== undefined ?  (req.query.replacement === 'true') : false),
        // suit: (req.query.suits !== undefined ? (parseInt(req.query.suits) ? req.query.suits : 4)  : 4),
        suit: (parseInt(req.query.suits) ? req.query.suits : 4) ,
        joker: (req.query.joker !== undefined ? (req.query.joker === 'true') : false),
        acesHigh: (req.query.aces !== undefined ? (req.query.aces  === 'true') : false)
    };

    options.cards = await generateDeck(options);
    // console.log(`cards ${cards}`);
    console.log(`You have picked ${JSON.stringify(options)}`);

    res.json(options);
    // res.end();

}

async function generateDeck(options)
{
    return new Promise((resolve, reject) =>{
        try
        {
            console.log("here in generation");
            // make this database calls or a central data store
            var suits = ["S", "D", "C", "H"];
           
            var king = 13;
            var queen = 12;
            var jack = 11;
            var ace = (options.acesHigh ? 14 : 1);
            

            var cards = [];
            
            console.log(cards);
            resolve(cards);
        }
        catch(err)
        {
            reject(err);
        }
    });
}

