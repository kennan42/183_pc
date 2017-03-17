var MEAP = require("meap");
var mongoose = require("mongoose");
var appSchema = require("../AppSchema.js");

/**
 *查询意见列表
 * @author donghua.wang
 * @date 2015年10月8日 11:10
 * */
function run(Param, Robot, Request, Response, IF) {
    console.log("app.getOpinions start");
    Response.setHeader("Content-Type", "application/json;charset=utf-8");
    var arg = JSON.parse(Param.body.toString());
    var pageNumber = arg.pageNumber;
    if (!pageNumber) {
        pageNumber = 1;
    }
    var pageSize = arg.pageSize;
    if (!pageSize) {
        pageSize = 10;
    }
    var skip = (pageNumber - 1) * pageSize;
    var status = arg.status;
    var condition = {
        "status" : status
    };
    if (status == 1) {
        var startTime = arg.startTime;
        var endTime = arg.endTime;
        condition.createTime = {
            "$gte" : startTime,
            "$lte" : endTime
        };
    }
    var conn = mongoose.createConnection(global.mongodbURL);
    var appOpinionModel = conn.model("app_opinion", appSchema.appOpinionSchema);
    appOpinionModel.find(condition).skip(skip).limit(pageSize).sort({
        "createTime" : -1
    }).exec(function(err, data) {
        conn.close();
        Response.end(JSON.stringify({
            "status" : "0",
            "data" : data
        }));
    });
}

exports.Runner = run;

