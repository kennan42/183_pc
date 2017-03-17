var MEAP=require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../meetSchema.js");
var async = require("async");

/**
 * 查询会议室列表（董元）
 */
var db = null;
var arg = null;
var query = null;
var meetingRoomModel = null;
var guishudiIds = null;
function run(Param, Robot, Request, Response, IF)
{
    arg = JSON.parse(Param.body.toString());
    guishudiIds = [];
    res = Response;
    query = {state:{$ne:3}};
    if(arg.name != null && arg.name != ''){
        var reg = new RegExp(arg.name);
        query.name = reg;
    }
    
    db = mongoose.createConnection(global.mongodbURL);
    meetingRoomModel = db.model("meetRoom",sm.MeetRoomSchema);
    async.series([getGuishudis,getMeetingRoomList,getMeetingRoomListCount],function(err,data){
        Response.setHeader("Content-type","text/json;charset=utf-8");
        db.close();
        if(!err){
            Response.end(JSON.stringify({
                status:"0",
                msg:"查询成功",
                data:data[1],
                count:data[2]
            }));
        }else{
            Response.end(JSON.stringify({
                status:"-1",
                msg:"查询失败"
            }));
        }
    });
}

function getGuishudis(callback){
    var guishudiModel = db.model("meetGuishudi",sm.MeetGuishudiSchema);
    guishudiModel.find({"admin.userId":arg.userId},{"_id":1},function(err,data){
        for(var i in data){
            guishudiIds.push(data[i]._id);
        }
        query.guishudiId = {"$in":guishudiIds};
        callback(err,"");
    });
}

function getMeetingRoomList(callback){
    var pageSize = parseInt(arg.pageSize);
    var pageNum = parseInt(arg.pageNum);
    var skip = (pageNum-1)*pageSize;
    meetingRoomModel.find(query).skip(skip).limit(pageSize).sort({guishudiName:1,index:1}).exec(function(err,data){
        callback(err,data);
    });
}

function getMeetingRoomListCount(callback){
    meetingRoomModel.count(query,function(err,data){
        callback(err,data);
    });
}

exports.Runner = run;


                                

	

