var MEAP=require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../meetSchema.js");

function run(Param, Robot, Request, Response, IF)
{
	var arg=JSON.parse(Param.body.toString());
	var db=mongoose.createConnection(global.mongodbURL);
	var MeetGuishudiModel=db.model("meetguishudi",sm.MeetGuishudiSchema);
    MeetGuishudiModel.find({admin:{$elemMatch:{userId:arg.userId}}},{"code":1,name:1},function(err,data){
        db.close();
        Response.setHeader("Content-type","text/json;charset=utf-8");
        if(!err){
           Response.end(JSON.stringify({
               guishudi:data
           }));
        }else{
             Response.end(JSON.stringify({
               status:-1
           }));
        }
    });
}

exports.Runner = run;


                                

	

