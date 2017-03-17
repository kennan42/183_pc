var MEAP = require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../meetSchema.js");
var baseSchema = require("../../base/BaseSchema.js");
var async = require("async");
var util = require("../../base/util.js");

/**
 * 3.7编辑会议室（董元）
 */
function run(Param, Robot, Request, Response, IF) {
    try {
        var arg = JSON.parse(Param.body.toString());
        var defaultImage = [{
            imageURL : global.nginxURL + "uploads/meet/" + "defaultMeet.jpg",
            compressedImageURL : global.nginxURL + "uploads/meet/" + "defaultMeet2.jpg"
        }];
        var db = mongoose.createConnection(global.mongodbURL);
        var index = parseInt(arg.index);
        var MeetRoomModel = db.model("meetRoom", sm.MeetRoomSchema);
		var meetGuishudiModel = db.model("meetGuishudi",sm.MeetGuishudiSchema);
		var guishudiOrder = null;
		meetGuishudiModel.findById(arg.guishudiCode,function(err,data){
			if(data == null){
			    db.close();
				Response.end(JSON.stringify({
					"status":"-1",
					"msg":"查询归属地信息失败"
				}));
				return;
			}
			guishudiOrder = data.guishudiOrder;
			 MeetRoomModel.update({
            "_id" : arg.roomId
        }, {
            guishudiId : arg.guishudiCode,
            guishudiName : arg.guishudiName,
            name : arg.name,
            shortName :arg.shortName,
            capacity : arg.capacity,
            address : arg.address,
            level : arg.level,
            needApply : arg.needApply,
            clearMinute : arg.clearMinute,
            type : arg.type,
            admin : arg.admin,
            servicePersonal : arg.servicePersonal,
            technicist : arg.technicist, 
            device : arg.device,
            image : arg.image == "" ? defaultImage : arg.image,
            updateUser : arg.updateUser,
            updateTime : new Date().getTime(),
            index : index,
            desc:arg.desc,
			guishudiOrder:guishudiOrder, 
            meetlevel:arg.meetlevel,
            homesector:arg.homesector
        }, {
            upsert : false,
            multi : false
        }, function(err) {
            db.close();
            if (!err) {
                Response.end(JSON.stringify({
                    status : "0",
                    msg : "编辑成功"
                }));
                pushMsg(arg);
                addLog(arg);
            } else {
                Response.end(JSON.stringify({
                    status : "-1",
                    msg : "编辑失败"
                }));
            }
        });
		});

    } catch(e) {
        Response.end(JSON.stringify({
            status : "-1",
            msg : "编辑失败"
        }));
    }

}

//推送消息至审核通过的所有申请该会议室的人员
function pushMsg(arg) {
    var db = mongoose.createConnection(global.mongodbURL);
    var meetBookModel = db.model("meetBook", sm.MeetBookSchema);
    meetBookModel.find({
        "meetRoom2" : arg.roomId,
        "state" : 2,
        "startTime" : {
            "$gte" : new Date().getTime()
        }
    }, function(err, data) {
        db.close();
        if (!err && data.length > 0) {
            for (var i in data) {
                var pushArg = {
                    appId : global.appId,
                    platforms : "0,1",
                    title : "您预订的" + data[i].name + "信息已被管理员修改，请进入会议室预定查看详情，以免影响会议。",
                    body :  new Date().getTime() + "_" + data[i].userId + "_EditMeetingRoom",
                    userCodeListStr : data[i].userId,
                    badgeNum : 3,
                    module : "MeetingRoomBooking",
                    subModule : "EditMeetingRoom",
                    type : "remind"
                }
                util.pushMsg(pushArg);
            }
        }
    });
}

function addLog(arg) {
    var db = mongoose.createConnection(global.mongodbURL);
    var logModel = db.model("baseOpLog", baseSchema.BaseOpLogSchema);
    var logEntity = new logModel({
        opType : "u",
        opArg : arg,
        opDocument : "meetRoom",
        userId : arg.userId,
        userName : arg.userName,
        updateTime : util.getDateStrFromTimes(new Date().getTime(), true)
    });
    logEntity.save(function(err) {
        db.close();
    });
}

exports.Runner = run;

