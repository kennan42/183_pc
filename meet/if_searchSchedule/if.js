var MEAP = require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../meetSchema.js");
var async = require("async");

function run(Param, Robot, Request, Response, IF) {
    var arg = JSON.parse(Param.body.toString());
    var db = mongoose.createConnection(global.mongodbURL);
    var MeetBookModel = db.model("meetBook", sm.MeetBookSchema);
    var meetRoomModel = db.model('meetRoom', sm.MeetRoomSchema);
    MeetBookModel.findById(arg.scheduleId).populate('meetRoom').exec(function(err, data) {
        Response.setHeader("Content-type", "text/json;charset=utf-8");
        if (!err) {
            if (data.multi != null && data.multi == 1) {
                MeetBookModel.find({
                    "createTime" : data.createTime,
                    "meetRoom2" : {
                        "$ne" : data.meetRoom2
                    }
                }, function(err, data1) {
                    db.close();
                    Response.end(JSON.stringify({
                        status : 0,
                        msg : "查询成功",
                        data : data,
                        otherMeetRooms : data1
                    }));
                });
            } else {
                db.close();
                Response.end(JSON.stringify({
                    status : 0,
                    msg : "查询成功",
                    data : data
                }));
            }

        } else {
            db.close();
            Response.end(JSON.stringify({
                status : -1,
                msg : "查询失败"
            }));
        }
    });
}

exports.Runner = run;

