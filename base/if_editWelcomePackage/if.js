var MEAP = require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../BaseSchema.js");

function run(Param, Robot, Request, Response, IF) {
    Response.setHeader("Content-type", "text/json;charset=utf-8");
    var db = mongoose.createConnection(global.mongodbURL);
    var BaseJurisdictionUserModel = db.model("base_jurisdiction_user", sm.BaseJurisdictionUser);

    var args = JSON.parse(Param.body.toString());
    BaseJurisdictionUserModel.aggregate([
            {
                $match: {
                    userId: args.userId,
                    abbreviation: "welcomepage"
                }
            }
        ],
        function (err, res) {
            if (err == null) {
                if (res.length > 0) {
                    edit(Response, args, db);
                } else {
                    db.close();
                    Response.end(JSON.stringify({
                        "status": -1,
                        "msg": "没有权限"
                    }));
                }
            } else {
                db.close();
                Response.end(JSON.stringify({
                    "status": 1,
                    "msg": "权限检查发生错误"
                }));
            }
        }
    );

}

function edit(Response, args, db) {
    var id = args.packageId ? args.packageId : 99999;  // id从100000开始，故不存在时取99999
    var duration = args.duration;
    // 只有单张图片的时候才会有显示时长
    if (args.images.length != 1) {
        duration = -1;
    }
    // id为100000的优先级为0,有效时间为2105到9999
    if (id == 100000) {
        args.priority = 0;
        args.beginTime = new Date("2015", "1", "1", "0", "0", "0").getTime();
        args.endTime = new Date("9999", "12", "31", "23", "59", "59").getTime();
    }
    var BaseWelcomePackageModel = db.model("baseWelcomePackage", sm.BaseWelcomePackage);
    BaseWelcomePackageModel.update({
        "id": id
    }, {
        "$set": {
            "images": args.images,  //欢迎页图片的URL
            "thumbnails": args.thumbnails,  //欢迎页图片缩略图的URL
            "description": args.description, //图片包描述
            "beginTime": args.beginTime,  //生效日期，Unix时间戳单位为ms
            "endTime": args.endTime,  //失效日期，Unix时间戳单位为ms
            "priority": args.priority,  //优先级，整数，范围1-9，1最低，9最高；id为100000的图片优先级为0，不可修改
            "skip": args.skip,  //是否允许跳过，0表示允许1表示不允许
            "duration": duration,  //显示时长，整数，单位为s；单页面时用户可设置显示时长，多页面不存在请传-1
            "enterType": args.enterType // 进入方式
        }
    }, function (err, data) {
        db.close();
        if (!err && data != null) {
            Response.end(JSON.stringify({
                "status": "0",
                "msg": "修改成功",
                "data": {
                    "status": 0
                }
            }));
        } else {
            Response.end(JSON.stringify({
                "status": "0",
                "msg": "修改失败",
                "data": {
                    "status": 1
                }
            }));
        }
    });
}

exports.Runner = run;


                                

	

