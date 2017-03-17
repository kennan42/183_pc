var MEAP=require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../meetSchema.js");
var async = require("async");

function run(Param, Robot, Request, Response, IF)
{
    try{
     var arg=JSON.parse(Param.body.toString());
     var db=mongoose.createConnection(global.mongodbURL);
     var MeetBookModel=db.model("meetBook",sm.MeetBookSchema);
     var query = {"userId":arg.userId};
     query.state = {"$in":[3,4,5,6,7]};
     if(arg.name != ''){
         var reg = new RegExp(arg.name);
         query.name = reg;
     }
     if(arg.startTime != ''){
         query.startTime = {"$lte":parseInt(arg.endTime)};
     }
     if(arg.endTime != ''){
         query.endTime = {"$gte":parseInt(arg.startTime)};
     }
     var pageNumber = parseInt(arg.pageNum);
     var pageSize = parseInt(arg.pageSize);
     var skip = (pageNumber - 1) * pageSize;
     Response.setHeader("Content-type","text/json;charset=utf-8");
     async.parallel([
         function(callback){
             MeetBookModel.count(query,function(err,count){
                 callback(err,count);
             });
         },
         function(callback){
             MeetBookModel.find(query).skip(skip).limit(pageSize).sort({startTime:-1}).exec(function(err,doc){
                  callback(err,doc);

             });
         }
     ],function(err,rs){
         db.close();
         if(!err){
             Response.end(JSON.stringify({
                 status:"0",
                 msg:"查询成功",
                 data:rs[1],
                 count:rs[0]
             }));
         }else{
             Response.end(JSON.stringify({
                 status:"-1",
                 msg:"查询失败"
             }));
         }
     });
    }catch(e){
        Response.end(JSON.stringify({
            status:'-1',
            msg:'查询失败'
        }));
    }
}



exports.Runner = run;


                                
 
    

