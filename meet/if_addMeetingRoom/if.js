var MEAP = require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../meetSchema.js");
var baseSchema = require("../../base/BaseSchema.js");
var async = require("async");
var util = require("../../base/util.js");

/**
 * 3.1新增会议室（董元）
 */
function run(Param, Robot, Request, Response, IF) {
    var newMeet = JSON.parse(Param.body.toString());
    var defaultImage = [{
        imageURL : global.nginxURL + "uploads/meet/defaultMeet.jpg",
        compressedImageURL : global.nginxURL + "uploads/meet/defaultMeet2.jpg"
    }];
    var index = parseInt(newMeet.index);
    var db = mongoose.createConnection(global.mongodbURL);
    var MeetRoomModel = db.model("meetRoom", sm.MeetRoomSchema);
	var meetGuishudiModel = db.model("meetGuishudi",sm.MeetGuishudiSchema);
	var guishudiOrder = null;
	async.series([function(cb){
		meetGuishudiModel.findById(newMeet.guishudiCode,function(err,data){
			if(data == null){
			    db.close();
				Response.end(JSON.stringify({
					"status":"-1",
					"msg":"查询归属地信息失败"
				}));
				return;
			}
			guishudiOrder = data.guishudiOrder;
			cb(null,"");
		})
	},function(cb){
		    MeetRoomModel.count({}, function(err, count) {
        var serialNumber = "CTTQMR" + (100000 + count);
        var MeetRoomEntity = new MeetRoomModel({
            guishudiId : newMeet.guishudiCode, //{type:Schema.Types.ObjectId,ref:"meetGuishudi"},//FK  归属地//
            guishudiName : newMeet.guishudiName, //归属地名称
            name : newMeet.name, //会议室名称
            shortName : newMeet.shortName,
            state : 1,
            capacity : newMeet.capacity, //容纳人数 10人以下；10到20人；20到30人；30到40人；50人以上
            address : newMeet.address, //会议室地址
            level : newMeet.level,
            needApply : newMeet.needApply, //1需要申请  0不需要申请
            clearMinute : newMeet.clearMinute, //清场时间分钟数
            type : newMeet.type, //1普通会议室   2视频会议室
            admin : newMeet.admin, //[{userId:"",userName:""},...]管理员
            servicePersonal : newMeet.servicePersonal, //服务人员[{userId:"",userName:""},...]
            technicist : newMeet.technicist, //技术支持[{userId:"",userName:""},...]
            device : newMeet.device, //会议设备[{code:"",name:""},...]会议室设备
            image : newMeet.image == "" ? defaultImage : newMeet.image, //[{imageId:String,imageURL:String,imageURLM},...],会议室图片
            createUser : newMeet.createUser, //建立人员
            createTime : newMeet.createTime, //建立时间
            updateUser : newMeet.updateUser, //最后修改人员
            updateTime : newMeet.updateTime, //最后修改时间
            index : index,
            desc : newMeet.desc,
            serialNumber:serialNumber,
			guishudiOrder:guishudiOrder,
			meetlevel:newMeet.meetlevel,
			homesector:newMeet.homesector
        });
        MeetRoomEntity.save(function(err, doc) {
            Response.setHeader("Content-type", "text/json;charset=utf-8");
            db.close();
            if (!err) {
                Response.end(JSON.stringify({
                    status : 0,
                    msg : '保存成功'
                }));
                pushMsg(0, newMeet);
                addLog(newMeet);
            } else {
                Response.end(JSON.stringify({
                    status : -1,
                    msg : '保存失败'
                }));
            }
        });
    });
	}]);
}

//向成为会议室管理员的人推送消息
function pushMsg(i, arg) {
    i = i || 0;
    if (i < arg.admin.length) {
        var createUser = arg.createUser;
        var pushArg = {
            appId : global.appId,
            platforms : "0,1",
            title : "您已被" + createUser.userName + "指定为" + arg.name + "的会议室管理员了",
            body : new Date().getTime() + "_" + arg.admin[i].userId + "_AddMeetingRoom",
            userCodeListStr : arg.admin[i].userId,
            badgeNum : 3,
            module : "MeetingRoomBooking",
            subModule : "AddMeetingRoom",
            type : "remind"
        };
        util.pushMsg(pushArg);
        i++;
        pushMsg(i, arg);
    }
}

function addLog(arg) {
    var db = mongoose.createConnection(global.mongodbURL);
    var logModel = db.model("baseOpLog", baseSchema.BaseOpLogSchema);
    var logEntity = new logModel({
        opType : "i",
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
