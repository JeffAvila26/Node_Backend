'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

console.log(schema)

var animalSchema = schema({
	name: String,
	description: String,
	year: Number,
	image: String,
	user: { type: schema.ObjectId, ref: 'userReq'}
});

module.exports = mongoose.model('Animal', animalSchema);