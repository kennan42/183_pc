var MEAP = require("meap");
var fs = require("fs");
var path = require("path");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm = require("../carpoolNews.js");
var gm = require("gm");
var imageMagick = gm.subClass({
    imageMagick : true
});
/**
 *上传拼车轮播图片  和内容
 *作者：xialin
 * 时间：2016-4-15
 * 
 * 
 *  */
var imageTypes = [".BMP",".JPEG",".GIF",".PNG",".JPG"];
function run(Param, Robot, Request, Response, IF) {
    var userId = Param.params.userId; 
    var tag =Param.params.tag; //是否在轮播图中展示  0表示不展示  1：展示
    var order =Param.params.order;//排序的顺序
    var status =Param.params.status;//是否失效  0：正常  1：删除
    var files = Param.files.file;
    var fileName = files.name;
    var ext = path.extname(Param.files.file.name);
    var upperFileName = ext.toUpperCase();
    var rs = valiedateImageType(upperFileName,Response);
    if(rs == false){
        Response.end(JSON.stringify({
            status:"-1",
            msg:"图片格式错误"
        }));
        return;
    }
    var times = new Date().getTime();
    var fileSize = files.size;
    var newFileName = times + ext;
    var newFilePath = "/opt/emm/uploads/carpoolNews/" + newFileName;
    var is = fs.createReadStream(files.path);
    var os = fs.createWriteStream(newFilePath);
    Response.setHeader("Content-type","text/json;charset=utf-8");
    is.pipe(os);
    is.on('error', function() {
        Response.end(JSON.stringify({
            status : -1,
            msg : '图片上传失败'
        }));
        return;
    });
    is.on('end', function() {
        //压缩图片
        var commpressedImageName = times + "_commpressed" + ext;
        var commpressedImagePath = "/opt/emm/uploads/carpoolNews/" + commpressedImageName;
        var imgBuffer = imageMagick(newFilePath);
        imgBuffer.quality(80).resize(200);
        imgBuffer.write(commpressedImagePath, function(err) {
            if (!err) {
                var db = mongoose.createConnection(global.mongodbURL);
                
                //保存图片附件地址信息
                var CarpoolPictureModel = db.model("carpoolPicture", sm.CarpoolPictureSchema);
                var CarpoolPictureEntity = new CarpoolPictureModel({
                    userId : userId,
                    tag:tag,
                    order:order,
                    status:status,
                    fileName : fileName,
                    newFileName : newFileName,
                    filePath : newFilePath,
                    compressedFilePath : commpressedImagePath,
                    fileURL : global.nginxURL + "uploads/carpoolNews/" + newFileName,
                    compressedFileURL : nginxURL + "uploads/carpoolNews/" + commpressedImageName,
                    fileSize : fileSize,
                    createdAt : new Date().getTime()
                });
                CarpoolPictureEntity.save(function(err, doc) {
                    db.close();
                    if (!err) {
                        //向会议室中添加图片地址
                        var imageURL=global.nginxURL + "uploads/carpoolNews/" + newFileName;
                        var compressedImageURL=global.nginxURL + "uploads/carpoolNews/" + commpressedImageName;
                        //添加图片地址结束
                        Response.end(JSON.stringify({
                            status : "0",
                            msg : "保存图片信息成功",
                            pictureId:doc._id,
                            imageURL : imageURL,
                            compressedImageURL : compressedImageURL
                        }));
                    } else {
                        Response.end(JSON.stringify({
                            status : "-1",
                            msg : "保存图片信息失败"
                        }));
                    }
                });
            } else {
                Response.end(JSON.stringify({
                    status : -1,
                    msg : '压缩图片失败'
                }));
            }
        });
    });
}

function valiedateImageType(upperFileName,Response){
    for(var i in imageTypes ){
        if(imageTypes[i] == upperFileName){
            return true;
        }
    }
    return false;
}


exports.Runner = run;
