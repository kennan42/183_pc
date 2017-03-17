var MEAP = require("meap");
var mongoose = require("mongoose");
var meetSchema = require("../meetSchema.js");

/**
 * 查询作为服务人员的会议室列表
 * */
function run(Param, Robot, Request, Response, IF) {
    var arg = JSON.parse(Param.body.toString());
    var pageNumber = parseInt(arg.pageNumber);
    var pageSize = parseInt(arg.pageSize);
    var skip = (pageNumber - 1) * pageSize;
    var db = mongoose.createConnection(global.mongodbURL);
    var meetBookModel = db.model("meetBook", meetSchema.MeetBookSchema);
    meetBookModel.find({
        "servicePersonal.userId" : arg.userId
    }).skip(skip).limit(pageSize).sort({
        "startTime" : 1
    }).exec(function(err, data) {
        Response.setHeader("Content-type", "text/json;charset=utf-8");
        if (!err) {
            meetBookModel.count({
                "state" : 2,
                "servicePersonal.userId" : arg.userId,
                "startTime" : {
                    "$gte" : new Date().getTime()
                }
            }, function(err, count) {
                 db.close();
                Response.end(JSON.stringify({
                    "status" : "0",
                    "msg" : "查询成功",
                    "data" : data,
                    "count" : count
                }));
            });

        } else {
            db.close();
            Response.end(JSON.stringify({
                "status" : "-1",
                "msg" : "查询失败"
            }));
        }

    });

}

exports.Runner = run;

