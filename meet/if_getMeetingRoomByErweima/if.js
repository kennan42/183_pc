var MEAP=require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../meetSchema.js");

/**
 * 解析二维码，查询会议室信息
 * */
function run(Param, Robot, Request, Response, IF)
{
    try{
        var arg = JSON.parse(Param.body.toString());
        var encode = arg.encode;
        var moduleCode = encode.substring(0,9);
        if(moduleCode != 'CTTQ01002'){
            Response.end(JSON.stringify({
                status:"-1",
                msg:"模块解析错误"
            }));
            return;
        }
        var base64 = encode.substring(9);
        var meetingRoomId = new Buffer(base64, 'base64').toString();
        var db=mongoose.createConnection(global.mongodbURL);
        var MeetRoomModel=db.model("meetRoom",sm.MeetRoomSchema);
        Response.setHeader("Content-type","text/json;charset=utf-8");
        MeetRoomModel.findById(meetingRoomId,function(err,doc){
            db.close();
            if(!err && doc != null){
                Response.end(JSON.stringify({
                    status:"0",
                    msg:"查询成功",
                    data:doc
                }));
            }else{
                console.log("---err",err);
                Response.end(JSON.stringify({
                    status:"-1",
                    msg:"查询失败"
                }));
            }
        });
    }catch(e){
        console.log("---e",e);
        Response.end(JSON.stringify({
                status:"-1",
                msg:"解析错误"
            }));
    }
}

exports.Runner = run;


                                

	

