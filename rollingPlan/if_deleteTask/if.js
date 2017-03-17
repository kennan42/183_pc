var MEAP=require("meap");
var mongoose = require("mongoose");
var baseSchema = require("../rollingPlan.js");

function run(Param, Robot, Request, Response, IF)
{
    
     Response.setHeader("Content-type","text/json;charset=utf-8");
     var arg = JSON.parse(Param.body.toString());
     console.log("deleteTask--->");
    var db = mongoose.createConnection(global.mongodbURL);
    var taskModel = db.model("rollingPlan_task", baseSchema.taskSchema);
  
    var  taskId =arg.taskId;

    
      taskModel.remove({
        _id : taskId
    }, function(err) {
        db.close();
        if (!err) {
            Response.end(JSON.stringify({
                "status" : "0",
                "msg" : "delete ok"
            }));
        } else {
            Response.end(JSON.stringify({
                "status" : "-1",
                "msg" : "delete err"
            }));
        }

    });
    
  
}

exports.Runner = run;


                                

    

