//A_1 获取GSP首营企业已审批ID列表 类型G001 返回id
function GSPsubmit_A_1(pernr,bussType,begD,endD,startPage,pageSize){
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
			"bussType":bussType,
			"beginDate":begD,
			"endDate":endD,
			"startPage":parseInt(startPage),
			"pageSize":pageSize
		}
	};
		$.post("/portal/PORTAL_BPMI_CompleteTaskSum",JSON.stringify(paramJSon),function(gystodoListsData){
			var gystodoListsData = typeof gystodoListsData == 'object'?gystodoListsData:JSON.parse(gystodoListsData);
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
	}
	return rtnJSON;
}

//A_G001 获取GSP首营企业已办批列表 类型G001 返回列表
function GSPsubmit_A_G001(formid){
	var rtnJSON = {};
	if(formid){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":"",
					"ZDOMAIN":"",
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
	}
	return rtnJSON;
}

//A_G007 获取GSP首营品种申请已办列表 类型G002 返回列表
function GSPsubmit_A_G002 (formid) {
	var rtnJSON = {};
	if(formid){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":"",
					"ZDOMAIN":"",
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
	}
	return rtnJSON;
}

//A_G007 获取GSP首营客户申请已办列表 类型G007 返回列表
function GSPsubmit_A_G003 (formid) {
	var rtnJSON = {};
	if(formid){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":"",
					"ZDOMAIN":"",
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
	}
	return rtnJSON;
}

//A_G007 获取GSP不合格品已办列表 类型G007 返回列表
function GSPsubmit_A_G007(formid){
	var rtnJSON = {};
	if(formid){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":"",
					"ZDOMAIN":"",
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
	}
	return rtnJSON;
}

//A_3 获取GSP审批路径 
function GSPsubmit_A_3(pernr,bussType,bussNo){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"input":{
                "channelSerialNo":getDateNumber(),
                "currUsrId":parseInt(pernr).toString(),
                "domain":'410',
                "extendMap":{
                     "entry":[{
                        "Key":"",
                        "Value":""
                     }]
                },
                "bussType":bussType,
                "bussNo":bussNo
            }
		};
		$.post("/portal/PORTAL_BPMI_ProcPathQry",JSON.stringify(paramJSon),function(gysvendListsData){
			var gysvendListsData = typeof gysvendListsData == 'object'?gysvendListsData:JSON.parse(gysvendListsData);
			if (gysvendListsData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(gysvendListsData.output.type != 'S'){
					rtnJSON.status = "-1";
				}else if(gysvendListsData.output.type == 'E'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = checkNoChar(gysvendListsData.output.message);
				}else{
					rtnJSON = gysvendListsData;
					rtnJSON.status = "0";
				}
			}
		});
	}else{
		rtnJSON.status = "-1";
	}
	return rtnJSON;
}

//ASearch_G001 获取GSP首营企业搜索 类型G001
function GSPsubmit_ASearch_G001(CNum,pagesize,sval,STATUS){
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

//A_SearchG002 获取GSP品种搜索 类型G002
function GSPsubmit_ASearch_G002 (CNum,pagesize,sval,STATUS) {
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

//A_SearchG003 获取GSP客户搜索 类型G003
function GSPsubmit_ASearch_G003 (CNum,pagesize,sval,STATUS) {
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

//A_SearchG007 获取GSP不合格品搜索 类型G007
function GSPsubmit_ASearch_G007 (CNum,pagesize,sval,STATUS) {
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