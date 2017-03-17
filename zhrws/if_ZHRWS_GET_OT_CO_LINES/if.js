var MEAP=require("meap");
var path = require("path");

function run(Param,Robot,Request,Response,IF)
{
	var arg = JSON.parse(Param.body.toString());
	/*
	var clientUserId = arg.P_SP_PERNR;
	var serverUserId = Robot.Get("username");
	if(clientUserId != serverUserId){
		Response.end(JSON.stringify({status:'-2',message:'invalide_userid'}));
		return;
	}*/
	var option={
		//wsdl:global.TX_DOMAIN_URL_PRE + "/sap/bc/srt/wsdl/flv_10002A111AD1/srvc_url/sap/bc/srt/rfc/sap/zhrws2215/800/zhrws2215/zhrws2215?sap-client=800",
		wsdl:path.join(__dirname.replace(IF.name,""),global.wsdl900,"zhrws2215.xml"),
		func:"ZHRWS2215.ZHRWS2215_soap12.ZHRWS2215",
		Params:arg,
		BasicAuth:global.TXSOAPAuth
	};
	
	MEAP.SOAP.Runner(option,function(err,res,data){
		Response.setHeader("Content-type","text/json;charset=utf-8");
		if(!err)
		{
			Response.end(JSON.stringify(data));
		}
		else
		{
			Response.end(JSON.stringify({status:'-1',message:'Error'}));
		}
	});
}

exports.Runner = run;
