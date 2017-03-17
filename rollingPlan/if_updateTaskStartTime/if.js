var MEAP=require("meap");
var mongoose = require("mongoose");
var baseSchema = require("../rollingPlan.js");

function run(Param, Robot, Request, Response, IF)
{
    
     Response.setHeader("Content-type","text/json;charset=utf-8");
     var arg = JSON.parse(Param.body.toString());
     console.log("updateTaskStartTime--->");
    var db = mongoose.createConnection(global.mongodbURL);
    var taskModel = db.model("rollingPlan_task", baseSchema.taskSchema);
  
    var  taskId =arg.taskId;

    
      taskModel.update({
        _id : taskId
    }, {
        $set : {
            taskStartDate : arg.newTaskStartDate,
            updateTime:new Date().getTime()
        }
    }, function(err) {
        db.close();
        if (!err) {
            Response.end(JSON.stringify({
                "status" : "0",
                "msg" : "update ok"
            }));
        } else {
            Response.end(JSON.stringify({
                "status" : "-1",
                "msg" : "update err"
            }));
        }

    });
    
  
}

exports.Runner = run;


                                

    

