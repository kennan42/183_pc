var MEAP=require("meap");
var path = require("path");

function run(Param,Robot,Request,Response,IF)
{
	var arg = JSON.parse(Param.body.toString());
	/*
	var clientUserId = arg.input.currUsrId;
	var serverUserId = Robot.Get("username");
	if(clientUserId != serverUserId){
		Response.end(JSON.stringify({status:'-2',message:'invalide_userid'}));
		return;
	}*/
	var option={
		wsdl:path.join(__dirname.replace(IF.name,""),global.wsdl,"PORTAL_BPMI_ProcPathQry.xml"),
		func:"PORTAL_BPMI_ProcPathQry.PORTAL_BPMI_ProcPathQry_Port.PORTALBPMIProcPathQry",
		agent:false,
		Params:arg
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
