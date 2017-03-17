var MEAP = require("meap");
var fs = require("fs");
var path = require("path");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../BaseSchema.js");

// 上传欢迎页图片
function run(Param, Robot, Request, Response, IF) {
    Response.setHeader("Content-type", "text/json;charset=utf-8");
    var db = mongoose.createConnection(global.mongodbURL);
    var BaseJurisdictionUserModel = db.model("base_jurisdiction_user", sm.BaseJurisdictionUser);

    var cookies = parseCookie(Request.headers.cookie);
    BaseJurisdictionUserModel.aggregate([
            {
                $match: {
                    userId: cookies['userid'],
                    abbreviation: "welcomepage"
                }
            }
        ],
        function (err, res) {
            db.close();
            if (err == null) {
                if (res.length > 0) {
                    upload(Param, Response);
                } else {
                    Response.end(JSON.stringify({
                        "status": -1,
                        "msg": "没有权限"
                    }));
                }
            } else {
                Response.end(JSON.stringify({
                    "status": 1,
                    "msg": "权限检查发生错误"
                }));
            }
        }
    );


}

function upload(Param, Response) {
    var files = Param.files.file;
    var ext = path.extname(Param.files.file.name);

    var oldFileName = files.name;

    if (!valiedateImageType(path.extname(oldFileName))) {
        Response.end(JSON.stringify({
            "status": "1",
            "msg": "图片格式错误"
        }));
        return;
    }

    var newFileName = new Date().getTime() + ext;
    var newFilePath = "/opt/emm/uploads/" + newFileName;
    var is = fs.createReadStream(files.path);
    var os = fs.createWriteStream(newFilePath);
    is.pipe(os);
    is.on('error', function () {
        Response.end(JSON.stringify({
            "status": 1,
            "msg": '图片上传失败',
            "data": ""
        }));
        return;
    });
    is.on('end', function () {
        fs.unlinkSync(files.path);
        var imageURL = global.nginxURL + "uploads/" + newFileName;
        Response.end(JSON.stringify({
            "status": "0",
            "msg": "保存图片信息成功",
            "data": {
                "image": imageURL,
                "thumbnail": imageURL
            }
        }));
    });
}

/**
 * 检查文件类型是否合法
 * @param upperFileName
 * @returns {boolean}
 */
function valiedateImageType(upperFileName) {
    upperFileName = upperFileName.toUpperCase();
    var imageTypes = [".BMP", ".JPEG", ".GIF", ".PNG", ".JPG"];
    for (var i in imageTypes) {
        if (imageTypes[i] == upperFileName) {
            return true;
        }
    }
    return false;
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
