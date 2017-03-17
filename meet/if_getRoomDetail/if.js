var MEAP=require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../meetSchema.js");
var async = require("async");

/**
 * 3.9查询会议室详情（董元）
 */
function run(Param, Robot, Request, Response, IF)
{
	
	//var arg =  {roomId:"54d81cd3f23749e406f5cc54"};
	var arg=JSON.parse(Param.body.toString());
	var db=mongoose.createConnection(global.mongodbURL);
	var MeetRoomModel=db.model("meetRoom",sm.MeetRoomSchema);
    MeetRoomModel.findOne({_id:arg.roomId},function(err,data){
         db.close();
         Response.setHeader("Content-type","text/json;charset=utf-8");
         if(!err){
             Response.end(JSON.stringify({
                 status:0,
                 msg:"查询成功",
				 data:data
             }));
             addQueryMeetRoomLog();
         }else{
		 	console.log(err);
             Response.end(JSON.stringify({
                 status:-1,
                 msg:"查询失败"
             }));
         }
     });
}

/**
 *添加查询会议室信息日志
 *  */
function addQueryMeetRoomLog() {
    var db = mongoose.createConnection(global.mongodbURL);
    var meetInvokeLogModel = db.model("meetInvokeLog", sm.MeetInvokeLogSchema);
    var meetInvokeLogObj = new meetInvokeLogModel({
        "invokeType":"pc",
        "func":"queryMeetRoom",
        "createTime":new Date().getTime()
    });
    meetInvokeLogObj.save(function(err){
        db.close();
        if(!err){
            console.log("addBookMeetRoomLog success");
        }else{
             console.log("addBookMeetRoomLog err--->",err);
        }
    });
}

exports.Runner = run;


                                

	

