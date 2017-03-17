var MEAP=require("meap");
var mongoose = require("mongoose");
var baseSchema = require("../rollingPlan.js");
/**
 *  功能:添加用户
 *  时间：2015/11/26
 *  编写：ken
 */


function run(Param, Robot, Request, Response, IF)
{
	
	 Response.setHeader("Content-type","text/json;charset=utf-8");
	 var arg = JSON.parse(Param.body.toString());
	 console.log("addUser--->");
	  var db = mongoose.createConnection(global.mongodbURL);
    var userModel = db.model("rollingPlan_user", baseSchema.UserSchema);
    
    var userEntity =new  userModel({
        userId:arg.userId,     //id
        userName:arg.userName,   //姓名
      userType:arg.userType,  //员工类型
      company:arg.company,    //公司
      updateTime:new Date().getTime(),
      duty:arg.duty
         
    });
    
   userEntity.save( function(err,data){
       db.close();
       console.log(JSON.stringify(err));
         if(!err){
             Response.end(JSON.stringify({
                   status:0,
                   msg:"保存成功",
                   uid:data._id
                 
             }));
         }else{
             Response.end(JSON.stringify({
                   status:-1,
                   msg:"保存失败"
                 
         }));
        };
   })
     
    
  
    
}

exports.Runner = run;


                                

	

