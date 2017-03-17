var MEAP = require("meap");
var async = require('async');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../meetSchema.js");

/**
 * 更新会议预约系统状态
 * */
function run(Param, Robot, Request, Response, IF) {
    var db = mongoose.createConnection(global.mongodbURL);
    var meetBookModel = db.model("meetBook", sm.MeetRoomSchema);
    var meetRoomModel = db.model('meetRoom', sm.MeetRoomSchema);
    var times = new Date().getTime();
    Response.setHeader("Content-type","text/json;charset=utf-8");
    async.parallel([
    //更新会议室预约状态为已完成
    function(callback) {
        meetBookModel.update({
            state : 2,
            endTime : {
                $lte : times
            }
        }, {
            state : 5
        }, function(err) {
             callback(err,'');
        });
    },
    //解冻过期的会议室状态
    function(callback) {
        meetRoomModel.update({
            'state':2,
            'frozenEnd':{'$lte':times}
        },{
            'state':1,
            'frozenBegin':0,
            'frozenEnd':0
        },function(err){
            callback(err,'');
        });
    }], function(err, data) {
        db.close();
        Response.end(err);
    });
}

exports.Runner = run;

