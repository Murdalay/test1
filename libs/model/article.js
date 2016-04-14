var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Article = new Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	description: { type: String, required: true },
	modified: { type: Date, default: Date.now }
});

Article.path('title').validate(function (v) {
	return v && v.length > 5 && v.length < 70;
});

module.exports = mongoose.model('Article', Article);