var MEAP = require("meap");
var mongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

/**
 * 启动项目
 * @authro donghua.wang
 * @date 2015年10月30日 14:19
 * */
function run(Param, Robot, Request, Response, IF) {
    console.log("pm.startProject start");
    Response.setHeader("Content-Type", "text/json;charset=utf-8");
    var arg = JSON.parse(Param.body.toString());

    mongoClient.connect(global.mongodbURL, function(err, db) {
        var coll = db.collection("base_project");
        coll.updateOne({
            "_id" : new ObjectID(arg.id)
        }, {
            "$set" : {
                "status" : 1
            }
        }, function(err, result) {
            db.close();
            console.log("pm.startProject end");
            if (err) {
                Response.end(JSON.stringify({
                    "status" : "-1",
                    "msg" : "启用失败"
                }));
            } else {
                Response.end(JSON.stringify({
                    "status" : "0",
                    "msg" : "启用成功"
                }));
            }
        });
    });
}

exports.Runner = run;

