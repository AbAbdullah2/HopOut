const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HelloSchema = new Schema({
  text: {
    type: String,
    required: [true, 'Text is required'],
  },
});

const Hello = mongoose.model('hello', HelloSchema);

module.exports = Hello;