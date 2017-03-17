var MEAP=require("meap");
var mongoose = require("mongoose");
var baseSchema = require("../rollingPlan.js");

function run(Param, Robot, Request, Response, IF)
{
    
     Response.setHeader("Content-type","text/json;charset=utf-8");
     var arg = JSON.parse(Param.body.toString());
     console.log("getAllTask--->");
    var db = mongoose.createConnection(global.mongodbURL);
    var taskModel = db.model("rollingPlan_task", baseSchema.taskSchema);
    var  userId =arg.userId;
    taskModel.find().exec(function(err,data){
         db.close;
          Response.setHeader("Content-type","text/json;charset=utf-8");
          if(!err){
             
              Response.end(JSON.stringify({
                status:0,
                msg:"查询成功",
                data:data
            }));
         }else{
             Response.end(JSON.stringify(
                 {
                     status:-1,
                     msg:"查询失败"
                     
                 }
             ));
             
         }
    });      
         
    
}

exports.Runner = run;


                                

    

