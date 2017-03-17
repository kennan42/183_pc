var MEAP=require("meap");

global.TXSOAPAuth = {username:"HRWS",password:"cttq2012"};
global.wsdl = "wsdl_test";
global.ntlm_url = "http://10.10.1.151:11130/ntlm/check.jsp";
global.mongodbURL = "mongodb://mobile:mobile_1234@10.10.1.152:27017/mobile";
global.nginxURL = "http://aiqas.cttq.com:8888/";
global.pushURL = "http://10.10.1.152:8080/push/msg/sendMessage";
global.appId = "aaaao10003";
global.baseURL = "http://10.10.1.152";



function run(Param, Robot, Request, Response, IF)
{
    
    Response.end();
}

exports.Runner = run;


                                

    

