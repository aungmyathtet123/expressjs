const mongoose=require('mongoose');
const slugify=require('slugify');
const validator=require('validator');
const Review = require('./reviewModel');
const User=require('./userModel');
const tourSchema=new mongoose.Schema({
    name:{
      type:String,
      required:[true,'A tour must have a name'],
      unique:true,
      maxlength:[40,'A tour must have less than or equal then 40 characters'],
      minlength:[10,'A tour must have more than or equal then 10 characters'],
      //use validator plugin
      // validate:[validator.isAlpha,'Tour must only contain chatracter']
    },
    slug:String,
    duration:{
      type:Number,
      required:[true ,'A tour must have a duration']
    },
    maxGroupSize:{
      type:Number,
      required:[true,'A tour must have a group size']
    },
    difficulty:{
      type:String,
      required:[true,'A tour must have a difficulty'],
      enum:{
        values:['easy','medium','difficult'],
        message:'Difficulty is either:easy, medium ,difficult'
      }
    },
    ratingsAverage:{
      type:Number,
      default:4.5,
      min:[1,'Rating must be above 1.0'],
      max:[5,'Rating must be below 5.0'],
    },
    ratingsQuantity:{
      type:Number,
      default:0
    },
    price:{
      type:Number,
      required:[true,'A tour must have a price']
    },
    priceDiscount:{
      type:Number,
      //custom validation
      validate:{
      validator:function(val){
        //this only points to current doc on New document creation
        return val< this.price;
      },
      message:'Discount price({VALUE}) should be below regular price'
    }
    },
    summary:{
      type:String,
      trim:true,
      required:[true,'A tour must have a description']
    },
    description:{
      type:String,
      trim:true
    },
    imageCover:{
      type:String,
      required:[true,'A tour must have a cover image']
    },
    images:[String],
    createdAt:{
      type:Date,
      default:Date.now(),
      //hide from result
      select:false
    },
    startDates:[Date],
    secretTour:{
      type:Boolean,
      default:false
    },
    startLocation:[
    {
      //GeoJSON
      type:{
        type:String,
        default:'Point',
        enum:['Point']
      },
      //number must be array value
      coordinates:[Number],
      address:String,
      description:String,
      day:Number
    }
  ],
  guides:[
    {
      type:mongoose.Schema.ObjectId,
      ref:'User'
    }
  ]
  },{
    toJSON:{ virtuals:true },
    toObject:{ virtuals:true }
  }); 
  //virtual propertises are basicaly fileds that we can define on our schema but will not presist.
  //for example if you need mile to kilmeter change save db you can use virtual
  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
  })

  //virtual populate
// same like this
  // reviews:[
  //   {
  //     type:mongoose.Schema.ObjectId,
  //     ref:'Review'
  //   }
  // ]
  tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
  });
  //document middlewate runs before .save() and .create()
  tourSchema.pre('save',function(next){
   this.slug=slugify(this.name,{lower:true});
   next()
  });

  tourSchema.pre('save',async function(next){
    const guidesPromises=this.guides.map(async id=>await User.findById(id));
    this.guides=await Promise.all(guidesPromises);
    next();
  })
  // tourSchema.pre('save',function(next){
  //   console.log('will save document');
  //   next();
  // })
  // tourSchema.post('save',function(doc,next){
  //   console.log(doc);
  //   next();
  // })
  //qUERY MIDDLEWARE not working current doc . working current query
  ///^findone or findOneAndDelete startwith find
  tourSchema.pre(/^find/,function(next){
    this.find({ secretTour:{$ne:true}});
    this.start=Date.now();
    next();
  })

  tourSchema.pre(/^find/,function(next){
    this.populate({
      path:'guides',
      select:'-_v -passwordChangedAt'
    });
  });
  // this requry run after execute so douc return
  tourSchema.post(/^find/,function(docs,next){
  console.log(`Query took ${Date.now()- this.start} milliseconds!`);
  console.log(docs);
  next();
  })
  //aggregation middleware
  tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match :{secretTour:{$ne:true}}});
    console.log(this.pipeline());
    next();
  })
  const Tour=mongoose.model('Tour',tourSchema);
  module.exports=Tour;