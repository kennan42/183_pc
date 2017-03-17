var MEAP = require("meap");
var mongoClient = require("mongodb").MongoClient;

/**
 * 查询项目列表
 * @author donghua.wang
 * @date 2015年10月30日 14:11
 * */
function run(Param, Robot, Request, Response, IF) {
    console.log("pm.getProjects start");
    Response.setHeader("Content-Type", "text/json;charset=utf-8");
    var arg = JSON.parse(Param.body.toString());

    mongoClient.connect(global.mongodbURL, function(err, db) {
        var coll = db.collection("base_project");
        var condition = {};
        if (arg.enName) {
            condition.enName = new RegExp(arg.enName);
        }
        coll.find(condition).sort({
            "enName" : 1
        }).toArray(function(err, docs) {
            db.close();
             console.log("pm.getProjects end");
            if(err){
                Response.end(JSON.stringify({
                    "status":"-1",
                    "msg":"查询失败"
                }));
            }else{
                Response.end(JSON.stringify({
                    "status":"0",
                    "msg":"查询成功",
                    "data":docs
                }));
            }
        });
    });
}

exports.Runner = run;

