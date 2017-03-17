var MEAP = require("meap");
var mongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

/**
 * 发布停机公告
 * @author donghua.wang
 * @date 2015年10月30日 14:37
 * */
function run(Param, Robot, Request, Response, IF) {
    console.log("pm.stopProject start");
    Response.setHeader("Content-Type", "text/json;charset=utf-8");
    var arg = JSON.parse(Param.body.toString());

    mongoClient.connect(global.mongodbURL, function(err, db) {
        var coll = db.collection("base_project");
        coll.updateOne({
            "_id" : new ObjectID(arg.id)
        }, {
            "$set" : {
                "status" : 0,
                "stopContent" : arg.stopContent,
                "stopStartTime" : arg.stopStartTime,
                "stopEndTime" : arg.stopEndTime
            }
        }, function(err, result) {
            db.close();
            console.log("pm.startProject end");
            if (err) {
                Response.end(JSON.stringify({
                    "status" : "-1",
                    "msg" : "停用失败"
                }));
            } else {
                Response.end(JSON.stringify({
                    "status" : "0",
                    "msg" : "停用成功"
                }));
            }
        });
    });
}

exports.Runner = run;

