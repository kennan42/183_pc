var MEAP=require("meap");
var path = require("path");

function run(Param,Robot,Request,Response,IF)
{
	var arg = JSON.parse(Param.body.toString());
	/*
	var serverUserId = Robot.Get("username");
	arg.input.currUsrId = serverUserId;
	arg.input.pubAppr.usrId = serverUserId;
	*/
	var option={
		wsdl:path.join(__dirname.replace(IF.name,""),global.wsdl,"PORTAL_BPMI_AprPred.xml"),
		func:"PORTAL_BPMI_AprPred.PORTAL_BPMI_AprPred_Port.PORTALBPMIAprPred",
		Params:arg,
		agent:false
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
