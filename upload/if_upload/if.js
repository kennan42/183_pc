
var MEAP=require("meap");
var fs = require("fs");
var WANTU = require('../index.js');
var assert = require("assert");




function run(Param, Robot, Request, Response, IF)
{

    console.log("=================================================");
    // var ak =   Request.headers.authorization;
    // console.log(ak); 
    // var sk =   Request.headers.useragent;
    // console.log(sk); 
    //var wantu = new WANTU(ak,sk);  //填入ak，sk
    
    //授权信息
    var cb = Param.params.cb; 
    var uploadPolicy = {
                    "namespace" : "my-cttq-it",
                    "bucket" : null,
                    "insertOnly" : 0,
                    "expiration" : -1,
                    "detectMime" : 1,
                    "dir" : null,
                    "name" : "${uuid}.${ext}",
                    "sizeLimit" : null,
                    "mimeLimit" : null,
                    "callbackUrl" : null,
                    "callbackHost" : null,
                     "callbackBody" : null,
                    "callbackBodyType" : null,
                    "returnUrl" : null,
                    "returnBody" : null
                }
    //顽兔空间密钥         
    var wantu = new WANTU('23180619','2e8da0ce8705494afabc2e3bd57ce5d1');  //填入ak，sk
    
    //修改缓存文件名称为原文件名称
    var file =Param.files.content;
    var str = file.path;
    var arr = str.split("\\");
    delete arr[arr.length-1];
    var dir = arr.join("/");
    var newpath = dir+file.name;
    var newfile = fs.rename(file.path,newpath,function(err,res){
        console.log("===="+res);
    });
    
     wantu.singleUpload(uploadPolicy,newpath,'/','','',function(err,res){
         
         if(!err){
             console.log("OK");
             url = JSON.parse(res.data).url;
             console.log(cb+'?fileurl='+url);
             Response.setHeader("Content-Type", "text/html");
             Response.writeHead('301',{'Location': cb+'?fileurl='+url});
             Response.end();
             // Response.end(JSON.stringify({
                 // status:"1",
                 // message:res
             // }))
         }
         else{
             
             console.log("ERR");
             Response.end(JSON.stringify({
                 status:"-1",
                 message:err
             }))
         }
     });
}

exports.Runner = run;


                                

    

