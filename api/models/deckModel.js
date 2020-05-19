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
    // cards: [{ type: Schema.Types.ObjectId, ref: 'Card'}]
});

module.exports = mongoose.model("Deck", deckSchema);