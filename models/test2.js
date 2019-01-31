const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
	//_id:false,
	description : String,
    duration: Number,
    date :{type:Date}
})

const  dataClass = mongoose.model('data',dataSchema);

module.exports = dataClass;