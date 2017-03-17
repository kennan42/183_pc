var MEAP=require("meap");
var mongoose = require("mongoose");
var async = require("async");
var appSchema = require("../AppSchema.js");

/**
 * 查询意见详情
 * @author donghua.wang
 * @date 2015年10月8日 11:39
 * */
function run(Param, Robot, Request, Response, IF)
{
    console.log("app.getOpinion start");
    Response.setHeader("Content-Type", "application/json;charset=utf-8");
    var arg = JSON.parse(Param.body.toString());
    var id = arg.id;
    var userId = null;
    var conn = mongoose.createConnection(global.mongodbURL);
    var appOpinionModel = conn.model("app_opinion", appSchema.appOpinionSchema);
    var baseUserModel = conn.model("base_user", appSchema.BaseUserSchema);
    async.series([
        function(cb){
            appOpinionModel.findById(id,function(err,data){
                if(err || data == null){
                    cb(-1,null);
                }else{
                    userId = data.userId;
                    cb(err,data);
                }
            });
        },
        function(cb){
            var regExp = new RegExp(userId);
            baseUserModel.findOne({"PERNR":regExp},function(err,data){
                cb(err,data);
            });
        }
    ],function(err,data){
        conn.close();
        console.log("app.getOpinion end");
        if(err){
            Response.end(JSON.stringify({
                "status":"-1",
                "msg":"查询失败"
            }));
        }else{
            Response.end(JSON.stringify({
                "status":"0",
                "msg":"查询成功",
                "opinion":data[0],
                "user":data[1]
            }));
        }
    });
}

exports.Runner = run;


                                

	

