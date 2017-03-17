var MEAP = require("meap");
var mongoose = require("mongoose");
var meetSchema = require("../meetSchema.js");
var async = require("async");

function run(Param, Robot, Request, Response, IF) {
    try {
        var userId = Param.params.userId;
        var state = parseInt(Param.params.state);
        var db = mongoose.createConnection(global.mongodbURL);
        var meetRoomModel = db.model("meetRoom", meetSchema.MeetRoomSchema);
        Response.setHeader("Content-Type","text/json;charset=utf-8");
        async.series([
        //判断用户是否为会议室管理员
        function(callback){
            meetRoomModel.findOne({"admin.userId":userId},function(err,data){
            if(data != null){
                callback(err,"");
            }else{
                db.close();
                Response.end(JSON.stringify({
                    "status":"0",
                    "meetAdmin":"0",
                    "msg":"普通用户"
                    }));
                return;
            }
            });
        },
        //查询待审核或以审核的会议室列表
        function(callback) {
            var meetBookModel = db.model("meetBook",meetSchema.MeetBookSchema);
            var query = {};
            if(state == 0){
                query.state = 1;
            }else{
                query.state = {"$in":[2,3,5,6]};
            }
            query["checkUser.userId"] = userId;
            meetBookModel.count(query, function(err, count) {
                db.close();
                Response.end(JSON.stringify({
                    "status" : "0",
                    "meetAdmin" : "1",
                    "msg" : "会议室管理员",
                    "count" : count
                }));
                return;
            });
        }
        ],function(err,data){
            
        });
    } catch(e) {
        Response.end(JSON.stringify({
            "status" : "-1",
            "msg" : "程序运行错误",
            "code" : e
        }));
    }
}

exports.Runner = run;

