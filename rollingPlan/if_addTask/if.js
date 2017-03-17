var MEAP=require("meap");
var mongoose = require("mongoose");
var baseSchema = require("../rollingPlan.js");
/**
 *  功能:添加任务
 *  时间：2015/11/26
 *  编写：ken
 */
function run(Param, Robot, Request, Response, IF)
{
	    Response.setHeader("Content-type","text/json;charset=utf-8");
     var arg = JSON.parse(Param.body.toString());
     console.log("addTask--->");
    var db = mongoose.createConnection(global.mongodbURL);
    var taskModel = db.model("rollingPlan_task", baseSchema.taskSchema);
    
       var taskEntity =new  taskModel({
          userId:arg.userId,      //id
      userName:arg.userName,    //姓名
      taskType:arg.taskType,      //任务类型
      taskDesc:arg.taskDesc,       //任务描述
      taskStartDate:arg.taskStartDate,  //开始日期
      taskDays:arg.taskDays,    //任务时间
      frozenFlag:arg.frozenFlag,//冻结标识
      updateTime:new Date().getTime()
       
         
    });
    
   
    taskEntity.save(function(err,data){
       
         db.close();
         if(!err){
             Response.end(JSON.stringify({
                   status:0,
                   msg:"保存成功",
                   taskID:data._id
                 
             }));
         }else{
             Response.end(JSON.stringify({
                   status:-1,
                   msg:"保存失败"
                 
         }));
        };
    });
}

exports.Runner = run;


                                

	

