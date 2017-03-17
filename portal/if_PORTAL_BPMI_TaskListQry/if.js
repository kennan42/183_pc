var MEAP = require("meap");
var path = require("path");

function run(Param, Robot, Request, Response, IF) {
   // console.log(Param.body.toString());
    var arg = JSON.parse(Param.body.toString());
	//console.log("--------------",Param.body.toString());
    /*
     var clientUserId = arg.input.currUsrId;
     var serverUserId = Robot.Get("username");
     if(clientUserId != serverUserId){
     Response.end(JSON.stringify({status:'-2',message:'invalide_userid'}));
     return;
     }*/
    var option = {
        //wsdl:global.TX_IP_URL_PRE + "/PORTAL_BPMI_TaskListQry/PORTALBPMITaskListQryImplBean?wsdl",
        wsdl : path.join(__dirname.replace(IF.name, ""), global.wsdl, "PORTAL_BPMI_TaskListQry.xml"),
        func : "PORTAL_BPMI_TaskListQry.PORTAL_BPMI_TaskListQry_Port.PORTALBPMITaskListQry",
        Params : arg,
        agent : "false",
    };

    MEAP.SOAP.Runner(option, function(err, res, data) {
        Response.setHeader("Content-Type", "text/json;charset=utf-8");
		console.log("-----------------",data);
        if (!err) {
			console.log("-----------------");
            Response.end(JSON.stringify(data));
        } else {
            Response.end(JSON.stringify({
                status : '-1',
                message : 'Error'
            }));
        }
    });
}

exports.Runner = run;
