// W GSP待办
// A GSP已办

//W_1 获取GSP首营企业待审批ID列表 返回id
function GSPsubmit_W_1(pernr,bussType,startPage,pageSize){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
		"input":{
			"channelSerialNo":getDateNumber(),
			"currUsrId":parseInt(pernr).toString(),
			"domain":"410",
			"extendMap":{
				"entry":[{
					"Key":"",
					"Value":""
				}]
			},
			"qryType":"4",
			"userId":"",
			"lastTime":"",
			"bussType":bussType,
			"startPage":parseInt(startPage),
			"pageSize":pageSize
		}
	};
		$.post("/portal/PORTAL_BPMI_TaskListQry",JSON.stringify(paramJSon),function(gystodoListsData){
			// alert(JSON.stringify(gystodoListsData))
			var gystodoListsData = typeof gystodoListsData == 'object'?gystodoListsData:JSON.parse(gystodoListsData);
			//alert(11)
			//alert(gystodoListsData.status)
			if (gystodoListsData.status == '-1') {
				rtnJSON.status = "-1";
				rtnJSON = gystodoListsData;
			}else if(gystodoListsData.status == '-2'){
				layer.alert('请勿擅自修改请求信息，您的本次操作已被记录',8,function(){
					window.close();
				});
				return;
			}else {
				if(gystodoListsData.output.type != 'S'){
					rtnJSON.status = "-1";
					rtnJSON = gystodoListsData;
				}else{
					rtnJSON = gystodoListsData;
					rtnJSON.status = "0";
				}
			}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}
//W_G001 获取GSP待审批列表 返回列表 首营企业G001
function GSPsubmit_W_G001(formid){
	var rtnJSON = {};
	if(formid){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":"",
					"ZDOMAIN":"410",
					"I_PAGENO":"",
					"I_PAGESIZE":""
			},
            "IT_APPLYID":{
            	"item":formid
            }
		};
		$.post("/shouying/zlygerpws02",JSON.stringify(paramJSon),function(gysvendListsData){
			var gysvendListsData = typeof gysvendListsData == 'object'?gysvendListsData:JSON.parse(gysvendListsData);
			if (gysvendListsData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(gysvendListsData.ES_PUBLIC.TYPE != 'S'){
					rtnJSON.status = "-1";
					rtnJSON = gysvendListsData;
				}else if(gysvendListsData.ES_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
					rtnJSON = gysvendListsData;
				}else{
					rtnJSON = gysvendListsData;
					rtnJSON.status = "0";
				}
			}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}
//W_G002 获取GSP待审批列表 返回列表 首营品种G002
function GSPsubmit_W_G002(formid){
	var rtnJSON = {};
	if(formid){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":"",
					"ZDOMAIN":"410",
					"I_PAGENO":"",
					"I_PAGESIZE":""
			},
            "IT_APPLYID":{
            	"item":formid
            }
		};
		$.post("/shouying/zlygerpws05",JSON.stringify(paramJSon),function(gysvendListsData){
			var gysvendListsData = typeof gysvendListsData == 'object'?gysvendListsData:JSON.parse(gysvendListsData);
			if (gysvendListsData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(gysvendListsData.ES_PUBLIC.TYPE != 'S'){
					rtnJSON.status = "-1";
					rtnJSON = gysvendListsData;
				}else if(gysvendListsData.ES_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
					rtnJSON = gysvendListsData;
				}else{
					rtnJSON = gysvendListsData;
					rtnJSON.status = "0";
				}
			}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}
//W_G003 获取GSP待审批列表 返回列表 首营客户G003
function GSPsubmit_W_G003(formid){
	var rtnJSON = {};
	if(formid){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":"",
					"ZDOMAIN":"410",
					"I_PAGENO":"",
					"I_PAGESIZE":""
			},
            "IT_APPLYID":{
            	"item":formid
            }
		};
		$.post("/shouying/zlygerpws08",JSON.stringify(paramJSon),function(gysvendListsData){
			var gysvendListsData = typeof gysvendListsData == 'object'?gysvendListsData:JSON.parse(gysvendListsData);
			if (gysvendListsData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(gysvendListsData.ES_PUBLIC.TYPE != 'S'){
					rtnJSON.status = "-1";
					rtnJSON = gysvendListsData;
				}else if(gysvendListsData.ES_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
					rtnJSON = gysvendListsData;
				}else{
					rtnJSON = gysvendListsData;
					rtnJSON.status = "0";
				}
			}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}
//W_G007 获取GSP待审批列表 返回列表 不合格品G007
function GSPsubmit_W_G007(formid){
	var rtnJSON = {};
	if(formid){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":"",
					"ZDOMAIN":"410",
					"I_PAGENO":"",
					"I_PAGESIZE":""
			},
            "IT_APPLYID":{
            	"item":formid
            }
		};
		$.post("/shouying/zlygerpws16",JSON.stringify(paramJSon),function(gysvendListsData){
			var gysvendListsData = typeof gysvendListsData == 'object'?gysvendListsData:JSON.parse(gysvendListsData);
			if (gysvendListsData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(gysvendListsData.ES_PUBLIC.TYPE != 'S'){
					rtnJSON.status = "-1";
					rtnJSON = gysvendListsData;
				}else if(gysvendListsData.ES_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
					rtnJSON = gysvendListsData;
				}else{
					rtnJSON = gysvendListsData;
					rtnJSON.status = "0";
				}
			}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}



//WSearch_G001 搜索GSP首营企业待审批ID列表 返回id 首营企业G001
function GSPsubmit_WSearch_G001(CNum,pagesize,sval,STATUS){
	var rtnJSON = {};
	var paramJSon = {
	        "IM_COMSTRING":sval,
	        "IM_STATUS":STATUS,
	        "IS_PUBLIC":{
				"FLOWNO":"",
				"PERNR":"",
				"ZDOMAIN":"410",
				"I_PAGENO":CNum,
				"I_PAGESIZE":pagesize
			}
	};
	$.post("/shouying/zlygerpws03",JSON.stringify(paramJSon),function(gysvendListsData){
		var gysvendListsData = typeof gysvendListsData == 'object'?gysvendListsData:JSON.parse(gysvendListsData);
		if (gysvendListsData.status == '-1') {
				rtnJSON.status = "-1";
		}else {
			if(gysvendListsData.ES_PUBLIC.TYPE != 'S'){
				rtnJSON.status = "-1";
				rtnJSON = gysvendListsData;
			}else if(gysvendListsData.ES_PUBLIC.TYPE == 'E'){
				rtnJSON.status = "-1";
				rtnJSON = gysvendListsData;
			}else{
				rtnJSON = gysvendListsData;
				rtnJSON.status = "0";
			}
		}
	});
	return rtnJSON;
}
//WSearch_G002 搜索GSP首营企业待审批ID列表 返回id 首营品种G002
function GSPsubmit_WSearch_G002(CNum,pagesize,sval,STATUS){
	var rtnJSON = {};
	var paramJSon = {
	        "IM_COMSTRING":sval,
	        "IM_STATUS":STATUS,
	        "IS_PUBLIC":{
				"FLOWNO":"",
				"PERNR":"",
				"ZDOMAIN":"410",
				"I_PAGENO":CNum,
				"I_PAGESIZE":pagesize
			}
	};
	$.post("/shouying/zlygerpws06",JSON.stringify(paramJSon),function(gysvendListsData){
		var gysvendListsData = typeof gysvendListsData == 'object'?gysvendListsData:JSON.parse(gysvendListsData);
		if (gysvendListsData.status == '-1') {
				rtnJSON.status = "-1";
		}else {
			if(gysvendListsData.ES_PUBLIC.TYPE != 'S'){
				rtnJSON.status = "-1";
				rtnJSON = gysvendListsData;
			}else if(gysvendListsData.ES_PUBLIC.TYPE == 'E'){
				rtnJSON.status = "-1";
				rtnJSON = gysvendListsData;
			}else{
				rtnJSON = gysvendListsData;
				rtnJSON.status = "0";
			}
		}
	});
	return rtnJSON;
} 
//WSearch_G003 搜索GSP首营企业待审批ID列表 返回id 首营客户G003
function GSPsubmit_WSearch_G003(CNum,pagesize,sval,STATUS){
	var rtnJSON = {};
	var paramJSon = {
	        "IM_COMSTRING":sval,
	        "IM_STATUS":STATUS,
	        "IS_PUBLIC":{
				"FLOWNO":"",
				"PERNR":"",
				"ZDOMAIN":"",
				"I_PAGENO":CNum,
				"I_PAGESIZE":pagesize
			}
	};
	$.post("/shouying/zlygerpws09",JSON.stringify(paramJSon),function(gysvendListsData){
		var gysvendListsData = typeof gysvendListsData == 'object'?gysvendListsData:JSON.parse(gysvendListsData);
		if (gysvendListsData.status == '-1') {
				rtnJSON.status = "-1";
		}else {
			if(gysvendListsData.ES_PUBLIC.TYPE != 'S'){
				rtnJSON.status = "-1";
				rtnJSON = gysvendListsData;
			}else if(gysvendListsData.ES_PUBLIC.TYPE == 'E'){
				rtnJSON.status = "-1";
				rtnJSON = gysvendListsData;
			}else{
				rtnJSON = gysvendListsData;
				rtnJSON.status = "0";
			}
		}
	});
	return rtnJSON;
}  
//WSearch_G007 搜索GSP首营企业待审批ID列表 返回id 不合格品G007
function GSPsubmit_WSearch_G007(CNum,pagesize,sval,STATUS){
	var rtnJSON = {};
	var paramJSon = {
	        "IM_COMSTRING":sval,
	        "IM_STATUS":STATUS,
	        "IS_PUBLIC":{
				"FLOWNO":"",
				"PERNR":"",
				"ZDOMAIN":"",
				"I_PAGENO":CNum,
				"I_PAGESIZE":pagesize
			}
	};
	$.post("/shouying/zlygerpws17",JSON.stringify(paramJSon),function(gysvendListsData){
		var gysvendListsData = typeof gysvendListsData == 'object'?gysvendListsData:JSON.parse(gysvendListsData);
		if (gysvendListsData.status == '-1') {
				rtnJSON.status = "-1";
		}else {
			if(gysvendListsData.ES_PUBLIC.TYPE != 'S'){
				rtnJSON.status = "-1";
				rtnJSON = gysvendListsData;
			}else if(gysvendListsData.ES_PUBLIC.TYPE == 'E'){
				rtnJSON.status = "-1";
				rtnJSON = gysvendListsData;
			}else{
				rtnJSON = gysvendListsData;
				rtnJSON.status = "0";
			}
		}
	});
	return rtnJSON;
}

//WSearch_G007 搜索GSP首营企业待审批ID列表 返回id 不合格品G007
function GSPsubmit_WSubmit(pener,bussType,appType,APPID,taskId,currStep,opinion){
	var rtnJSON = {};
	if(APPID){
		//拼接提交参数
		var paramJSon = {
			"input":{
				"channelSerialNo":getDateNumber(),
				"currUsrId":pener,
				"domain":'400',
				"extendMap":{
						"entry":[{
							"Key":'',
							"Value":''
						}]
					},
				"bussType":bussType,
				"bussNo":APPID,
				"pubAppr":{
					"taskId":taskId,
					"appType":appType,
					"appOpinion":opinion,
					"usrId":pener,
					"currStep":currStep
				}
			}
		};
		$.post("/portal/PORTAL_BPMI_AprPred",JSON.stringify(paramJSon),function(submitListsData){
			// alert(JSON.stringify(submitListsData))
			var submitListsData = typeof submitListsData == 'object'?submitListsData:JSON.parse(submitListsData);
			if (submitListsData.status == '-1') {
				rtnJSON.status = "-1";
				rtnJSON.errMsg = checkNoChar(submitListsData.output.message);
			}
			else {
				if(submitListsData.output.type != 'S'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = checkNoChar(submitListsData.output.message);
				}else if(submitListsData.output.type == 'E'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = checkNoChar(submitListsData.output.message);
				}else{
					rtnJSON = submitListsData;
					rtnJSON.status = "0";
				}
			}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}