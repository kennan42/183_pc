var mongoose = require("mongoose");
var Schema = mongoose.Schema;



/**
 * PC 滚动计划  员工人员表
 * @type {mongoose.Schema}
 *
 * @author ken
 */
var UserSchema=new Schema({
      userId:String,     //id
      userName:String,   //姓名
      userType:String,  //员工类型
      company:String,    //公司
      updateTime:Number,//更新时间 
      duty:String      //岗位 
});


var taskSchema  =new Schema({
      userId:String,      //id
      userName:String,    //姓名
      taskType:String,      //任务类型
      taskDesc:String,       //任务描述
      taskStartDate:Number,  //开始日期
      taskDays:Number,    //任务时间
      frozenFlag:String,//冻结标识
      updateTime:Number   
       
});


exports.UserSchema = UserSchema;
exports.taskSchema =taskSchema;
