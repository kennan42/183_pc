var MEAP=require("meap");

//dev

global.TXSOAPAuth = {username:"hrws",password:"123456"};
global.wsdl = "wsdl_dev";
global.ntlm_url = "http://10.10.1.182:11130/ntlm/check.jsp";
global.mongodbURL = "mongodb://mobile:mobile_1234@10.10.1.183:27017/mobile";
global.nginxURL = "http://10.10.1.182:8888/";
global.pushURL = "http://10.10.1.183:8080/push/msg/sendMessage";
global.appId = "aaaah10013";
global.redisHost = "10.10.1.183";
global.redisPort = 6379;
global.baseURL = "http://10.10.1.183:808";
global.wsdl900 = "wsdl_dev900"; 

//qas800
/* 
global.TXSOAPAuth = {username:"HRWS",password:"cttq2012"};
global.wsdl = "wsdl_test";
global.ntlm_url = "http://10.10.1.151:11130/ntlm/check.jsp";
global.mongodbURL = "mongodb://mobile:mobile_1234@10.10.1.152:27017/mobile";
global.nginxURL = "http://aiqas.cttq.com:8888/";
global.pushURL = "http://10.10.1.152:8080/push/msg/sendMessage";
global.appId = "aaaao10003";
global.redisHost = "10.10.1.152";
global.redisPort = 6379;
global.baseURL = "http://10.10.1.152:808";
*/
//qas 900
  /*
// global.TXSOAPAuth = {username:"HRWS",password:"hrws2015"};
// global.wsdl = "wsdl_qas900";
// global.ntlm_url = "http://10.10.1.151:11130/ntlm/check.jsp";
// global.mongodbURL = "mongodb://mobile:mobile_1234@10.10.1.152:27017/mobile";
// global.nginxURL = "http://aiqas.cttq.com:8888/";
// global.pushURL = "http://10.10.1.152:8080/push/msg/sendMessage";
// global.appId = "aaaao10003";
// global.redisHost = "10.10.1.152";
// global.redisPort = 6379;
// global.baseURL = "http://10.10.1.152:808";

 /*

//prd
/*
global.TXSOAPAuth = {username:"hrws",password:"*#!cttqszm"};
global.wsdl = "wsdl_pro";
global.ntlm_url = "http://10.10.1.149:11130/ntlm/check.jsp";
global.mongodbURL = "mongodb://10.10.1.147:27017/mobile";
global.nginxURL = "http://ai.cttq.com:8888/";
global.pushURL = "http://ai.cttq.com:8080/push/msg/sendMessage";
global.appId = "10000003";
global.redisHost = "10.10.1.147";
global.redisPort = 6379;
global.baseURL = "http://ai.cttq.com:808";

*/

function run(Param, Robot, Request, Response, IF)
{
    
    Response.end();
}

// IT�������֪���ӿ�ǰ׺
global.its = "http://hdev01.cttq.com";
global.Detail = "http://cttqdev.cttq.com:8000";

global.zabbix={
    user:"zabbix",
    password: "zabbix.1234",
    url :"http://10.10.1.218/api_jsonrpc.php"
    
}
exports.Runner = run;


                                

    

