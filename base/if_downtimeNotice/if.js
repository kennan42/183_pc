var MEAP = require("meap");
var mongoose = require("mongoose");
var baseSchema = require("../BaseSchema");
var async = require("async");

var conn = null;
var downtimeNoticeModel = null;

/**
 * 停机公告管理
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
    downtimeNoticeModel = conn.model("base_downtime_notice", baseSchema.downtimeNotice);

    var args = JSON.parse(Param.body.toString());

    var userId = args.userId;
    var op = args.op;
    var _id = args._id;
    var title = args.title;
    var content = args.content;
    var interfaceArr = args.interfaceArr;
    var beginTime = args.beginTime;
    var endTime = args.endTime;
    var contactArr = args.contactArr;
    var pageNum = args.pageNum;
    var pageSize = args.pageSize;

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
                            addData(Response, title, content, interfaceArr, beginTime, endTime, contactArr);
                            break;
                        case "delete":
                            deleteData(Response, _id);
                            break;
                        case "update":
                            updateData(Response, _id, title, content, interfaceArr, beginTime, endTime, contactArr);
                            break;
                        case "getByPage":
                            getByPage(Response, pageNum, pageSize, Robot, userId);
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
 * 新增停机公告
 *
 * @param Response
 * @param title
 * @param content
 * @param interfaceArr
 * @param beginTime
 * @param endTime
 * @param contactArr
 */
function addData(Response, title, content, interfaceArr, beginTime, endTime, contactArr) {
    var value = {
        title: title,
        content: content,
        interfaceArr: interfaceArr,
        beginTime: beginTime,
        endTime: endTime,
        contactArr: contactArr,
        createTime: new Date().getTime()
    };
    var downtimeInterface = new downtimeNoticeModel(value);
    downtimeInterface.save(function (err, product, numberAffected) {
        conn.close();
        if (err == null && numberAffected > 0) {
            var result = {
                _id: product._id,
                title: product.title,
                content: product.content,
                interfaceArr: product.interfaceArr,
                beginTime: product.beginTime,
                endTime: product.endTime,
                contactArr: product.contactArr
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
 *  删除停机公告
 *
 * @param Response
 * @param _id
 */
function deleteData(Response, _id) {
    downtimeNoticeModel.findById(_id, function (err1, product1) {
        if (err1 == null) {
            product1.remove(function (err2, product2) {
                conn.close();
                if (err2 == null) {
                    Response.end(JSON.stringify({
                        status: 0,
                        msg: "删除成功",
                        data: {
                            _id: product2._id,
                            title: product2.title,
                            content: product2.content,
                            interfaceArr: product2.interfaceArr,
                            beginTime: product2.beginTime,
                            endTime: product2.endTime,
                            contactArr: product2.contactArr
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
 * 更新停机公告
 *
 * @param Response
 * @param _id
 * @param title
 * @param content
 * @param interfaceArr
 * @param beginTime
 * @param endTime
 * @param contactArr
 */
function updateData(Response, _id, title, content, interfaceArr, beginTime, endTime, contactArr) {
    downtimeNoticeModel.update({
        _id: _id
    }, {
        title: title,
        content: content,
        interfaceArr: interfaceArr,
        beginTime: beginTime,
        endTime: endTime,
        contactArr: contactArr
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
 * 分页获取停机公告
 *
 * @param Response
 * @param pageNum
 * @param pageSize
 */
function getByPage(Response, pageNum, pageSize, Robot, userId) {
    async.parallel([
        function (cb) {
            downtimeNoticeModel.aggregate([
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
                                title: res[i].title,
                                content: res[i].content,
                                interfaceArr: res[i].interfaceArr,
                                beginTime: res[i].beginTime,
                                endTime: res[i].endTime,
                                contactArr: res[i].contactArr
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
            downtimeNoticeModel.count({}, function (err, count) {
                if (err == null) {
                    cb(null, count);
                } else {
                    cb(err, null);
                }
            });
        },
        function (cb) {
            var option = {
                method: "POST",
                url: global.baseURL + "/base/downtimeInterface",
                Cookie: "true",
                Enctype: "application/json",
                Body: JSON.stringify({
                    userId: userId,
                    op: "getAll"
                })
            };

            MEAP.AJAX.Runner(option, function (err, res, data) {
                if (err != null) {
                    cb(err, {});
                    return
                }
                cb(err, JSON.parse(data));
            }, Robot);

        }
    ], function (err, results) {
        conn.close();
        if (err == null) {
            Response.end(JSON.stringify({
                status: 0,
                msg: "查询成功",
                data: {
                    count: results[1],
                    result: results[0],
                    interfaceArray: results[2].data
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

exports.Runner = run;