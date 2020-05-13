var deck = require('../contollers/deckController');

var express = require('express'),
    router = express.Router();

router.route('/new')
    .get(deck.createANewDeck);


module.exports = router;