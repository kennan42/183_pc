var MEAP = require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var baseSchema = require("./BaseSchema.js");
var async = require("async");

var util = {
    //查询元素在数据里的索引，如果不存在，择返回-1
    inArray: function (e, arr) {
        if (e == null || arr == null) {
            return -1;
        }
        for (var i in arr) {
            if (arr[i] == e) {
                return i;
            }
        }
        return -1;
    },
    //删除第一个数组中的元素e
    removeElementFromArray: function (e, arr) {
        var index = this.inArray(e, arr);
        if (index != -1) {
            arr.splice(index, 1);
        }
    },
    //删除数组中出现的所有元素e
    removeAllElementFromArray: function (e, arr) {
        var index = -1;
        while (true) {
            index = this.inArray(e, arr);
            if (index != -1) {
                arr.splice(index, 1);
                removeAllElementFromArray(e, arr);
            } else {
                return;
            }
        }
    },
    //判断一个数组的元素是否全在另一个数组里 arr1小数组 arr2大数组,只适用于简单对象
    containArray: function (arr1, arr2) {
        var num = 0;
        if (arr1 == null || arr2 == null) {
            return false;
        }
        if (arr1.length > arr2.length) {
            return false;
        }
        for (var i in arr1) {
            for (var j in arr2) {
                if (arr1[i] == arr2[j]) {
                    num++;
                }
            }
        }
        if (num == arr1.length) {
            return true;
        } else {
            return false;
        }
    },
    /**
     根据时间戳获取格式化的日期字符串
     times:时间戳
     showTime:true返回时间
     */
    getDateStrFromTimes: function (times, showTime) {
        var date = new Date();
        date.setTime(times);
        var year = date.getFullYear();
        var month = date.getMonth();
        month += 1;
        if (month < 10) {
            month = '0' + month;
        }
        var date1 = date.getDate();
        if (date1 < 10) {
            date1 = '0' + date1;
        }
        if (!showTime) {
            return year + '-' + month + '-' + date1;
        } else {
            var hours = date.getHours();
            if (hours < 10) {
                hours = '0' + hours;
            }
            var minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            var seconds = date.getSeconds();
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            return year + '-' + month + '-' + date1 + ' ' + hours + ':' + minutes + ":" + seconds;
        }
    },
    //根据date获取格式化的日期字符串
    getDateStrFromDate: function (date, showTime) {
        var times = date.getTime();
        return getDateStrFromTimes(times, showTime);
    },
    getDateStrFromTimes2: function (times, showHour, showMinute, showSecond) {
        var rs = "";
        var date = new Date();
        date.setTime(times);
        var year = date.getFullYear();
        var month = date.getMonth();
        month += 1;
        if (month < 10) {
            month = '0' + month;
        }
        var date1 = date.getDate();
        if (date1 < 10) {
            date1 = '0' + date1;
        }
        rs = year + "-" + month + "-" + date1;
        if (showHour) {
            var hour = date.getHours() + 100 + '';
            rs += ' ' + hour.substr(1, 2);
        }
        if (showHour && showMinute) {
            var minute = date.getMinutes() + 100 + '';
            rs += ':' + minute.substr(1, 2);
        }
        if (showHour && showMinute && showSecond) {
            var second = date.getSeconds() + 100 + '';
            rs += ':' + second.substr(1, 2);
        }
        return rs;

    },
    //根据时间戳得到时间格式MM-dd HH:mm
    getMMddHHmmFromTimes: function (times) {
        var date = new Date();
        date.setTime(times);
        var month = date.getMonth() + 1 + "";
        var curDate = date.getDate() + "";
        var hour = date.getHours() + 100 + "";
        var minute = date.getMinutes() + 100 + "";
        return month + "月" + curDate + "日  " + hour.substr(-2) + ":" + minute.substr(-2);
    },
    pushMsg: function (arg) {
        var num = 0;
        async.parallel([
            //根据userId查询softToken
            function (callback) {
                var userId = arg.userCodeListStr;
                var sql = " SELECT deviceToken,softToken,pushType from BindUser " + " where userId = '" + userId + "' ORDER BY createdAt desc limit 0,1";
                var option = {
                    CN: "Dsn=mysql-emm",
                    sql: sql
                };
                MEAP.ODBC.Runner(option, function (err, rows, cols) {
                    if (!err && rows != null && rows.length > 0) {
                        var softToken = rows[0].softToken;
                        var deviceToken = rows[0].deviceToken;
                        var pushType = rows[0].pushType;
                        if (pushType != null && pushType == "mqtt") {
                            arg.platforms = "1";
                            arg.softToken = softToken;
                        } else {
                            arg.platforms = "0";
                            arg.softToken = deviceToken;
                        }
                        callback(null, "0");
                        //进行推送
                    } else {
                        callback(null, "-1");
                        //无法推送
                    }
                });
            },
            function (callback) {
                var paramJSon = {
                    "IS_PUBLIC": {
                        "FLOWNO": "",
                        "PERNR": "",
                        "ZDOMAIN": "400"
                    },
                    "P_SP_PERNR": arg.userCodeListStr,
                    "P_SP_STATUS": 0
                };
                var option = {
                    method: "POST",
                    url: global.baseURL + "/zhrws/ZHRWS_GET_OT_CO_LINES",
                    Body: paramJSon
                };

                MEAP.AJAX.Runner(option, function (err, res, data) {
                    if (!err) {
                        data = JSON.parse(data);
                        var num1 = data.E_2005;
                        var num2 = data.E_2011;
                        callback(err, parseInt(num1) + parseInt(num2));
                    } else {
                        callback(err, 0);
                    }

                });

            },
            function (callback) {
                var paramJSon = {
                    "input": {
                        "channelSerialNo": new Date().getTime(), //序列号
                        "currUsrId": arg.userCodeListStr, //员工号
                        "domain": "400",
                        "extendMap": {
                            "entry": [{
                                "Key": "",
                                "Value": ""
                            }]
                        },
                        "qryType": "4",
                        "userId": arg.userCodeListStr,
                        "lastTime": "", //获取当天日期
                        "bussType": "2001", //代表休假待审列表
                        "startPage": 1,
                        "pageSize": 1000
                    }
                };

                var option = {
                    method: "POST",
                    url: global.baseURL + "/portal/PORTAL_BPMI_TaskListQry",
                    Body: paramJSon
                };
                MEAP.AJAX.Runner(option, function (err, res, data) {
                    if (!err) {
                        data = JSON.parse(data);
                        if (data.output.type == "S") {
                            callback(err, parseInt(data.output.totalCount));
                        } else {
                            callback(err, 0);
                        }
                    } else {
                        callback(err, 0);
                    }
                });

            },
            //查询会议室的带审批的数量
            function (cb) {
                var option = {
                    url: global.baseURL + "/meet/examine",
                    method: "post",
                    Body: {
                        "state": "0",
                        "pageNumber": 1,
                        "pageSize": 1,
                        "userId": arg.userCodeListStr
                    }
                };
                MEAP.AJAX.Runner(option, function (err, res, data) {
                    if (!err) {
                        var data = JSON.parse(data);
                        cb(null, data.count);
                    } else {
                        cb(null, 0);
                    }
                });
            },
            //查看文档平台的代办的数量
            function (cb) {
                var option = {
                    url: global.baseURL + "/docPlatform/PORTALBPMIWaitTaskNumImplBean",
                    method: "post",
                    Body: {
                        "input": {
                            "channelSerialNo": new Date().getTime(), // 时间戳 + 123456789
                            "currUsrId": arg.userCodeListStr,
                            "domain": 400,
                            "reqUsrId": arg.userCodeListStr
                        }
                    }
                };
                MEAP.AJAX.Runner(option, function (err, res, data) {
                    if (!err) {
                        data = JSON.parse(data);
                        var num1 = parseInt(data.output.fmsSaveWTNum) + parseInt(data.output.fmsReadWTNum) + parseInt(data.output.fmsDestWTNum);
                        cb(null, num1);
                    } else {
                        cb(null, 0);
                    }
                });
            }], function (err, data) {
            var data0 = data[0];
            if (data0 != "-1") {//推送
                num = data[1] + data[2] + data[3] + data[4];
                arg.badgeNum = num;
                if (arg.title.length > 40) {
                    var subTitle = arg.title.substr(0, 40) + "...";
                    arg.title = subTitle;
                }
                var option = {
                    method: "POST",
                    url: global.pushURL,
                    Body: arg,
                    Enctype: "application/x-www-form-urlencoded"
                };
                MEAP.AJAX.Runner(option, function (err, res, data) {
                    console.log("push result--->", data);
                    var pushResult = JSON.parse(data);
                    var status = pushResult.status;
                    if (status == "ok") {
                        savePushMsgLog(arg);
                    }
                }, null);
            } else {
                console.log("no user to push msg");
            }
        });
    },
    sendRTXMsg: function (arg) {
        var rtxId = null;
        async.series([
            //根据用户id查询RTX账号
            function (cb) {
                var option = {
                    method: "POST",
                    url: global.baseURL + "/zhrws/zhrwsmss11",
                    Body: {
                        "P_DATE": "",
                        "P_PERNR": {
                            "item": [{
                                "PERNR": arg.userId
                            }]
                        }
                    }
                };
                MEAP.AJAX.Runner(option, function (err, res, data) {
                    if (!err) {
                        data = JSON.parse(data);
                        if (data.BASE_INFO.item != null && data.BASE_INFO.item.length > 0) {
                            rtxId = data.BASE_INFO.item[0].RTX;
                            cb(null, "");
                        } else {
                            console.log("没有查询到RTX账号信息");
                        }
                    }
                });
            },
            //RTX推送
            function (cb) {
                var msg = {
                    "tns:strReceiver": rtxId,
                    "tns:MESSAGE_ID": new Date().getTime(),
                    "tns:bstrMsg": arg.title
                };
                var wsdl = "http://192.168.2.28:8234/SendNotifyWebService.asmx?wsdl";
                if (global.wsdl == "wsdl_pro") {
                    wsdl = "http://172.16.0.2:8234/SendNotifyWebService.asmx?wsdl";
                }
                var option = {
                    wsdl: wsdl,
                    func: "SendNotifyWebService.SendNotifyWebServiceSoap.SendNotify",
                    Params: msg
                };

                MEAP.SOAP.Runner(option, function (err, res, data) {
                });
            }]);
    }
};

