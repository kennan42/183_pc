var MEAP=require("meap");
var mongoose = require("mongoose");
var baseSchema = require("../rollingPlan.js");

function run(Param, Robot, Request, Response, IF)
{
    
     Response.setHeader("Content-type","text/json;charset=utf-8");
     var arg = JSON.parse(Param.body.toString());
     console.log("deleteUser--->");
    var db = mongoose.createConnection(global.mongodbURL);
    var userModel = db.model("rollingPlan_user", baseSchema.UserSchema);
  
    var  userId =arg.userId;

    
      userModel.remove({
        userId : userId
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


                                

    

