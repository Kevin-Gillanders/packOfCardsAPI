var deck = require('../contollers/deckController');

var express = require('express'),
    router = express.Router();

router.route('/new')
    .get(deck.createANewDeck);

router.route('/shuffle')
    .get(deck.shuffle);


module.exports = router;