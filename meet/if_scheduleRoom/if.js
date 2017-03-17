var MEAP = require("meap");
var mongoose = require("mongoose");
var mongoClient = require("mongodb").MongoClient;
var sm = require("../meetSchema.js");
var async = require("async");
var util = require("../../base/util.js");

function run(Param, Robot, Request, Response, IF) {
    var arg = JSON.parse(Param.body.toString());
    var startTime = parseInt(arg.startTime);
    var endTime = parseInt(arg.endTime);
    var db = mongoose.createConnection(global.mongodbURL);
    var MeetRoomModel = db.model("meetRoom", sm.MeetRoomSchema);
    var meetRoomObj = null;
    MeetRoomModel.findById(arg.meetRoom, function(err, data) {
        Response.setHeader("Content-type", "text/json;charset=utf-8");
        if (!err && data != null) {
            meetRoomObj = data;
            if (data.state == 3 || data.state == 4) {
                db.close();
                Response.end(JSON.stringify({
                    status : '-1',
                    msg : '会议室已经停用'
                }));
            } else if (data.state == 2) {//判断预约时间是否在冻结时间内
                if (data.frozenBegin <= endTime && data.frozenEnd >= startTime) {
                    db.close();
                    Response.end(JSON.stringify({
                        status : '-1',
                        msg : '该会议室在申请时间内已被冻结'
                    }));
                } else {
                    //会议室状态正常,判断该会议室在申请时间内是否已经被预约
                    var meetBookModel = db.model('meetbook', sm.MeetBookSchema);
                    meetBookModel.findOne({
                        'meetRoom2' : arg.meetRoom,
                        'state' : {
                            "$in" : [1, 2, 5]
                        },
                        'startTime' : {
                            '$lte' : endTime
                        },
                        'endTime' : {
                            '$gte' : startTime
                        }
                    }, function(err, data) {
                        if (data != null) {
                            Response.end(JSON.stringify({
                                status : '-1',
                                msg : '该会议室已经有人申请'
                            }));
                        } else {
                            Response.end(JSON.stringify({
                                status : '0',
                                msg : '会议室预约申请已成功提交'
                            }));
                            bookMeetingRoom(false, db, arg, meetRoomObj);
                        }
                    });
                }
            } else {
                //会议室状态正常,判断该会议室在申请时间内是否已经被预约
                var meetBookModel = db.model('meetbook', sm.MeetBookSchema);
                meetBookModel.findOne({
                    'meetRoom2' : arg.meetRoom,
                    'state' : {
                        "$in" : [1, 2, 5]
                    },
                    'startTime' : {
                        '$lte' : endTime
                    },
                    'endTime' : {
                        '$gte' : startTime
                    }
                }, function(err, data) {
                    if (data != null) {//已经被成功预约
                        Response.end(JSON.stringify({
                            status : '-1',
                            msg : '该会议室已经有人申请'
                        }));
                    } else {
                        Response.end(JSON.stringify({
                            status : '0',
                            msg : '会议室预约申请已成功提交'
                        }));
                        bookMeetingRoom(false, db, arg, meetRoomObj);
                    }
                });
            }
        } else {
            db.close();
            Response.end(JSON.stringify({
                status : -1,
                msg : "查询会议室信息失败"
            }));
        }
    });
}

