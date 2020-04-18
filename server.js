const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({path:'./Secret/.env/'});
const Schema = mongoose.Schema;

const shortid = require('shortid');
const moment = require('moment');
moment().format();

mongoose.connect(process.env.MONGO_URI||'mongodb://localhost/arrays',{ useNewUrlParser: true },(err) =>{
    if (err) throw "Erorr connecting to database" + err;
});

const array = require('./models/test1.js');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/',express.static('public'));

app.post('/api/exercise/new-user',(req, res)=>{
	  let myTest = req.body.user.myName;
	  let testing = /^[a-zA-Z\s]*$/
	  if(testing.test(myTest) === true && myTest !== ""){
		 
        array.find({username:req.body.user.myName})	
       .then(user => {
		if (user.length !== 0) {
			return res.send({error:"Name already exists in database"});
        } 
		if(user.length === 0){
			
			myId = shortid.generate();
			let data = new array({
				
		        username:req.body.user.myName,
				_id:myId,
	            })
				
			data.save(user,err=>{			
		if(err) throw err;
		return res.send({
			   username:req.body.user.myName,
		       _id:myId
	                });
	
	});
	
		}

    }).catch(err => {
 
         if(err) throw err;
  
    });
	  }else{
		res.send({username:"Invalid name! Please enter a string of letters for name."})  
	  }
	
});


app.post('/api/exercise/add',(req,res)=>{
	let myTest = req.body.user.userTask;
	const testing = /^[a-zA-Z\s]*$/
	const myNum =  /^\d+$/;
	let checkDate;
	const checker = /^[0-9-]*$/
	let checking = req.body.user.userDuration;
	
	array.countDocuments({_id:req.body.user.userId},(err, count)=>{
	if(count>0){
		if(testing.test(myTest) === true && myTest !== ""){
			if(myNum.test(checking)=== true){
				let inPutDate;
		        let timestamp;
		        let d;
			 if(Object.keys(req.body.user.userDate).length === 0){
				 let date1 = Date.now();
		         date1 = new Date(date1);
                 date1.setUTCHours(0,0,0,0);
				array.findOneAndUpdate({_id:req.body.user.userId},{ $push :{data:{ description : req.body.user.userTask, duration :Number(req.body.user.userDuration),date:date1}}},{new:true}).then((data)=>{
				   date1 = new Date(date1).toDateString();
				   console.log(data)
				   res.send({ 
		           username:data.username,
		           date:date1,
		           description:req.body.user.userTask,
			       duration:Number(req.body.user.userDuration),
			       _id:req.body.user.userId
				   })
				}).catch(err => {
 
         if(err) throw err;
  
    });	
			 }else{
				 timestamp = new Date(req.body.user.userDate);
				 d = moment(timestamp).format("YYYY-MM-DDT00:00:00.000") + "Z";
				 inPutDate = new Date(d);
				 let checking = d;
				 console.log(inPutDate)
				 console.log(typeof(inPutDate))
				 checkDate = moment(inPutDate);
				 if(checkDate.isValid() === true){
					  
		  array.findOneAndUpdate({_id:req.body.user.userId},{ $push :{data:{ description : req.body.user.userTask, duration :Number(req.body.user.userDuration),date:inPutDate}}},{new:true}).then((data)=>{
				   inPutDate = new Date(inPutDate).toDateString();
				   console.log(data)
				   res.send({ 
		           username:data.username,
		           date:inPutDate,
		           description:req.body.user.userTask,
			       duration:Number(req.body.user.userDuration),
			       _id:req.body.user.userId
				   })
				}).catch(err => {
 
         if(err) throw err;
        
    });	
		  
			 }else{
					 res.send({error:"Invalid date Format. Please use following types 2019-01-01 , 1 January 2019 or 2019/01/01"})
			 }  
		  
			 }
				}else{
		res.send({duration:"Please type a number value"})
	}	
			}else{
		res.send({description:"Invalid description! Please enter a string of letters for description."})  
	  }
		}else{
			  res.send({_id:"Please type correct id from datbase"})
		  }
	}); 	
})

app.get('/api/exercise/users',(req, res)=>{
    array.find({},'id username',(err, docs) =>{
	   res.send(docs);
    });
});

app.get('/api/exercise/log',(req,res)=>{
	let myLength;
	array.countDocuments({_id:req.query.id},(err, count,data)=>{
	if(count>0){
	array.findById({_id:req.query.id},(err,data)=>{	 

let iniate = new Date(req.query.start);
				 let one = moment(iniate).format("YYYY-MM-DDT00:00:00.000") + "Z";
				 let date1 = new Date(one);
				 console.log(date1);
				 console.log(typeof(date1));
	let iniate1 = new Date(req.query.end);
				 let two = moment(iniate1).format("YYYY-MM-DDT00:00:00.000") + "Z";
				 let date2 = new Date(two);
				 console.log(date2)
				 console.log(typeof(date2))	
  let myLength;
  if(req.query.start === undefined && req.query.end === undefined && req.query.limit === undefined && req.query.id !== undefined){
		 myLength = data.data.length;
		 
		array.aggregate([
    { $match: {_id: req.query.id}}]).then(data =>{
        res.send({count:myLength,data})
		
	})
	
	  } else if(req.query.start !== undefined && req.query.end !== undefined && req.query.limit !== undefined && req.query.id !== undefined){
	  array.aggregate([
    { $match: {_id: req.query.id}},
    { $unwind: '$data'},{$match : {"$and" :  [{"data.date" :{"$gte" : date1} },
    {"data.date" :{"$lte" : date2}}]}}]).limit(Number(req.query.limit)).then(data =>{
		if(data.length >= Number(req.query.limit)){
		res.send(data)
		}else{
		return  res.send({error:"Document did not match limit requested"})
	  }
	})
	  }

})
	}else{
			  res.send({_id:"Please type correct id from datbase"})
		  }
	})


})

app.use('*',(req, res, next)=> {
	 res.status(404);
     res.sendFile(__dirname + '/public/404.html');
  });
  
app.use((err, req, res, next)=> {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port,function(){
    console.log('I am working fine!');
})

