/**
 *项目管理数据模型
 * @author donghua.wang
 * @date 2015年10月27日 15:10
 *  */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//项目管理模型(base_project)
var baseProjectSchema = new Schema({
    enName:String,//英文名称
    cnName:String,//中文名称
    description:String,//描述
    status:Number,//1启动  0停用
    stopContent:String,//公告内容
    stopStartTime:Number,//停用开始时间
    stopEndTime:Number,//停用结束时间
    createTime:Number//创建时间    
});

exports.baseProjectSchema=baseProjectSchema;
