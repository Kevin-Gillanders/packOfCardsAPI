var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var deckSchema = new Schema({
    shuffled: {type : Boolean, required: "Shuffled cannot be null"},
    replacement: {type : Boolean, required: "Replacement cannot be null"},
    suit: {type : Number, required: "Suits cannot be null"} ,
    joker: {type : Boolean , required: "Joker cannot be null"},
    acesHigh: {type : Boolean, required: "Aces high cannot be null"},
    style: {type : String, required: "Style cannot be null"},
    dateCreated: {type: Date, default: Date.now},
    cardsRemaining: {type: Number, required: "Cards remaining cannot be null"},
    cardsDrawn: {type: Number, required: "Cards drawn cannot be null", default: 0}
});

module.exports = mongoose.model("Deck", deckSchema);