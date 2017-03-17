var MEAP = require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../BaseSchema.js");

// 设置欢迎页图片包状态
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
                    changeData(Response, args, db);
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

function changeData(Response, args, db) {
    var BaseWelcomePackageModel = db.model("baseWelcomePackage", sm.BaseWelcomePackage);
    var id = args.packageId ? args.packageId : 99999;  // id从100000开始，故不存在时取99999
    var status = parseInt(args.status);  // 0表示启用1表示停用
    // 设置的状态只有0、1，0表示启用1表示停用
    if (isNaN(status) || (status != 1 && status != 0) || id == 100000) {
        db.close();
        Response.end(JSON.stringify({
            "status": "1",
            "msg": "error"
        }));
    } else {
        // 根据图片包ID查询并修改状态
        BaseWelcomePackageModel.update({
            "id": id
        }, {
            "$set": {
                "status": status
            }
        }, function (err, data) {
            db.close();
            if (!err && data != null) {
                Response.end(JSON.stringify({
                    "status": "0",
                    "msg": "设置成功",
                    "data": {
                        "status": 0
                    }
                }));
            } else {
                Response.end(JSON.stringify({
                    "status": "0",
                    "msg": "设置失败",
                    "data": {
                        "status": 1
                    }
                }));
            }
        });
    }
}

exports.Runner = run;



