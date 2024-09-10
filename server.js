const app=require('./app');
const mongoose=require('mongoose');
// const dotenv=require('dotenv');
// dotenv.config({path:'./confg.env'});
require('dotenv').config()
process.on('uncaughtException',err =>{
  console.log('UNCAUGHT EXCEPTION shutting down ..');
  console.log(err.name ,err.message);
  process.exit(1);
})
const DB=process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB,{
  useNewUrlParser:true,
})
.then( ()=> console.log('SUCCESSFULLY'));

// const testTour=new Tour({
//   name:'The Park Camper',
//   price:997
// });
// testTour.save().then(doc=>{
//   console.log(doc);
// }).catch(err=>{
//   console.log('ERROR:',err)
// });
const port = process.env.PORT || 3000;
const server=app.listen(port, () => {
  console.log(`app is running on port ${port}....`);
});
process.on('unhandledRejection',err=> {
  console.log(err.name,err.message);
  console.log('UNHANDLED REJECTION! shutting down...');
  server.close(() =>{
    process.exit(1);
  })
});
process.on('uncaughtException')