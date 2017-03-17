/*------------------------------------------------------------
 // Copyright (C) 2015 正益无线（北京）科技有限公司  版权所有。
 // 文件名：
 // 文件功能描述：
 //
 // 创 建 人：陈恺垣
 // 创建日期：15/10/04
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
var BaseJurisdictionUserModel = null;
function run(Param, Robot, Request, Response, IF) {
    Response.setHeader("Content-type", "text/json;charset=utf-8");

    conn = mongoose.createConnection(global.mongodbURL);
    BaseJurisdictionModel = conn.model("base_jurisdiction", baseSchema.BaseJurisdiction);
    BaseJurisdictionUserModel = conn.model("base_jurisdiction_user", baseSchema.BaseJurisdictionUser);

    var cookies = parseCookie(Request.headers.cookie);
    var opUserId = cookies['userid'];
    var args = JSON.parse(Param.body.toString());
    var userId = args.userId;
    var jurisdictionId = args.jurisdictionId;
    var fullName = args.fullName;
    var abbreviation = args.abbreviation;
    var _id = args._id;
    var op = args.op;

    if (op == 'getByUserId') {
        getDataByUserId(Response, opUserId, userId);
        return;
    }


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
                            updateData(Response, opUserId, userId, jurisdictionId, fullName, abbreviation, _id);
                            break;
                        case 'delete':
                            deleteData(Response, opUserId, _id);
                            break;
                        case 'add':
                            addData(Response, opUserId, userId, jurisdictionId, fullName, abbreviation);
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
 * 增加用户权限
 * @param Response
 * @param opUserId
 * @param userId
 * @param jurisdictionId
 * @param fullName
 * @param abbreviation
 */
function addData(Response, opUserId, userId, jurisdictionId, fullName, abbreviation) {
    var value = {
        userId: userId,
        level: abbreviation == 'admin' ? 0 : 1,
        jurisdictionId: jurisdictionId,
        abbreviation: abbreviation,
        createTime: new Date().getTime()
    };
    async.series([
        function (cb) {
            BaseJurisdictionModel.aggregate([
                    {
                        $match: {
                            fullName: fullName,
                            abbreviation: abbreviation
                        }
                    }
                ],
                function (err, res) {
                    if (err == null) {
                        if (res.length > 0) {
                            cb(null, res);
                        } else {
                            cb("权限不存在", null);
                        }
                    } else {
                        cb(err, null);
                    }
                }
            );
        },
        function (cb) {
            var BaseJurisdictionUser = new BaseJurisdictionUserModel(value);
            BaseJurisdictionUser.save(function (err, product, numberAffected) {
                if (err == null) {
                    if (numberAffected > 0) {
                        cb(null, product);
                    } else {
                        cb("保存失败", null)
                    }
                } else {
                    cb(err, null);
                }
            });
        }
    ], function (err, results) {
        conn.close();
        if (err == null) {
            var result = {
                _id: results[1]._id,
                userId: results[1].userId,
                jurisdictionId: results[1].jurisdictionId,
                fullName: fullName,
                abbreviation: results[1].abbreviation
            };
            Response.end(JSON.stringify({
                "status": 0,
                "msg": "保存成功",
                "data": result
            }));

            util.saveJurisdictionLog({
                type: 4,
                ids: [results[1]._id],
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
                type: 4,
                ids: [],
                opUserId: opUserId,
                params: value,
                result: {},
                status: 1,
                description: err
            });
        }
    })

}

/**
 * 删除用户权限
 * @param Response
 * @param opUserId
 * @param _id
 */
