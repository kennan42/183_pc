var MEAP=require("meap");
var async = require("async");
var mongoClient = require("mongodb").MongoClient;

/**
 * 添加mas项目
 * @author donghua.wang
 * @date 2015年10月30日 13:44
 * */
function run(Param, Robot, Request, Response, IF)
{
    console.log("pm.addProject start");
    Response.setHeader("Content-Type","text/json;charset=utf-8");
    var arg = JSON.parse(Param.body.toString());
    
    mongoClient.connect(global.mongodbURL,function(err,db){
        var coll = db.collection("base_project");
        var errMsg = "";
        async.series([
            //判断是否已经存在
            function(cb){
                coll.findOne({"enName":arg.enName},function(err,doc){
                    if(doc != null){
                         errMsg = "已经存在该项目";
                        cb(-1,null);
                    }else{
                        cb(err,null);
                    }
                });
            },
            //添加工程
            function(cb){
                coll.insertOne({
                    "enName":arg.enName,
                    "cnName":arg.cnName,
                    "description":arg.description,
                    "status":1,
                    "createTime":Date.now()
                },function(err,result){
                    cb(err,result);
                });
            }
        ],function(err,data){
            db.close();
            console.log("pm.addProject end");
            if(err){
                Response.end(JSON.stringify({
                    "status":"-1",
                    "msg":errMsg==""?"添加失败":errMsg
                }));
            }else{
                Response.end(JSON.stringify({
                    "status":"0",
                    "msg":'添加成功'
                }));
            }
        });
    })
}

exports.Runner = run;


                                

	

