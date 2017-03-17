var MEAP=require("meap");
var async = require("async");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var meetSchema = require("../meetSchema.js");

/**
 * 判断登陆用户是否为管理员
 * @author donghua.wang
 * @version 2015年2月7日09:44
 * */
var roles = null;
var db = null;
var arg = null;
function run(Param, Robot, Request, Response, IF)
{
    roles = [];
    arg = JSON.parse(Param.body.toString());
	db = mongoose.createConnection(global.mongodbURL);
	Response.setHeader("Content-type","text/json;charset=utf-8");
    async.series([isGuishudiAdmin,isMeetRootAdmin,isServicePersonal],function(err,data){
        db.close();
        if(!err){
            Response.end(JSON.stringify({
                status:"0",
                msg:"查询成功",
                roles:roles
            }));
        }else{
            Response.end(JSON.stringify({
                status:"-1",
                msg:"查询失败"
            }));
        }
    });
}

//判断用户是否是归属地管理员
function isGuishudiAdmin(callback){
    var guishudiModel = db.model("meetGuishudi",meetSchema.MeetGuishudiSchema);
    guishudiModel.findOne({admin:{$elemMatch:{userId:arg.userId}}},function(err,data){
        if(!err && data != null){
            roles.push("guishudiAdmin");
        }
        callback(err,"");
    });
}

//判断用户是否为会议室管理员
function isMeetRootAdmin(callback){
    var meetRoomModel = db.model("meetRoom",meetSchema.MeetRoomSchema);
    meetRoomModel.findOne({admin:{$elemMatch:{userId:arg.userId}}},function(err,data){
        if(!err && data != null){
             roles.push("meetRoomAdmin");
        }
        callback(err,"");
    });
}

function isServicePersonal(callback){
    var meetRoomModel = db.model("meetRoom",meetSchema.MeetRoomSchema);
    meetRoomModel.findOne({"servicePersonal.userId":arg.userId},function(err,data){
        if(!err && data != null){
             roles.push("meetRoomService");
        }
        callback(err,"");
    });
}

exports.Runner = run;


                                

	