function deleteData(Response, opUserId, _id) {
    BaseJurisdictionUserModel.findById(_id, function (err1, product1) {
        if (err1 == null && (product1.abbreviation != "admin" || product1.userId != opUserId)) {
            product1.remove(function (err2, product2) {
                conn.close();
                if (err2 == null) {
                    Response.end(JSON.stringify({
                        "status": 0,
                        "msg": "删除成功",
                        "data": {
                            _id: product2._id,
                            userId: product2.userId,
                            jurisdictionId: product2.jurisdictionId,
                            abbreviation: product2.abbreviation
                        }
                    }));

                    util.saveJurisdictionLog({
                        type: 5,
                        ids: [_id],
                        opUserId: opUserId,
                        params: {},
                        result: {
                            _id: product2._id,
                            userId: product2.userId,
                            jurisdictionId: product2.jurisdictionId,
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
                        type: 5,
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
                type: 5,
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
 * 修改用户权限
 * @param Response
 * @param opUserId
 * @param userId
 * @param jurisdictionId
 * @param fullName
 * @param abbreviation
 * @param _id
 */
function updateData(Response, opUserId, userId, jurisdictionId, fullName, abbreviation, _id) {
    var value = {
        userId: userId,
        jurisdictionId: jurisdictionId,
        abbreviation: abbreviation
    };
    async.series([
        function (cb) {
            BaseJurisdictionModel.aggregate([
                    {
                        $match: {
                            fullName: fullName,
                            abbreviation: abbreviation
                        }
                    }
                ],
                function (err, res) {
                    if (err == null) {
                        if (res.length > 0) {
                            cb(null, res);
                        } else {
                            cb("权限不存在", null);
                        }
                    } else {
                        cb(err, null);
                    }
                }
            );
        },
        function (cb) {
            BaseJurisdictionUserModel.update({
                _id: _id
            }, value, function (err, rawResponse) {
                if (err == null) {
                    if (rawResponse > 0) {
                        cb(null, rawResponse);
                    } else {
                        cb("更新失败", null)
                    }
                } else {
                    cb(err, null);
                }
            });
        }
    ], function (err, results) {
        conn.close();
        if (err == null) {
            Response.end(JSON.stringify({
                "status": 0,
                "msg": "更新成功",
                "data": results[1].rawResponse
            }));

            util.saveJurisdictionLog({
                type: 6,
                ids: [_id],
                opUserId: opUserId,
                params: value,
                result: {
                    rawResponse: results[1].rawResponse
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
                type: 6,
                ids: [_id],
                opUserId: opUserId,
                params: value,
                result: {},
                status: 1,
                description: err
            });
        }
    })
}

/**
 * 分页获取用户权限
 * @param Response
 * @param opUserId
 * @param pageNum
 * @param pageSize
 */
function getDataByPage(Response, opUserId, pageNum, pageSize) {
    async.parallel([
        function (cb) {
            BaseJurisdictionUserModel.aggregate([
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
                                userId: res[i].userId,
                                level: res[i].level,
                                jurisdictionId: res[i].jurisdictionId,
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
            BaseJurisdictionUserModel.count({}, function (err, count) {
                if (err == null) {
                    cb(null, count);
                } else {
                    cb(err, null);
                }
            });
        },
        function (cb) {
            BaseJurisdictionModel.aggregate([
                    {
                        $sort: {
                            level: 1,
                            createTime: 1
                        }
                    }
                ],
                function (err, res) {
                    if (err == null) {
                        var result = [{}, []];
                        for (var i = 0; i < res.length; i++) {
                            result[0][res[i]._id] = {
                                level: res[i].level,
                                fullName: res[i].fullName,
                                abbreviation: res[i].abbreviation
                            };
                            result[1].push({
                                _id: res[i]._id,
                                level: res[i].level,
                                fullName: res[i].fullName,
                                abbreviation: res[i].abbreviation
                            })
                        }
                        cb(null, result);
                    } else {
                        cb(err, null);
                    }
                }
            );
        }
    ], function (err, results) {
        conn.close();
        if (err == null) {
            var result1 = results[0];
            var result2 = results[1];
            var result3 = results[2];
            var ids = [];
            for (var i = 0; i < result1.length; i++) {
                ids.push(result1[i]._id);

                var jurisdictionId = result1[i].jurisdictionId;
                if (result3[0][jurisdictionId] == null) {
                    result1[i].fullName = "";
                } else {
                    result1[i].fullName = result3[0][jurisdictionId].fullName;
                }
            }

            Response.end(JSON.stringify({
                "status": 0,
                "msg": "查询成功",
                "data": {
                    count: result2,
                    result: result1,
                    jurisdictions: result3[1]
                }
            }));

            util.saveJurisdictionLog({
                type: 7,
                ids: ids,
                opUserId: opUserId,
                params: {
                    pageNum: pageNum,
                    pageSize: pageSize
                },
                result: {
                    count: result2,
                    result: result1,
                    jurisdictions: result3[1]
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
                type: 7,
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
 * 根据用户 id 判断用户所拥有的权限
 * @param Response
 * @param opUserId
 * @param userId
 */
function getDataByUserId(Response, opUserId, userId) {
    BaseJurisdictionUserModel.aggregate([
            {
                $match: {
                    userId: userId
                }
            }
        ],
        function (err, res) {
            conn.close();
            if (err == null) {
                var result = {};
                for (var i = 0; i < res.length; i++) {
                    result[res[i].abbreviation] = 1;
                }
                Response.end(JSON.stringify({
                    "status": 0,
                    "msg": "查询成功",
                    "data": result
                }));
            } else {
                Response.end(JSON.stringify({
                    "status": 1,
                    "msg": "查询失败",
                    "err": err
                }));
            }

        }
    );
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


                                

	

