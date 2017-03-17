var MEAP=require("meap");
var mongoose = require("mongoose");
var MeetSchema = require("../meetSchema.js");

function run(Param, Robot, Request, Response, IF)
{
     var arg = JSON.parse(Param.body.toString());
     var db=mongoose.createConnection(global.mongodbURL);
     var guishudiModel = db.model("meetGuishudi",MeetSchema.MeetGuishudiSchema);
     guishudiModel.find({"admin.userId":arg.userId},{"name":1,"code":1},function(err,data){
         db.close();
          Response.setHeader("Content-type","text/json;charset=utf-8");
         Response.end(JSON.stringify({
             "data":data,
             "status":"0"
         }));
     });
}

exports.Runner = run;


                                

	

