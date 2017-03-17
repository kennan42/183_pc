var MEAP=require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../meetSchema.js");
var baseSchema = require("../../base/BaseSchema.js");
var async = require("async");
var util = require('../../base/util.js');
/**
 * 停用会议室（董元）
 */
function run(Param, Robot, Request, Response, IF)
{
	
	var arg=JSON.parse(Param.body.toString());
	var db=mongoose.createConnection(global.mongodbURL);
	var MeetRoomModel=db.model("meetRoom",sm.MeetRoomSchema);
    MeetRoomModel.update({_id:arg.roomId},{
		state:parseInt(arg.state)
     },function(err,data){
         db.close();
         Response.setHeader("Content-type","text/json;charset=utf-8");
         if(!err){
             Response.end(JSON.stringify({
                 status:0,
                 msg:"更新成功"
             }));
             updateMeetBookState(arg);
             addLog(arg);
         }else{
		 	console.log(err);
             Response.end(JSON.stringify({
                 status:-1,
                 msg:"更新失败"
             }));
         }
     });
}

//更新会议室预约状态
function updateMeetBookState(arg){
    console.log("41--->",arg);
    if(arg.state == '3' || arg.state == '4'){
       var commonts = (arg.state=='3'?'会议室删除':'会议室停用');
       var db=mongoose.createConnection(global.mongodbURL);
       var meetingBookModel = db.model('meetbook',sm.MeetBookSchema);
       meetingBookModel.find({'meetRoom2':arg.roomId,'state':2},
          function(err,data){
           if(!err && data.length > 0){
               meetingBookModel.update({'meetRoom2':arg.roomId,'state':2},
                  {'state':3,'comments':commonts},{"upsert":false,"multi":true},function(err){
                      db.close();
                   if(!err){
                       pushMsg(0,data);
                   }
               });
           }else{
               db.close();
               console.log('err--->',err);
           }
       });
    }
}

//消息推送
function pushMsg(i,arg){
    var str;
    if(str == null){
        str = (arg.state=='3'?'已经删除':'已经停用');
    }
    i = i||0;
    if(i < arg.length){
        var pushArg = {
            appId : global.appId,
            platforms : "0,1",
            title : "您" + util.getMMddHHmmFromTimes(arg[i].startTime) +  "开始" + arg[i].name 
                    + "进行的会议被取消了，如有疑问请联系管理员，避免影响工作安排请尽快预定其他会议室或其他会议时段。",
            body : new Date().getTime() + "_" + arg[i].userId + "_OutMeetingRoom",
            userCodeListStr : arg[i].userId,
            badgeNum : 3,
            module:"MeetingRoomBooking",
            subModule:"OutMeetingRoom",
            type:"remind"
        };
        util.pushMsg(pushArg);
        i++;
        pushMsg(i,arg);
    }
}

function addLog(arg){
    var db = mongoose.createConnection(global.mongodbURL);
    var logModel = db.model("baseOpLog",baseSchema.BaseOpLogSchema);
    var logEntity = new logModel({
        opType:"u",
        opArg:arg,
        opDocument:"meetRoom",
        userId:arg.userId,
        userName:arg.userName,
        updateTime:util.getDateStrFromTimes(new Date().getTime(),true)
    });
    logEntity.save(function(err){
        db.close();
    });
}

exports.Runner = run;


                                

	

