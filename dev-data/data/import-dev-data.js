const mongoose=require('mongoose');
const fs=require('fs');
const { Console } = require('console');
const Tour=require('./../../models/tourModel');
const Review=require('./../../models/reviewModel');
const User=require('./../../models/userModel');

// const dotenv=require('dotenv');
// dotenv.config({path:'./confg.env'});
require('dotenv').config()
const DB=process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB,{
  useNewUrlParser:true,
}).then( ()=> console.log('SUCCESSFULLY'));
//read json file
const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
const users=JSON.parse(fs.readFileSync(`${__dirname}/user.json`,'utf-8'));
const reviews=JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));

//import data into db
const importData=async ()=>{
    try{
        await Tour.create(tours);
        await User.create(users ,{validateBeforeSave:false});
        await Review.create(reviews);
        process.exit();
        Console.log('data succ');
    }catch(err){
        console.log(err);
    }
}
//delte all dta from db
const deleteData=async()=>{
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        process.exit();
    }catch(err){
        console.log(err)
    }
}
if(process.argv[2] ==='--import'){
    importData()
}else if(process.argv[2] ==='--delete'){
    deleteData();
}