var MEAP = require("meap");
var path = require("path");
var cp = require("child_process");
var fs = require('fs');
var timeErrors = null;
var dstIP = "";
var nginxIP = "";
function run(Param, Robot, Request, Response, IF){
    var arg = JSON.parse(Param.body.toString());
    var startDate = arg.startDate;
    var endDate = arg.endDate;
	
	if(global.wsdl == "wsdl_dev"){
	   dstIP = "10.10.1.182";
		nginxIP = "10.10.1.182"
	}else if(global.wsdl == "wsdl_test"){
			 dstIP = "10.10.1.151";
			nginxIP = "10.10.1.151"
	}else{
		dstIP = "10.10.1.149";
		nginxIP = "ai.cttq.com"
	}
		
    var option0 = {
        wsdl: path.join(__dirname.replace(IF.name, ""), global.wsdl900, "zhrws2110.xml"),
        func: "ZHRWS2110.ZHRWS2110_soap12.ZHRWS2110",
        Params: arg,
        BasicAuth: global.TXSOAPAuth
    };
    MEAP.SOAP.Runner(option0, function(err, res, data){
        if (!err) {
            var persons = data.INQUIRY.item;
            timeErrors = [];
            getPersonTimeError(Response, IF, persons, 0, timeErrors, startDate, endDate);
        }
        else {
            Response.end(JSON.stringify({
                status: '-1',
                message: 'Error'
            }));
        }
    });
}

function getPersonTimeError(Response, IF, persons, i, timeErrors, startDate, endDate){
    i = i || 0;
    if (i < persons.length) {
        var reqJSON = {
		     "BEGDA":startDate,
	         "ENDDA":endDate,
	         "T_PERNR":{
	            "item":[{
                "PERNR": persons[i].PERNR
            }]
			 }
		};	

		
        var option1 = {
            wsdl: path.join(__dirname.replace(IF.name, ""), global.wsdl900, "zhrws2103.xml"),
            func: "ZHRWS2103.ZHRWS2103_soap12.ZHRWS2103",
            Params: reqJSON,
            BasicAuth: global.TXSOAPAuth
        };
        MEAP.SOAP.Runner(option1, function(err, res, data){
            if (!err) {
                if (data.T_COUNT.item != null) {
                    var checkinErrorPersonId = data.T_COUNT.item[0].PERNR;
                    var checkinErrorNACHN = data.T_COUNT.item[0].NACHN;
                    var checkinErrorLINES = data.T_COUNT.item[0].LINES;
                    var paramJSon = {
                        "IT_EXTENDMAP": {
                            "item": [{
                                "FIELDNAME": '',
                                "VALUE": ''
                            }]
                        },
                        "I_PUBLIC": {
                            "CHANNELSERIALNO": '',
                            "ORIGINATETELLERID": '',
                            "ZDOMAIN": '100',
                            "I_PAGENO": '',
                            "I_PAGESIZE": '',
                            "ZVERSION": ''
                        },
                        "P_PERNR": checkinErrorPersonId
                    };
					
                    var option2 = {
                        wsdl: path.join(__dirname.replace(IF.name, ""), global.wsdl, "ZHRMMS_READ_PHOTO.xml"),
                        func: "ZHRWSMSS05.ZHRWSMSS05_soap12.ZHRWSMSS05",
                        Params: paramJSon
                    };
                    
                    MEAP.SOAP.Runner(option2, function(err, res, data){
                        if (!err) {
                            if (data.E_PUBLIC.CODE == '0') {
								var filename = option2.Params.P_PERNR + "_.jpg";
								var filepath = "/tmp/" +filename;
								var d = new Buffer(data.B64DATA,"base64");
								fs.writeFileSync(filepath,d);
								var cmd = "scp " + filepath + " root@" + dstIP + ":" + "/usr/share/nginx/html/doc";
								cp.exec(cmd,function(err, stdout, stderr){
								if(!err){
									var url = "http://" + nginxIP + ":8888/doc/" + filename;
									timeErrors.push({
                                    "checkinErrorPersonId": checkinErrorPersonId,
                                    "checkinErrorNACHN": checkinErrorNACHN,
                                    "checkinErrorLINES": checkinErrorLINES,
                                    "imageURL": url,
                                    "hasPhoto": "0"
                                });
								}
								})
                            }
                            else {
                                timeErrors.push({
                                    "checkinErrorPersonId": checkinErrorPersonId,
                                    "checkinErrorNACHN": checkinErrorNACHN,
                                    "checkinErrorLINES": checkinErrorLINES,
                                    "hasPhoto": "1"
                                });
                            }
                            
                        }
                        else {
                            Response.end(JSON.stringify({
                                status: '-1',
                                message: 'Error'
                            }));
                        }
                  
				  
				    });
                }
            }
            else {
                Response.end(JSON.stringify({
                    status: '-1',
                    message: 'Error'
                }));
            }
		i+=1;
		getPersonTimeError(Response, IF, persons, i, timeErrors, startDate, endDate);
        });
    }
    else {
		Response.setHeader("Content-type","text/json;charset=utf-8");
    	Response.end(JSON.stringify({status:"0",timeErrorList:timeErrors}));
    }
}

exports.Runner = run;