function bookMeetingRoom(isBooked, db, arg, meetRoomObj) {
    var state = 1;
    var meetType = meetRoomObj.needApply;
    var userId = arg.userId;
    //判断用户是否为会议室管理员
    var MeetRoomModel = db.model("meetRoom", sm.MeetRoomSchema);
    MeetRoomModel.findOne({
        "_id" : arg.meetRoom,
        "admin.userId" : userId
    }, function(err, doc) {
        if (doc != null) {
            if (isBooked == false) {
                state = 2
            } else {
                state = 1;
            }
        } else {
            if (meetType == 0 && isBooked == false) {
                state = 2
            } else {
                state = 1;
            }
        }
        var userName2 = "";
        var times = new Date().getTime();
        arg.times = times;
        var MeetBookModel = db.model("meetBook", sm.MeetBookSchema);
        async.series([
        //根据工号查询用户拼音
        function(cb) {
            mongoClient.connect(global.mongodbURL, function(err, db) {
                var baseUsers = db.collection("base_users");
                var regExp = new RegExp(userId);
                baseUsers.findOne({
                    "PERNR" : regExp
                }, function(err, doc) {
                    db.close();
                    if (doc != null) {
                        userName2 = doc.VORNA;
                    }
                    cb(null, "");
                });
            });
        },
        function(cb) {
            var MeetBookEntity = new MeetBookModel({
                meetRoom : arg.meetRoom,
                meetRoom2 : arg.meetRoom,
                name : arg.name,
                guishudiId : arg.guishudiCode,
                guishudiName : arg.guishudiName,
                needApply : arg.needApply,
                userId : arg.userId,
                userName : arg.userName,
                tel : arg.tel,
                topic : arg.topic,
                type : arg.type,
                level : arg.level,
                userNumber : arg.userNumber,
                checkUser : arg.checkUser,
                state : state,
                goods : arg.goods,
                servicePersonal : arg.servicePersonal,
                technicist : arg.technicist,
                remark : arg.remark,
                startTime : arg.startTime,
                endTime : arg.endTime,
                clearOverTime : arg.clearOverTime,
                userTimes : arg.userTimes,
                createTime : times,
                checkTime : null,
                comments : "",
                ifKuaTian : arg.ifKuaTian,
                seatCard : arg.seatCard,
                multi : 0,
                applySrc : "pc",
                userName2 : userName2
            });
            MeetBookEntity.save(function(err) {
                db.close();
                addBookMeetRoomLog(arg, meetRoomObj);
                if (state == 1) {
                    pushMsg(arg);
                }
                cb(null, "");
            });
        }], function(err, data) {
            console.log("book meetroom handle over");
        });
    });

}

//向会议室管理员推送消息
function pushMsg(arg) {
    var checkUser = arg.checkUser;
    for (var i in checkUser) {
        var pushArg = {
            appId : global.appId,
            platforms : "0,1",
            title : "您有一条" + util.getMMddHHmmFromTimes(arg.startTime) + "开始" + arg.name + "进行的会议需要审批，要尽快处理喔~",
            body : new Date().getTime() + "_" + checkUser[i].userId + "_MeetingRoomApply",
            userCodeListStr : checkUser[i].userId,
            badgeNum : 3,
            module : "MeetingRoomBooking",
            subModule : "MeetingRoomApply",
            type : "remind"
        };
        util.pushMsg(pushArg);
        var rtxArg = {
            "userId" : checkUser[i].userId,
            "title" : pushArg.title,
            "times" : arg.times,
            "applyUser" : arg.userId
        };
        sendRTXMsg(rtxArg);
    }
}

/**
 *添加预定日志
 *  */
function addBookMeetRoomLog(arg, meetRoomObj) {
    var db = mongoose.createConnection(global.mongodbURL);
    var meetInvokeLogModel = db.model("meetInvokeLog", sm.MeetInvokeLogSchema);
    var meetInvokeLogObj = new meetInvokeLogModel({
        "invokeType" : "pc",
        "func" : "bookMeetRoom",
        "guishudiName" : arg.guishudiName,
        "needApply" : meetRoomObj.needApply,
        "meetRoomType" : meetRoomObj.type,
        "createTime" : new Date().getTime()
    });
    meetInvokeLogObj.save(function(err) {
        db.close();
        if (!err) {
            console.log("addBookMeetRoomLog success");
        } else {
            console.log("addBookMeetRoomLog err--->", err);
        }
    });
}

function sendRTXMsg(rtxArg) {
    setTimeout(function() {
        var db = mongoose.createConnection(global.mongodbURL);
        var meetBookModel = db.model('meetbook', sm.MeetBookSchema);
        var condition = {
            "createTime" : rtxArg.times,
            "userId" : rtxArg.applyUser,
            "state" : 1
        };
        meetBookModel.findOne(condition, function(err, data) {
            db.close();
            //该申请还处于未审核状态
            if (data != null) {
                util.sendRTXMsg(rtxArg);
            }
        });
    }, 1000 * 60);
}

exports.Runner = run;

