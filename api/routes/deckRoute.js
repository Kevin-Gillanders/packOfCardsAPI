var deck = require('../contollers/deckController');

var express = require('express'),
    router = express.Router();

router.route('/new')
    .get(deck.createANewDeck);

router.route('/shuffle')
    .get(deck.shuffle);


router.route('/draw')
    .get(deck.draw);

module.exports = router;