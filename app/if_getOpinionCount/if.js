var MEAP = require("meap");
var mongoose = require("mongoose");
var appSchema = require("../AppSchema.js");

/**
 * 查询意见反馈数量
 * @author donghua.wang
 * @date 2015年10月10日 16:07
 * */
function run(Param, Robot, Request, Response, IF) {
    console.log("app.getOpinionCount start");
    Response.setHeader("Content-Type", "application/json;charset=utf-8");

    var arg = JSON.parse(Param.body.toString());
    var startTime = arg.startTime;
    var endTime = arg.endTime;

    var status =  arg.status;
    var param = {
        "status": status
    }
    if (status == 1) {
        var startTime = arg.startTime;
        var endTime = arg.endTime;
        param.createTime = {
            "$gte" : startTime,
            "$lte" : endTime
        };
    }

    var conn = mongoose.createConnection(global.mongodbURL);
    var appOpinionModel = conn.model("app_opinion", appSchema.appOpinionSchema);

    appOpinionModel.count(param, function (err, count) {
        conn.close();
        console.log("app.getOpinionCount end");
        Response.end(JSON.stringify({
            "status": "0",
            "count": count
        }));
    });
}

exports.Runner = run;


                                

	

