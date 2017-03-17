var MEAP=require("meap");
var mongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

/**
 * 删除项目配置
 * @author donghua.wang
 * @date 2015年10月30日 14:01
 * */
function run(Param, Robot, Request, Response, IF)
{
    console.log("pm.delProject start");
    Response.setHeader("Content-Type","text/json;charset=utf-8");
    var arg = JSON.parse(Param.body.toString());
    
    mongoClient.connect(global.mongodbURL,function(err,db){
        var coll = db.collection("base_project");
        coll.deleteOne({"_id":new ObjectID(arg.id)},function(err){
            db.close();
            console.log("pm.delProject end");
            if(!err){
                Response.end(JSON.stringify({
                    "status":"0",
                    "msg":"删除成功"
                }));
            }else{
                Response.end(JSON.stringify({
                    "status":"-1",
                    "msg":"删除失败"
                }));
            }
        });
    });
    
}

exports.Runner = run;


                                

	

