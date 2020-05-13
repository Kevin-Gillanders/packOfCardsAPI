

exports.createANewDeck = (req, res) => 
{
    var options = 
    {
        shuffled: req.query.shuffled,
        replacement: req.query.replacement,
        suit: req.query.suits,
        joker: req.query.joker,
        acesHigh: req.query.aces
    };

    console.log('here in deck controller')
    console.log(`You have picked ${JSON.stringify(options)}`);

    res.json(options);
    res.end();

}

