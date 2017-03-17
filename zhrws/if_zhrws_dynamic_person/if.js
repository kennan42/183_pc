/*------------------------------------------------------------
 // Copyright (C) 2016正益无线（北京）科技有限公司  版权所有。
 // 文件名：if.js
 // 文件功能描述： 根据工号查询联系人详细信息,封装了该接口
 //
 // 创 建 人：杨尚飞
 // 创建日期：2015.1.22
 //
 // 修 改 人：
 // 修改日期：
 // 修改描述：
 //-----------------------------------------------------------*/

var MEAP = require("meap");
var path = require("path");

function run(Param, Robot, Request, Response, IF) {
    var arg = JSON.parse(Param.body.toString());
    var option = {
        //wsdl:"http://cttqdev.cttq.com:8000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zhrws_dynamic_person/800/zhrws_dynamic_person/zhrws_dynamic_person?sap-client=800",
        wsdl : path.join(__dirname.replace(IF.name, ""), global.wsdl, "zhrws_dynamic_person.xml"),
        func : "ZHRWS_DYNAMIC_PERSON.ZHRWS_DYNAMIC_PERSON.ZHRWS_DYNAMIC_PERSON",
        Params : arg,
        BasicAuth : global.TXSOAPAuth
    };

    MEAP.SOAP.Runner(option, function(err, res, data) {
        Response.setHeader("Content-type", "text/json;charset=utf-8");
        if (!err) {
            Response.end(JSON.stringify(data));
        } else {
            Response.end(JSON.stringify({
                status : '-1',
                message : 'Error'
            }));
        }
    });
}

exports.Runner = run;
