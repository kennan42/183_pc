var MEAP = require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../meetSchema.js");
var async = require('async');
var util = require("../../base/util.js");

function run(Param, Robot, Request, Response, IF) {
    var arg = JSON.parse(Param.body.toString());
    var meetingRoomIds = null;
    var bookedRoomIds = null;
    var db = mongoose.createConnection(global.mongodbURL);
    var MeetRoomModel = db.model("meetRoom", sm.MeetRoomSchema);
    Response.setHeader("Content-type", "text/json;charset=utf-8");
    var queryForMeetingRoom = {};
    if (arg.guishudiCode) {
        queryForMeetingRoom.guishudiId = arg.guishudiCode;
    }
    if (arg.needApply) {
        queryForMeetingRoom.needApply = parseInt(arg.needApply);
    }
    if (arg.type) {
        queryForMeetingRoom.type = parseInt(arg.type);
    }
    if (arg.level) {
        queryForMeetingRoom.level = parseInt(arg.level);
    }
    queryForMeetingRoom.state = {
        $in : [1, 2]
    }
    var pageNumber = arg.pageNumber;
    var pageSize = arg.pageSize;
    var skip = (pageNumber-1)*pageSize;
    MeetRoomModel.find(queryForMeetingRoom).skip(skip).limit(pageSize).sort({guishudiName:1,name:1}).exec(function(err, meetingRooms) {
        db.close();
        if (!err && meetingRooms.length > 0) {
            Response.end(JSON.stringify({
                status : '0',
                msg : '查询成功',
                data : meetingRooms
            }));
        } else {
            Response.end(JSON.stringify({
                status : '-1',
                msg : '没有符合查询条件的会议室'
            }));
        }
    });
}

exports.Runner = run;

