
var MEAP=require("meap");
var fs = require("fs");
var WANTU = require('../index.js');
var assert = require("assert");


function run(Param, Robot, Request, Response, IF)
{
    console.log("upload2");
    var cb = Param.params.cb; 
    //console.log(Param.files);
    // var ak =   Request.headers.authorization;
    // console.log(ak); 
    // var sk =   Request.headers.useragent;
    // console.log(sk); 
    //var wantu = new WANTU(ak,sk);  //填入ak，sk
    var wantu = new WANTU('23316815','6293f2c5674080cf512ca890cc09c9aa');  //填入ak，sk
    var namespace = "moonimage";   //填写空间名
    var file =Param.files.content;
    var str = file.path;
    console.log(str);
    var arr = str.split("\\");
    delete arr[arr.length-1];
    var dir = arr.join("/");
    var newpath = dir+file.name;
    console.log(newpath);
    var newfile = fs.rename(file.path,newpath,function(err,res){
})
    //console.log(newfile.path);
    
    var id, uploadId;
     wantu.singleUpload({
         namespace : namespace,
         expiration : -1
     },newpath,'/','','',function(err,res){
         if(!err){
             console.log("====Success======");
             url = JSON.parse(res.data).url;
             //console.log(cb+'?'+url);
             // Response.setHeader("Content-Type", "text/html");
             // Response.writeHead('301',{'Location': cb+'?'+url});
             // Response.end();
             Response.end(JSON.stringify({
                 status:"1",
                 message:res
             }))
         }
         else{
             console.log("=========ERR==========");
             Response.end(JSON.stringify({
                 status:"-1",
                 message:err
             }))
         }
     });
}

exports.Runner = run;


                                

    

