//3_1 统一待办接口 类型VEND（供应商）得到返回id
function submit_3_1(pernr,startPage,pageSize){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
		"input":{
			"channelSerialNo":getDateNumber(),
			"currUsrId":parseInt(pernr).toString(),
			"domain":"400",
			"extendMap":{
				"entry":[{
					"Key":"",
					"Value":""
				}]
			},
			"qryType":"4",
			"userId":"",
			"lastTime":"",
			"bussType":"VEND",
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
			}else if(gystodoListsData.status == '-2'){
				layer.alert('请勿擅自修改请求信息，您的本次操作已被记录',8,function(){
					window.close();
				});
				return;
			}else {
				if(gystodoListsData.output.type != 'S'){
					rtnJSON.status = "-1";
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
//3_2 判断当前审批人是会计还是部门经理 RFC E_TYPE =      A 会计  M 部门经理
function submit_3_2(pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":"",
					"ZDOMAIN":"",
					"I_PAGENO":"",
					"I_PAGESIZE":""
				},
				"I_PERNR":parseInt(pernr).toString()
	};
		$.post("/zvdf/ZVDF_IS_ACCOUNT_OR_MANAGER",JSON.stringify(paramJSon),function(gystypeListsData){
			if (gystypeListsData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(gystypeListsData.ES_PUBLIC.TYPE != 'S'){
					rtnJSON.status = "-1";
				}else if(gystypeListsData.ES_PUBLIC.TYPE == 'E'){
				rtnJSON.status = "-1";
				rtnJSON.errMsg = checkNoChar(gystypeListsData.ES_PUBLIC.MESSAGE);
				}else{
					rtnJSON = gystypeListsData;
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
//3_3 供应商统一待办列表接口
function submit_3_3(formid){
	var rtnJSON = {};
	if(formid){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":"",
					"ZDOMAIN":"100",
					"I_PAGENO":"",
					"I_PAGESIZE":""
				},
				"IT_APP_LIST":{
					"item":formid
				}
	};
		$.post("/zmm/ZMM_VENDER_LISTS",JSON.stringify(paramJSon),function(gysvendListsData){
			var gysvendListsData = typeof gysvendListsData == 'object'?gysvendListsData:JSON.parse(gysvendListsData);
			if (gysvendListsData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(gysvendListsData.ES_PUBLIC.TYPE != 'S'){
					rtnJSON.status = "-1";
				}else if(gysvendListsData.ES_PUBLIC.TYPE == 'E'){
				rtnJSON.status = "-1";
				rtnJSON.errMsg = checkNoChar(gysvendListsData.ES_PUBLIC.MESSAGE);
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
//3_4 供应商展开详情接口
function submit_3_4(formid){
	var rtnJSON = {};
	if(formid){
		//拼接提交参数
		var paramJSon = {
			"FORM_ID":formid,
			"FORM_ITEM":'1',
			"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":"",
					"ZDOMAIN":"",
					"I_PAGENO":"",
					"I_PAGESIZE":""
				}
	};
		$.post("/zvdf/ZVDF_GET_VENDER_APPLY",JSON.stringify(paramJSon),function(getapplyListsData){
			var getapplyListsData = typeof getapplyListsData == 'object'?getapplyListsData:JSON.parse(getapplyListsData);
			if (getapplyListsData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(getapplyListsData.ES_PUBLIC.TYPE != 'S'){
					rtnJSON.status = "-1";
				}else if(getapplyListsData.ES_PUBLIC.TYPE == 'E'){
				rtnJSON.status = "-1";
				rtnJSON.errMsg = checkNoChar(getapplyListsData.ES_PUBLIC.MESSAGE);
				}else{
					rtnJSON = getapplyListsData;
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
//3_5 提交供应商主数据接口
function submit_3_5(type,taskId,currStep,bussNo,pener,opinion){
	var rtnJSON = {};
	if(bussNo){
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
				"bussType":'VEND',
				"bussNo":bussNo,
				"pubAppr":{
					"taskId":taskId,
					"appType":type,
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
			}
			else {
				if(submitListsData.output.type != 'S'){
					rtnJSON.status = "-1";
				}else if(submitListsData.output.type == 'E'){
				rtnJSON.status = "-1";
				rtnJSON.errMsg = checkNoChar(submitListsData.ES_PUBLIC.MESSAGE);
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
//查看个人信息
function submit_1_1(pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"P_DATE":getToday8(),
			"P_PERNR":{
				"item": [{
							"PERNR":pernr
						}]
					}
		};
		$.post("/zhr/ZHR_GET_PER_EASY_INFO",JSON.stringify(paramJSon),function(perData){
			if (perData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(perData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = perData;
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

//4.2获取审批路径 CE
function submit_4_2(pernr,bussNo){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
		"input":{
			"channelSerialNo":getDateNumber(),
			"currUsrId":parseInt(pernr).toString(),
			"domain":"400",
			"extendMap":{
				"entry":[{
					"Key":"",
					"Value":""
				}]
			},
			"bussType":"VEND",
			"bussNo":bussNo
		}
	};
		$.post("/portal/PORTAL_BPMI_ProcPathQry",JSON.stringify(paramJSon),function(aaVacationWayData){
				if(aaVacationWayData.output.type != 'S'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = aaVacationWayData;
					rtnJSON.status = "0";
				}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}