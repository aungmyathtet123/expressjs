class APIFeatures{
    constructor(query,queryString){
      this.query=query;
      this.queryString=queryString;
    }
    filter(){
      const queryObj={...this.queryString};
      const execludedFields=['page','sort','limit','fields'];
      execludedFields.forEach(el=>delete queryObj[el]);
      let queryStr=JSON.stringify(queryObj);
      queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`);
      this.query=this.query.find(JSON.parse(queryStr));
      return this;
    }
    sort(){
      if(this.queryString.sort){
        const sortBy=this.queryString.sort.split(',').join(' ');
        this.query=this.query.sort(sortBy);
      }else{
        //- is appear first
        this.query=this.query.sort('-createdAt');
      }
      return this;
    }
    limitFields(){
      if(this.queryString.fields){
        const fields=this.queryString.fields.split(',').join(' ');
        this.query=this.query.select(fields);
      }else{
        // - is excluding
        this.query=this.query.select('-v__v');
      }
      return this;
    }
    paginate(){
      const page=this.queryString.page*1 || 1;
      const limit=this.queryString.limit*1 || 100;
      const skip=(page-1)*limit;
      //page=3&limit=10,1-10,page 1,11-20,page 2,21-30,page 3
      // query=query.skip(20).limit(10);
      //for example skip is page 2 and limt 10 skip is 20 .if we skip 20 , page 3 result is start 30
      this.query=this.query.skip(skip).limit(limit);
      return this;
    }
  }
  module.exports=APIFeatures;