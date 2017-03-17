var MEAP=require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../meetSchema.js");

function run(Param, Robot, Request, Response, IF)
{
    var arg = JSON.parse(Param.body.toString());
	var meetingRoomId = arg.meetingRoomId;
	var startTime = parseInt(arg.startTime);
	var endTime = parseInt(arg.endTime);
	var db = mongoose.createConnection(global.mongodbURL);
    var meetBookModel=db.model("meetBook",sm.MeetBookSchema);
    Response.setHeader("Content-type","text/json;charset=utf-8");
    meetBookModel.find({
        "state":{"$in":[2,5]},
        "meetRoom2":meetingRoomId,
        "startTime":{"$lte":endTime},
        "endTime":{"$gte":startTime}
    },function(err,data){
        db.close();
        if(!err){
            Response.end(JSON.stringify({
                status:"0",
                msg:"查询成功",
                data:data
            }));
        }else{
            Response.end(JSON.stringify({
                status:"-1",
                msg:"查询失败"
            }));
        }
    });
    
}

exports.Runner = run;


                                

	

