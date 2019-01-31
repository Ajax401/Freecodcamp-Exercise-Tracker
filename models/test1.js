
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const mySchema = new Schema ({
  _id:String,
  username: String,
  data: [{
	_id:false,  
    description : String,
    duration: Number,
    date :{type:Date}
  }]
});

const ExampleClass = mongoose.model('array',mySchema);

module.exports = ExampleClass;