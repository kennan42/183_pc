/*------------------------------------------------------------
 // Copyright (C) 2015 正益无线（北京）科技有限公司  版权所有。
 // 文件名：
 // 文件功能描述：
 //
 // 创 建 人：陈恺垣
 // 创建日期：15/9/22
 //
 // 修 改 人：
 // 修改日期：
 // 修改描述：
 //-----------------------------------------------------------*/

var MEAP = require("meap");
var async = require("async");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var baseSchema = require("../BaseSchema.js");
var util = require("../util");

var conn = null;
var BaseJurisdictionModel = null;
function run(Param, Robot, Request, Response, IF) {
    Response.setHeader("Content-type", "text/json;charset=utf-8");

    conn = mongoose.createConnection(global.mongodbURL);
    BaseJurisdictionModel = conn.model("base_jurisdiction", baseSchema.BaseJurisdiction);
    var BaseJurisdictionUserModel = conn.model("base_jurisdiction_user", baseSchema.BaseJurisdictionUser);

    var cookies = parseCookie(Request.headers.cookie);
    var opUserId = cookies['userid'];
    var args = JSON.parse(Param.body.toString());
    var fullName = args.fullName;
    var abbreviation = args.abbreviation;
    var _id = args._id;
    var op = args.op;

    // 检查是否有权限
    BaseJurisdictionUserModel.aggregate([
            {
                $match: {
                    userId: opUserId,
                    abbreviation: "admin"
                }
            }
        ],
        function (err, res) {
            if (err == null) {
                if (res.length > 0) {
                    switch (op) {
                        case 'update':
                            updateData(Response, opUserId, fullName, abbreviation, _id);
                            break;
                        case 'delete':
                            deleteData(Response, opUserId, _id);
                            break;
                        case 'add':
                            addData(Response, opUserId, fullName, abbreviation);
                            break;
                        case 'getByPage':
                            var pageNum = args.pageNum;
                            var pageSize = args.pageSize;
                            getDataByPage(Response, opUserId, pageNum, pageSize);
                            break;
                        default :
                            conn.close();
                            Response.end(JSON.stringify({
                                "status": 1,
                                "msg": "参数错误"
                            }));
                    }
                } else {
                    conn.close();
                    Response.end(JSON.stringify({
                        "status": -1,
                        "msg": "没有权限"
                    }));
                    util.saveJurisdictionLog({
                        type: -1,
                        ids: [],
                        opUserId: opUserId,
                        params: args,
                        result: {},
                        status: 1,
                        description: "无权限"
                    });
                }

            } else {
                conn.close();
                Response.end(JSON.stringify({
                    "status": 1,
                    "msg": "权限检查发生错误"
                }));
            }
        }
    );
}

/**
 * 增加
 * @param Response
 * @param opUserId
 * @param fullName
 * @param abbreviation
 */
function addData(Response, opUserId, fullName, abbreviation) {
    var value = {
        level: 1,
        fullName: fullName,
        abbreviation: abbreviation,
        createTime: new Date().getTime()
    };
    var BaseJurisdiction = new BaseJurisdictionModel(value);
    BaseJurisdiction.save(function (err, product, numberAffected) {
        conn.close();
        if (err == null && numberAffected > 0) {
            var result = {
                id: product._id,
                fullName: product.fullName,
                abbreviation: product.abbreviation
            };
            Response.end(JSON.stringify({
                "status": 0,
                "msg": "保存成功",
                "data": result
            }));

            util.saveJurisdictionLog({
                type: 0,
                ids: [product._id],
                opUserId: opUserId,
                params: value,
                result: result,
                status: 0,
                description: "保存成功"
            });
        } else {
            Response.end(JSON.stringify({
                "status": 1,
                "msg": "保存失败",
                "err": err
            }));

            util.saveJurisdictionLog({
                type: 0,
                ids: [],
                opUserId: opUserId,
                params: value,
                result: {},
                status: 1,
                description: err
            });

        }
    });

}

/**
 * 删除
 * @param Response
 * @param opUserId
 * @param _id
 */
