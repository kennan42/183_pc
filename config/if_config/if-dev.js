var MEAP=require("meap");

global.TXSOAPAuth = {username:"hrws",password:"123456"};
global.wsdl = "wsdl_dev";
global.ntlm_url = "http://10.10.1.182:11130/ntlm/check.jsp";
global.mongodbURL = "mongodb://mobile:mobile_1234@10.10.1.183:27017/mobile";
global.nginxURL = "http://10.10.1.182:8888/";
global.pushURL = "http://10.10.1.183:8080/push/msg/sendMessage";
global.appId = "aaaah10013";
global.baseURL = "http://10.10.1.183";

function run(Param, Robot, Request, Response, IF)
{
    
    Response.end();
}

exports.Runner = run;


                                

    

