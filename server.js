
const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({path:'./Secret/.env/'});
const Schema = mongoose.Schema;

const shortid = require('shortid');


mongoose.connect(process.env.MONGO_URI||'mongodb://localhost/arrays',{ useNewUrlParser: true },(err) =>{
    if (err) throw "Erorr connecting to database" + err;
});

const array = require('./models/test1.js');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/',express.static('public'));

		
app.post('/api/exercise/new-user', function(req, res){
	  let myTest = req.body.user.myName;
	  let testing = /^[a-zA-Z\s]*$/
	  if(testing.test(myTest) === true){
		 
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
	const space = /^\s+$/;
	const checker = /^[0-9-]*$/
	let checking = req.body.user.userDuration;
	let dateTrue = req.body.user.userDate;
	array.countDocuments({_id:req.body.user.userId},(err, count)=>{
	
	if(count>0){	
	if(testing.test(myTest) === true&&myTest !== ""){
	if(myNum.test(checking)=== true){
	
	array.findOneAndUpdate({_id:req.body.user.userId},{ $push :{ description : req.body.user.userTask,   duration :req.body.user.userDuration}},{upsert:true}).then((data)=>{
	    let date = new Date().toString();
		  if(Object.keys(req.body.user.userDate).length === 0){
			  
		res.send({ 
		           username:data.username,
		           date:date.substr(0,16),
		           description:req.body.user.userTask,
			       duration:req.body.user.userDuration,
			       _id:req.body.user.userId,})
	    }else{
		 res.send({
			        username:data.username,
		            date:req.body.user.userDate,
		            description:req.body.user.userTask,
					duration:req.body.user.userDuration,
					_id:data._id,
					
		            });
	}
		 	
	}).catch(err => {
 
         if(err) throw err;
  
    });
	
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
   array.findById({_id:req.query.id},(err,data)=>{
	  array.find( 
  {date: {$gte: new Date(req.query.start), $lt: new Date(req.query.end)}})
  }).limit(req.query.limit).then(data =>{
	  let items; 	  
	  let myLength = data.description.length;
	  let item = data.description
	  let time = data.duration;
	  let timeperiod;
	  if(item.length > req.query.limit && time.length > req.query.limit&& myLength !== req.query.limit){
	  items = item.slice(0,req.query.limit);
      timeperiod = 	time.slice(0,req.query.limit); 
      myLength = Number(req.query.limit);	  
	  }else{
		return  res.send({error:"Document do not match limit requested"})
	  }
	 res.send(
	         {
		       count:myLength,
		       username:data.username,
			   _id:data._id,
			   data:[
                {   
                 description:items,
                 duration:timeperiod,
                 dateSearchStarted:req.query.start,
				 dateSearchEnded:req.query.end
                 }
				     ]
	           }
			  ); 
  }).catch(err =>{
	  if(err)throw err;
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
	
//https://devcenter.heroku.com/changelog-items/1530