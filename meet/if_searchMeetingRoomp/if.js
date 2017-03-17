var MEAP = require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../meetSchema.js");
var async = require("async");

function run(Param, Robot, Request, Response, IF) {
    var arg = JSON.parse(Param.body.toString());
    var meetRooms = null;
    var db = mongoose.createConnection(global.mongodbURL);
    Response.setHeader("Content-type", "text/json;charset=utf-8");
    async.series([
    //查询会议室信息
    function(callback) {
        var query = {};
        if (arg.guishudiCodeId.length > 0) {
            query.guishudiId = {
                "$in" : arg.guishudiCodeId
            };
        }
        if (arg.capacity) {
            query.capacity = arg.capacity;
        }
        if (arg.name) {
            var reg = new RegExp(arg.name);
            query.name = reg;
        }
        if (arg.type != 0) {
            query.type = arg.type;
        }
        //query.$or = [{"state":1},{"state":2,"frozenBegin":{"$gte":arg.endDate}},
        // {"state":2,"frozenEnd":{"$lte":arg.beginDate}}];
        query.state = {
            "$in" : [1, 2]
        };
        var meetRoomModel = db.model("meetRoom", sm.MeetRoomSchema);
        meetRoomModel.find(query).sort({
            guishudiOrder : 1,
            index : 1
        }).exec(function(err, data) {
            if (!err) {
                if (data.length > 0) {
                    meetRooms = data;
                    callback(err, "");
                } else {
                    db.close();
                    Response.end(JSON.stringify({
                        status : "-1",
                        msg : "没有符合条件的会议室"
                    }));
                    return;
                }

            } else {
                db.close();
                Response.end(JSON.stringify({
                    status : -1,
                    msg : "查询会议室信息失败"
                }));
                return;
            }
        });
    },
    //查询会议室预定信息
    function(callback) {
        var meetBookModel = db.model("meetBook", sm.MeetBookSchema);
        var meetRoomIds = [];
        for (var i in meetRooms) {
            meetRoomIds.push(meetRooms[i]._id);
        }
        meetBookModel.find({
            "meetRoom2" : {
                "$in" : meetRoomIds
            },
            "state" : {
                "$in" : [1, 2, 5,7]
            },
            "startTime" : {
                "$lte" : arg.endDate
            },
            "endTime" : {
                "$gte" : arg.beginDate
            }
        }).sort({
            "startTime" : 1
        }).exec(function(err, data) {
            db.close();
            if (!err) {
                Response.end(JSON.stringify({
                    status : "0",
                    msg : "查询成功",
                    meetRooms : meetRooms,
                    bookedMeetRooms : data
                }));
            } else {
                Response.end(JSON.stringify({
                    status : "-1",
                    msg : "查询会议室预约信息失败"
                }));
            }
        });
    }], function(err, data) {
    });

}

exports.Runner = run;

