const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const mySchema = new Schema({
  count:[Number],
  username:String,
  _id:String,
  description:String,
  duration:[Number],
  date:[Schema.Types.Mixed],
  description:[String] 
})

const ExampleClass = mongoose.model('array',mySchema);


module.exports = ExampleClass;

