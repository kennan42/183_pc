var MEAP = require("meap");
var mongoose = require("mongoose");
var baseSchema = require("../BaseSchema");
var async = require("async");

var conn = null;
var downtimeInterfaceModel = null;

/**
 * 停机接口管理
 *
 * @param Param
 * @param Robot
 * @param Request
 * @param Response
 * @param IF
 */
function run(Param, Robot, Request, Response, IF) {
    Response.setHeader("Content-type", "text/json;charset=utf-8");

    conn = mongoose.createConnection(global.mongodbURL, {replset: {poolSize: 1}});
    var BaseJurisdictionUserModel = conn.model("base_jurisdiction_user", baseSchema.BaseJurisdictionUser);
    downtimeInterfaceModel = conn.model("base_downtime_interface", baseSchema.downtimeInterface);

    var args = JSON.parse(Param.body.toString());

    var userId = args.userId;
    var op = args.op;
    var _id = args._id;
    var description = args.description;
    var name = args.name;
    var pageNum = args.pageNum;
    var pageSize = args.pageSize;

    // 判断权限
    BaseJurisdictionUserModel.aggregate([
            {
                $match: {
                    userId: userId,
                    abbreviation: "downtimeNotice"
                }
            }
        ],
        function (err, res) {
            if (err == null) {
                if (res.length > 0) {
                    // 有权限

                    switch (op) {
                        case "add":
                            addData(Response, description, name);
                            break;
                        case "delete":
                            deleteData(Response, _id);
                            break;
                        case "update":
                            updateData(Response, _id, description);
                            break;
                        case "getByPage":
                            getByPage(Response, pageNum, pageSize);
                            break;
                        case "getAll":
                            getAll(Response);
                            break;
                        default:
                            Response.end(JSON.stringify({
                                status: "1",
                                msg: "参数错误"
                            }));
                    }
                } else {
                    conn.close();
                    Response.end(JSON.stringify({
                        status: -1,
                        msg: "没有权限"
                    }));
                }
            } else {
                conn.close();
                Response.end(JSON.stringify({
                    status: 1,
                    msg: "权限检查发生错误"
                }));
            }
        }
    );
}

/**
 * 新增停机接口
 *
 * @param Response
 * @param description
 * @param name
 */
function addData(Response, description, name) {
    var value = {
        description: description,
        name: name,
        createTime: new Date().getTime()
    };
    var downtimeInterface = new downtimeInterfaceModel(value);
    downtimeInterface.save(function (err, product, numberAffected) {
        conn.close();
        if (err == null && numberAffected > 0) {
            var result = {
                _id: product._id,
                description: product.description,
                name: product.name
            };
            Response.end(JSON.stringify({
                status: 0,
                msg: "保存成功",
                data: result
            }));
        } else {
            Response.end(JSON.stringify({
                status: 1,
                msg: "保存失败",
                "err": err
            }));
        }
    });


}

/**
 * 删除停机接口
 *
 * @param Response
 * @param _id
 */
function deleteData(Response, _id) {
    downtimeInterfaceModel.findById(_id, function (err1, product1) {
        if (err1 == null) {
            product1.remove(function (err2, product2) {
                conn.close();
                if (err2 == null) {
                    Response.end(JSON.stringify({
                        status: 0,
                        msg: "删除成功",
                        data: {
                            _id: product2._id,
                            description: product2.description,
                            name: product2.name
                        }
                    }));
                } else {
                    Response.end(JSON.stringify({
                        status: 1,
                        msg: "删除失败",
                        "err": err2
                    }));
                }
            })
        } else {
            conn.close();
            Response.end(JSON.stringify({
                status: 1,
                msg: "删除失败",
                "err": err1
            }));
        }
    });
}

/**
 * 更新停机接口
 *
 * @param Response
 * @param _id
 * @param description
 */
function updateData(Response, _id, description) {
    downtimeInterfaceModel.update({
        _id: _id
    }, {
        description: description
    }, function (err, rawResponse) {
        conn.close();
        if (err == null && rawResponse > 0) {
            Response.end(JSON.stringify({
                status: 0,
                msg: "更新成功",
                data: rawResponse
            }));
        } else {
            Response.end(JSON.stringify({
                status: 1,
                msg: "更新失败",
                "err": err
            }));
        }
    });
}

/**
 * 分页获取停机接口
 *
 * @param Response
 * @param pageNum
 * @param pageSize
 */
function getByPage(Response, pageNum, pageSize) {
    // 分别获取总数和接口列表
    async.parallel([
        function (cb) {
            downtimeInterfaceModel.aggregate([
                    {
                        $sort: {
                            createTime: -1
                        }
                    }, {
                        $skip: (pageNum - 1) * pageSize
                    }, {
                        $limit: pageSize
                    }
                ],
                function (err, res) {
                    if (err == null) {
                        var result = [];
                        for (var i = 0; i < res.length; i++) {
                            result.push({
                                _id: res[i]._id,
                                description: res[i].description,
                                name: res[i].name
                            });
                        }
                        cb(null, result);
                    } else {
                        cb(err, null);
                    }
                }
            );
        },
        function (cb) {
            downtimeInterfaceModel.count({}, function (err, count) {
                if (err == null) {
                    cb(null, count);
                } else {
                    cb(err, null);
                }
            });
        }
    ], function (err, results) {
        conn.close();
        if (err == null) {
            Response.end(JSON.stringify({
                status: 0,
                msg: "查询成功",
                data: {
                    count: results[1],
                    result: results[0]
                }
            }));

            var ids = [];
            for (var i = 0; i < results[0].length; i++) {
                ids.push(results[0][i]._id);
            }
        } else {
            Response.end(JSON.stringify({
                status: 1,
                msg: err
            }));
        }
    });
}

/**
 * 获取全部接口列表
 *
 * @param Response
 */
function getAll(Response) {
    downtimeInterfaceModel.find({}, function (err, docs) {
        conn.close();
        if (err == null) {
            Response.end(JSON.stringify({
                status: 0,
                msg: "查询成功",
                data: docs
            }));
        } else {
            Response.end(JSON.stringify({
                status: 1,
                msg: err
            }));
        }
    });
}

exports.Runner = run;