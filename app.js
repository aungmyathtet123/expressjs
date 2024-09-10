const express = require("express");
const app = express();
const morgan=require('morgan');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss= require('xss-clean');
const hpp=require('hpp');

const AppError=require('./utils/appError');
const globalErrorHandler=require('./controllers/errorController');
const tourRouter=require('./routes/tourRoutes');
const userRouter=require('./routes/userRoutes');
const reviewRouter=require('./routes/reviewRoutes');

//global middleware
// console.log(process.env.NODE_ENV);

//set security HTTP headers
app.use(helmet());

//dEVELOPMENT LOGGING
if(process.env.NODE_ENV=='development'){
    app.use(morgan('dev'));
}

//prevent bruteforce attack and limit request from same API
const limiter=rateLimit({
    max:100,
    windowMs:60 *60*1000,
    message:'Too Many requests from this IP, please try agian in an hour!'
});
app.use('/api',limiter);

//Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));

//data sanitization against NoSql query injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

//prevent parameter pollution forexample sort=duraiton&sort=price..sort=['duration','price']. got error
app.use(hpp({
    whitelist:[
        'duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price'
    ]
}));

//serving static files
app.use((req,res,next)=>{
    console.log('hello from the middleware');
    next();
});

//Test middleware
app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    next();
})
// app.get('/',(req,res)=>{
//     res.status(200)
//     .json({message :'hello from server side', app:'Natours'});
// });
// app.post('/',(req,res)=>{
//     res.send('you can post to this endpoist..');
// })

//?optional
// app.get("/api/v1/tours", getAllTour);
// app.get("/api/v1/tours/:id/:text?", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);


app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);
//neither tourRouter or userRouter error handling
app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:'fail',
    //     message:`Can't find ${req.originalUrl} on this server!`
    // });
    // const err=new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status='fail';
    // err.statusCode=404;
    // next(err);
    next(new AppError(`Can't find ${req.originalUrl}on this server!`, 404));
});

// app.use((err,req,res,next)=>{
//     // console.log(err.stack);
//     err.statusCode=err.statusCode || 500;
//     err.status=err.status || 'error';
//     res.status(err.statusCode).json({
//         status:err.status,
//         message:err.message
//     });
// });
app.use(globalErrorHandler);
module.exports=app;
