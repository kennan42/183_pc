var MEAP = require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../BaseSchema.js");

// 新建欢迎页图片包
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
                    createData(Param, Robot, Request, Response, IF, args, db);
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


function createData(Param, Robot, Request, Response, IF, args, db) {
    var BaseCountModel = db.model("baseCount", sm.BaseCount);
    // 实现自增ID
    BaseCountModel.findOneAndUpdate({
            "name": "welcomePackage"
        }, {
            "$inc": {
                "seq": 1  // 自增加一
            }
        },
        function (err, data) {
            // 若baseCount集合中welcomePackage文档不存在就新建
            // 若baseCount集合中welcomePackage文档存在就加一
            // findOneAndUpdate具有原子性
            if (err == null && data == null) {
                var BaseCountEntity = new BaseCountModel({
                    "name": "welcomePackage",
                    "seq": 100000 // 默认值是100000
                });
                BaseCountEntity.save(function (err, data) {
                    if (err == null && data != null) {
                        var id = data.seq;
                        create(Param, Robot, Request, Response, IF, id, args, db);
                    } else {
                        errInfo(Response);
                    }
                });
            } else if (err == null && data != null) {
                var id = data.seq;
                create(Param, Robot, Request, Response, IF, id, args, db);
            } else {
                errInfo(Response);
            }
        }
    );
}

/**
 *  创建图片包
 * @param Param
 * @param Robot
 * @param Request
 * @param Response
 * @param IF
 * @param id 图片包ID
 */
function create(Param, Robot, Request, Response, IF, id, args, db) {
    var duration = args.duration;
    // 只有单张图片的时候才会有显示时长，否则设置为-1
    if (args.images.length != 1) {
        duration = -1;
    }
    // id为100000的优先级为0,有效时间为2105到9999
    if (id == 100000) {
        args.priority = 0;
        args.beginTime = new Date("2015", "0", "1", "0", "0", "0").getTime();
        args.endTime = new Date("9999", "11", "31", "23", "59", "59").getTime();
    }
    if (args.beginTime == args.endTime) {
        errInfo(Response);
        return;
    }
    var BaseWelcomePackageModel = db.model("baseWelcomePackage", sm.BaseWelcomePackage);
    var BaseWelcomePackageEntity = new BaseWelcomePackageModel({
        "appId": "tianxin",  //appID用于识别应用
        "id": id,  //自增id，100000开始；100000为默认
        "images": args.images,  //欢迎页图片的URL
        "thumbnails": args.thumbnails,  //欢迎页图片缩略图的URL
        "description": args.description, //图片包描述
        "status": 0,  //图片包状态，0表示启用1表示停用
        "beginTime": args.beginTime,  //生效日期，Unix时间戳单位为ms
        "endTime": args.endTime,  //失效日期，Unix时间戳单位为ms
        "priority": args.priority,  //优先级，整数，范围1-9，1最低，9最高；id为100000的图片优先级为0，不可修改
        "skip": args.skip,  //是否允许跳过，0表示允许1表示不允许
        "duration": duration,  //显示时长，整数，单位为s；单页面时用户可设置显示时长，多页面不存在请传-1
        "createTime": new Date().getTime(),  //创建日期，，Unix时间戳单位为ms
        "userId": args.userId,  //创建者的用户名
        "enterType": args.enterType // 进入方式
    });
    BaseWelcomePackageEntity.save(function (err, doc) {
        db.close();
        if (!err && doc != null) {
            Response.end(JSON.stringify({
                "status": "0",
                "msg": "保存成功",
                "data": {
                    "status": 0
                }
            }));
        } else {
            Response.end(JSON.stringify({
                "status": "0",
                "msg": "保存失败",
                "data": {
                    "status": 1
                }
            }));
        }
    });
}

/**
 * 错误信息
 * @param Response
 */
function errInfo(Response) {
    Response.end(JSON.stringify({
        "status": "1",
        "msg": "error"
    }));
}

exports.Runner = run;


                                

	

