var MEAP=require("meap");
var path = require("path");

function run(Param,Robot,Request,Response,IF)
{
	var arg = JSON.parse(Param.body.toString());
	var option={
	//	wsdl:global.TX_DOMAIN_URL_PRE + "/sap/bc/srt/wsdl/flv_10002A111AD1/srvc_url/sap/bc/srt/rfc/sap/zhrws2214/800/zhrws2214/zhrws2214?sap-client=800",
		wsdl:path.join(__dirname.replace(IF.name,""),global.wsdl,"BASE_SHENGSHIQU.xml"),
		func:"ZHRWS2214.ZHRWS2214_soap12.ZHRWS2214",
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
