var MEAP = require("meap");
var util = require("../util.js");

function run(Param, Robot, Request, Response, IF) {
    var userId = Param.params.userId;
    if(userId == null){
        Response.end("/base/test   ...");
        return;
    }
    var arg = {
        "appId" : global.appId,
        "platforms" : "0,1",
        "userCodeListStr" : userId,
        "title" : "push test",
        "body" : "push test",
        "badgeNum" : "3",
        "module":"test",
        "subModule":"test"
    };
    util.pushMsg(arg);
    Response.end("/base/test");
}

exports.Runner = run;

