var MEAP = require("meap");
var mongoose = require("mongoose");
var appSchema = require("../AppSchema.js");

/**
 *回复意见
 * @author donghua.wang
 * @date 2015年10月8日 10:56
 * */
function run(Param, Robot, Request, Response, IF) {
    console.log("app.replyOpinion start");
    Response.setHeader("Content-Type", "application/json;charset=utf-8");
    var arg = JSON.parse(Param.body.toString());
	console.log(arg);
    var id = arg.id;
    var reply = arg.reply;
    var replyImgs = arg.replyImgs;
	replyImgs = JSON.parse(replyImgs);
    var replyUserId = arg.userId;
    if(!replyUserId){
        Response.end(JSON.stringify({
            "status":"-1",
            "msg":"获取用户信息失败"
        }));
        return;
    }
    var conn = mongoose.createConnection(global.mongodbURL);
    var appOpinionModel = conn.model("app_opinion", appSchema.appOpinionSchema);
    appOpinionModel.update({
        "_id" : id
    }, {
        "status":1,
        "reply" : reply,
        "replyImgs":replyImgs,
        "replyUserId" : replyUserId,
        "replyTime" : new Date().getTime()
    }, function(err) {
        conn.close();
        console.log("app.replyOpinion end");
        Response.end(JSON.stringify({
            "status":"0",
            "msg":"回复成功"
        }));
    });
}

exports.Runner = run;

