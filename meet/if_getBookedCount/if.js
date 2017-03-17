var MEAP=require("meap");
var async = require("async");
var mongoose = require("mongoose");
var meetSchema = require("../meetSchema.js");


function run(Param, Robot, Request, Response, IF)
{
    var arg = JSON.parse(Param.body.toString());
    var db = mongoose.createConnection(global.mongodbURL);
    var meetBookModel = db.model("meetBook",meetSchema.MeetBookSchema);
    async.parallel([
        function(callback){
            meetBookModel.count({"userId":arg.userId,"state":2},function(err,count){
                callback(err,count);
            });
        },
        function(callback){
            meetBookModel.count({"userId":arg.userId,"state":1},function(err,count){
                 callback(err,count);
            });
        },
        function(callback){
            var times = new Date().getTime();
            var times90D = 90*24*3600*1000;//90天的毫秒数
            var intervalTimes = times - times90D;
            meetBookModel.count({"userId":arg.userId,"state":{"$in":[3,4,5,6,7]},"endTime":{"$gte":intervalTimes}},function(err,count){
                 callback(err,count);
            });
        },
        function(callback){
            meetBookModel.count({"state":2,"servicePersonal.userId":arg.userId},function(err,count){
                 callback(err,count);
            });
        }
    ],function(err,data){
        db.close();
        Response.setHeader("Content-type","text/json;charset=utf-8");
        Response.end(JSON.stringify({
            "status":"0",
            "successCount":data[0],
            "notExamineCount":data[1],
            "completeCount":data[2],
            "serviceMeetRoomCount":data[3]
        }));
    });
}

exports.Runner = run;


                                

	

