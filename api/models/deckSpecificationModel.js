var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var deckSpecificationSchema = new Schema({
    style : {type:String, required:"Deck must have unique name", unique : true},
    suits  : {type:Array, required:"Suit list must be specified"},
    maxNumber : {type:Number, required:true},
    minNumber : {type:Number, required:true},
    faceCards : {type:Array, required:"Face card list must be specified"}, 
    specialCards:{type:Array, required:"Special cards must be specified"}
});

module.exports = mongoose.model("DeckSpecification", deckSpecificationSchema);