function deleteData(Response, opUserId, _id) {
    BaseJurisdictionModel.findById(_id, function (err1, product1) {
        if (err1 == null) {
            product1.remove(function (err2, product2) {
                conn.close();
                if (err2 == null) {
                    Response.end(JSON.stringify({
                        "status": 0,
                        "msg": "删除成功",
                        "data": {
                            id: product2._id,
                            fullName: product2.fullName,
                            abbreviation: product2.abbreviation
                        }
                    }));

                    util.saveJurisdictionLog({
                        type: 1,
                        ids: [_id],
                        opUserId: opUserId,
                        params: {},
                        result: {
                            id: product2._id,
                            fullName: product2.fullName,
                            abbreviation: product2.abbreviation
                        },
                        status: 0,
                        description: "删除成功"
                    });
                } else {
                    Response.end(JSON.stringify({
                        "status": 1,
                        "msg": "删除失败",
                        "err": err2
                    }));

                    util.saveJurisdictionLog({
                        type: 1,
                        ids: [_id],
                        opUserId: opUserId,
                        params: {},
                        result: {},
                        status: 1,
                        description: err2
                    });
                }
            })
        } else {
            conn.close();
            Response.end(JSON.stringify({
                "status": 1,
                "msg": "删除失败",
                "err": err1
            }));

            util.saveJurisdictionLog({
                type: 1,
                ids: [_id],
                opUserId: opUserId,
                params: {},
                result: {},
                status: 1,
                description: err1
            });
        }
    });

}

/**
 * 修改
 * @param Response
 * @param opUserId
 * @param fullName
 * @param abbreviation
 * @param _id
 */
function updateData(Response, opUserId, fullName, abbreviation, _id) {
    BaseJurisdictionModel.update({
        _id: _id
    }, {
        fullName: fullName,
        abbreviation: abbreviation
    }, function (err, rawResponse) {
        conn.close();
        if (err == null && rawResponse > 0) {
            Response.end(JSON.stringify({
                "status": 0,
                "msg": "更新成功",
                "data": rawResponse
            }));

            util.saveJurisdictionLog({
                type: 2,
                ids: [_id],
                opUserId: opUserId,
                params: {
                    fullName: fullName,
                    abbreviation: abbreviation
                },
                result: {
                    rawResponse: rawResponse
                },
                status: 0,
                description: "更新成功"
            });
        } else {
            Response.end(JSON.stringify({
                "status": 1,
                "msg": "更新失败",
                "err": err
            }));

            util.saveJurisdictionLog({
                type: 2,
                ids: [_id],
                opUserId: opUserId,
                params: {
                    fullName: fullName,
                    abbreviation: abbreviation
                },
                result: {},
                status: 1,
                description: err
            });
        }
    });
}

/**
 * 分页获取
 * @param Response
 * @param opUserId
 * @param pageNum
 * @param pageSize
 */
function getDataByPage(Response, opUserId, pageNum, pageSize) {
    async.parallel([
        function (cb) {
            BaseJurisdictionModel.aggregate([
                    {
                        $sort: {
                            level: 1,
                            createTime: 1
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
                                level: res[i].level,
                                fullName: res[i].fullName,
                                abbreviation: res[i].abbreviation
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
            BaseJurisdictionModel.count({}, function (err, count) {
                if (err == null) {
                    cb(null, count);
                } else {
                    cb(err, null);
                }
            });
        }
    ], function (err, results) {
        console.info("colse-1");
        conn.close();
        console.info("colse-2");
        if (err == null) {
            Response.end(JSON.stringify({
                "status": 0,
                "msg": "查询成功",
                "data": {
                    count: results[1],
                    result: results[0]
                }
            }));

            var ids = [];
            for (var i = 0; i < results[0].length; i++) {
                ids.push(results[0][i]._id);
            }

            util.saveJurisdictionLog({
                type: 3,
                ids: ids,
                opUserId: opUserId,
                params: {
                    pageNum: pageNum,
                    pageSize: pageSize
                },
                result: {
                    count: results[1],
                    result: results[0]
                },
                status: 0,
                description: "查询成功"
            });
        } else {
            Response.end(JSON.stringify({
                "status": 1,
                "msg": "查询失败",
                "err": err
            }));

            util.saveJurisdictionLog({
                type: 3,
                ids: [],
                opUserId: opUserId,
                params: {
                    pageNum: pageNum,
                    pageSize: pageSize
                },
                result: {},
                status: 1,
                description: err
            });
        }
    });
}

/**
 * 格式化 cookie
 * @param cookie
 * @returns {{}}
 */
function parseCookie(cookie) {
    var cookies = {};
    if (!cookie) {
        return cookies;
    }
    var list = cookie.split(";");
    for (var i = 0; i < list.length; i++) {
        var pair = list[i].split("=");
        cookies[pair[0].trim()] = pair[1].trim();
    }
    return cookies;
}

exports.Runner = run;


                                

	

