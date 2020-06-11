var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var cardSchema = new Schema({
    deckID:      {type: Schema.Types.ObjectId, required:"A card needs to be associated with a deck", ref: 'Deck'},
    suit:        {type: String, required:"A card requires a suit"},
    value:       {type: Number},
    name:        {type: String, required:"A card needs a name"},
    code:        {type: String, required:"A card requires a code"},
    position:    {type: Number, required:"A card requires a position"},
    drawn:       {type: Boolean, default:false},
    reversed:    {type: Boolean, required: "Reversed must be specified"}
});


module.exports = mongoose.model("Card", cardSchema);
