var MEAP=require("meap");
var path = require("path");
function run(Param,Robot,Request,Response,IF)
{
	var arg = JSON.parse(Param.body.toString());
	var option={
		//wsdl:global.TX_DOMAIN_URL_PRE + "/sap/bc/srt/wsdl/srvc_52831E2D998445E0E1008000C0A80114/wsdl11/allinone/ws_policy/document?sap-client=800",
		wsdl:path.join(__dirname.replace(IF.name,""),global.wsdl,"ZHRMMS_IT9120_INS.xml"),
		func:"ZHRWSMSS07.ZHRWSMSS07_soap12.ZHRWSMSS07",
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
