var MEAP = require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../BaseSchema.js");

// 获取欢迎页图片包信息，并支持分页
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
                    getData(Response, args, db);
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

function getData(Response, args, db) {
    var pageSize = args.pageSize ? args.pageSize : 10;  // 每页条数 默认为10
    var pageNum = args.pageNum ? args.pageNum : 1;  // 页数 默认为1
    var skip = (pageNum - 1) * pageSize;  // 跳过条数，用于MongoDB分页

    var BaseWelcomePackageModel = db.model("baseWelcomePackage", sm.BaseWelcomePackage);
    BaseWelcomePackageModel.count(function (err, count) {
        if (err == null && count != null) {
            BaseWelcomePackageModel.find().skip(skip).limit(pageSize).sort({
                "id": -1 // 按id逆序
            }).exec(
                function (err, doc) {
                    db.close();
                    if (!err && doc != null) {
                        Response.end(JSON.stringify({
                            "status": "0",
                            "msg": "查询成功",
                            "data": {
                                "count": count,
                                "packages": doc
                            }
                        }));
                    } else {
                        Response.end(JSON.stringify({
                            "status": "0",
                            "msg": "查询失败",
                            "data": ""
                        }));
                    }
                });
        } else {
            Response.end(JSON.stringify({
                "status": "1",
                "msg": "error"
            }));
        }
    });
}

exports.Runner = run;


                                

	