//保存推送消息记录
function savePushMsgLog(arg) {
    var db = mongoose.createConnection(global.mongodbURL);
    var basePushMessageLogModel = db.model("basePushMessageLog", baseSchema.BasePushMessageLogSchema);
    var basePushMessageLogEntity = new basePushMessageLogModel({
        appId: arg.appId,
        userId: arg.userCodeListStr,
        title: arg.title,
        body: arg.body,
        pushTime: new Date().getTime(),
        readStatus: 0,
        module: arg.module,
        subModule: arg.subModule
    });
    basePushMessageLogEntity.save(function (err) {
        db.close();
    });
}

/**
 * 权限相关操作的日志
 * @param option
 *
 * @author 陈恺垣
 */
function saveJurisdictionLog(option) {
    var conn = mongoose.createConnection(global.mongodbURL);
    var BaseJurisdictionLogModel = conn.model("base_jurisdiction_log", baseSchema.BaseJurisdictionLog);

    new BaseJurisdictionLogModel({
        type: option.type,
        ids: option.ids,
        opUserId: option.opUserId,
        params: JSON.stringify(option.params),
        result: JSON.stringify(option.result),
        status: option.status,
        description: option.description,
        createTime: new Date().getTime()
    }).save(function (err, res) {
            conn.close();
        }
    );
}

exports.inArray = util.inArray;
exports.removeElementFromArray = util.removeElementFromArray;
exports.removeAllElementFromArray = util.removeAllElementFromArray;
exports.getDateStrFromTimes = util.getDateStrFromTimes;
exports.getDateStrFromDate = util.getDateStrFromDate;
exports.pushMsg = util.pushMsg;
exports.getDateStrFromTimes2 = util.getDateStrFromTimes2;
exports.getMMddHHmmFromTimes = util.getMMddHHmmFromTimes;
exports.sendRTXMsg = util.sendRTXMsg;
exports.saveJurisdictionLog = saveJurisdictionLog;