var mongoose = require("mongoose");
var Schema = mongoose.Schema;


//拼车 -新闻图片 
var CarpoolPictureSchema =new Schema({
     userId:String,//上传人
     fileName:String,//文件名
     newFileName:String,//新文件名
     fileSize:Number,//文件大小
     filePath:String,//文件路径,
     newFileURL :String, //压缩后 图片地址 
     newFileURL2 :String, //未压缩图片地址
     tag:Number ,//是否在轮播图中展示  0表示不展示  1：展示
     order:Number, //排序的顺序
     status:Number, //是否失效  0：正常  1：删除
     createdAt:Number//建立日期时间

});


//拼车- 新闻内容
var  CarpoolNewSchema =new Schema({
      newTitle:String,  //标题
      newContent :String, //内容
      newAuthor:String  ,//作者 
      pictureId :String, //保存的图片ID
      createdAt:Number
});

exports.CarpoolPictureSchema= CarpoolPictureSchema;
exports.CarpoolNewSchema=CarpoolNewSchema;
