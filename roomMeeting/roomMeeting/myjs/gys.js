//public
var IS_PUBLIC={
						"FLOWNO":"",
						"PERNR":"",
						"ZDOMAIN":"",
						"I_PAGENO":"",
						"I_PAGESIZE":""
					};

//1 backupNew
//1.1 同5.3  由工号获得姓名、岗位、公司、部门、电话
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

//1.2 同 5.1省市区接口获取数据
function submit_1_2(I_ZLEVL,I_ZPRID){
	var rtnJSON = {};
		//拼接提交参数
		var paramJSon = {
				"I_ZLEVL":I_ZLEVL,
				"I_ZPRID":I_ZPRID
		};
		$.post("/base/BASE_SHENGSHIQU",JSON.stringify(paramJSon),function(cityData){
			var cityData = typeof cityData == 'object'?cityData:JSON.parse(cityData);
			if (cityData.status == '-1') {
				rtnJSON.status = "-1";
			}else {
				rtnJSON = cityData;
				if(cityData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON.status = "0";
				}
			}
		});
	
	return rtnJSON;
}

//1.3 同 3.6获取开户行
function submit_1_3(paranJson){
	var rtnJSON = {};


		$.post("/zvdf/zvdws1012",JSON.stringify(paranJson),function(OpneAData){
			if (OpneAData.status == '-1') {
				rtnJSON = OpneAData;
				rtnJSON.status = "-1";
			}
			else {
				if(OpneAData.ES_PUBLIC.TYPE == 'S'){
					rtnJSON = OpneAData;
					rtnJSON.status = "0";
				}else{
					rtnJSON = OpneAData;
					rtnJSON.status = "-1";
				}
			}
		});

	return rtnJSON;
}

//2 基础数据  baseData
				var paramJSON_base = {
					"IS_PUBLIC":{
						"FLOWNO":"",
						"PERNR":"",
						"ZDOMAIN":"",
						"I_PAGENO":"",
						"I_PAGESIZE":""
					},
					"I_BUKRS":"",
					"I_EXCLUDE":"",
					"I_LIFNR":"",
					"I_TYPE":""
				};
function submit_2_1(baseJSON){
	var rtnJSON = {};
		$.post("/zvdf/ZVDF_VENDER_READ_BASICDATA",JSON.stringify(baseJSON),function(baseData){
			var baseData = typeof baseData == 'object'?baseData:JSON.parse(baseData);
			if (baseData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				rtnJSON = baseData;
				if(baseData.ES_PUBLIC.TYPE == 'S'){
					rtnJSON.status = "0";
				}else{
					rtnJSON.status = "-1";
				}
			}
		});
	
	return rtnJSON;
}

//2.2供应商主数据查询
function submit_2_2(keyWord,keyCompany){
	var paramJSON = {
		"IS_PUBLIC":IS_PUBLIC,
		"I_MCOD1":keyWord,
		"I_BUKRS":keyCompany?keyCompany:""
	};
	var rtnJSON = {};
		$.post("/zvdf/ZVDF_VENDER_CHECK",JSON.stringify(paramJSON),function(gsySearchData){
			var gsySearchData = typeof gsySearchData == 'object'?gsySearchData:JSON.parse(gsySearchData);
			if (gsySearchData.status == '-1') {
				rtnJSON.status = "-1";
			}else {
				rtnJSON = gsySearchData;
				if(gsySearchData.ES_PUBLIC.TYPE == 'S'){
					gsySearchData.status = "0";
				}else{
					gsySearchData.status = "-1";
				}
			}
		});
	
	return rtnJSON;
}

//2.3供应商名称检查 
function submit_2_3(keyWord){
	var paramJSON = {
		"IS_PUBLIC":IS_PUBLIC,
		"I_NAME":keyWord
	};
	var rtnJSON = {};
		$.post("/zvdf/ZVDF_VENDER_NAME_CHECK",JSON.stringify(paramJSON),function(gsySearchData){
			var gsySearchData = typeof gsySearchData == 'object'?gsySearchData:JSON.parse(gsySearchData);
			if (gsySearchData.status == '-1') {
				rtnJSON.status = "-1";
			}else {
				rtnJSON = gsySearchData;
				if(gsySearchData.ES_PUBLIC.TYPE == 'S'){
					gsySearchData.status = "0";
				}else{
					gsySearchData.status = "-1";
				}
			}
		});
	
	return rtnJSON;
}

//2.4新增申请提交
function submit_2_4(pernr,headJSON,bankItem){
	var rtnJSON = {};
	var paramJSON = {
		"IS_HEADER":headJSON,
		"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":pernr,
					"ZDOMAIN":"410",
					"I_PAGENO":"",
					"I_PAGESIZE":""
		},
		"IT_BANK":{
			"item":bankItem
		}
	};
		$.post("/zvdf/ZVDF_VENDER_APPLY",JSON.stringify(paramJSON),function(addData){
			var addData = typeof addData == 'object'?addData:JSON.parse(addData);
			if (addData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				rtnJSON = addData;
				if(addData.ES_PUBLIC.TYPE == 'S'){
					rtnJSON.status = "0";
				}else{
					rtnJSON.status = "-1";
				}
			}
		});
	
	return rtnJSON;
}


//2.5供应商数据读取
function submit_2_5(gysbm,gs_code,flag){
	switch (flag){
		case 'A'://扩充
			flag='E';
		break;
		case 'B'://修改
			flag='M';
		break;
		case 'C'://冻结
			flag='B';
		break;
	}
	var rtnJSON = {};
	var paramJSON = {
		"IS_PUBLIC":IS_PUBLIC,
		"I_BUKRS":gs_code,
		"I_LIFNR":gysbm,
		"I_SQLX":flag
	};
		$.post("/zvdf/ZVDF_GET_VENDER_DATA",JSON.stringify(paramJSON),function(searchData){
			var searchData = typeof searchData == 'object'?searchData:JSON.parse(searchData);
			if (searchData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				rtnJSON = searchData;
				if(searchData.ES_PUBLIC.TYPE == 'S'){
					rtnJSON.status = "0";
				}else{
					rtnJSON.status = "-1";
				}
			}
		});
	return rtnJSON;
}

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
function submit_3_3(yema,searchVal,formid){
	var rtnJSON = {};
	if(formid){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":"",
					"ZDOMAIN":"",
					"I_PAGENO":yema,
					"I_PAGESIZE":"10"
				},
				"IT_APP_LIST":{
					"item":formid
				},
				"I_MCOD1":searchVal
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

//3_3 供应商统一待办列表接口
function submit_3_3_pagesize(yema,searchVal,formid,pagesize){
	var rtnJSON = {};
	if(formid){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
					"FLOWNO":"",
					"PERNR":"",
					"ZDOMAIN":"",
					"I_PAGENO":yema,
					"I_PAGESIZE":pagesize
				},
				"IT_APP_LIST":{
					"item":formid
				},
				"I_MCOD1":searchVal
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

//3_3_3 供应商统一待办列表接口
function submit_3_3_3(searchVal,formid){
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
				"IT_APP_LIST":{
					"item":formid
				},
				"I_MCOD1":searchVal
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
//3_5 经理提交供应商主数据接口
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

//3_6 会计提交供应商主数据接口
function submit_3_6(pernr,SQLX,bussNo,FORM_ITEM,KTOKK,TYKM,CODE){
	var rtnJSON = {};
	if(bussNo){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
				"FLOWNO":'',
				"PERNR":pernr,
				"ZDOMAIN":'410',
				"I_PAGENO":'',
				"I_PAGESIZE":''
			},
			"IS_SUBMIT":{
				"SQLX":SQLX,
				"FORM_ID":bussNo,
				"FORM_ITEM":FORM_ITEM,
				"KTOKK":KTOKK,
				"AKONT":TYKM,
				"ZWELS":CODE
			}
		};
		$.post("/zmm/ZMM_VENDER_ACC_SUBMIT",JSON.stringify(paramJSon),function(submitListsData){
			// alert(JSON.stringify(submitListsData))
			var submitListsData = typeof submitListsData == 'object'?submitListsData:JSON.parse(submitListsData);
			if (submitListsData.status == '-1') {
				rtnJSON.status = "-1";
				rtnJSON.errMsg = checkNoChar(submitListsData.ES_PUBLIC.MESSAGE);
			}
			else {
				if(submitListsData.ES_PUBLIC.TYPE != 'S'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = checkNoChar(submitListsData.ES_PUBLIC.MESSAGE);
				}else if(submitListsData.ES_PUBLIC.TYPE == 'E'){
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


//3_7 会计-待审批-统驭科目和付款方式默认值
function submit_3_7(KTOKK){//KTOKK
	var rtnJSON = {};
	if(KTOKK){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
				"FLOWNO":'',
				"PERNR":'',
				"ZDOMAIN":'',
				"I_PAGENO":'',
				"I_PAGESIZE":''
			},
			"I_KTOKK":'Z001'
		};
		$.post("/zvdf/zvdws1013",JSON.stringify(paramJSon),function(TykmFkfsData){
			var TykmFkfsData = typeof TykmFkfsData == 'object'?TykmFkfsData:JSON.parse(TykmFkfsData);
			if (TykmFkfsData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(TykmFkfsData.ES_PUBLIC.TYPE != '0'){
					rtnJSON.status = "-1";
				}else if(TykmFkfsData.ES_PUBLIC.TYPE == '4'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = checkNoChar(TykmFkfsData.ES_PUBLIC.MESSAGE);
				}else{
					rtnJSON = TykmFkfsData;
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

//4_1 已办接口 类型VEND（供应商）得到返回id
function submit_4_1(pernr,begD,endD,startPage,pageSize){
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
			"beginDate":begD,
			"endDate":endD,
			"startPage":parseInt(startPage),
			"pageSize":pageSize
		}
	};
		$.post("/portal/PORTAL_BPMI_CompleteTaskSum",JSON.stringify(paramJSon),function(gystodoListsData){
			// alert(JSON.stringify(paramJSon))
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
//4_1 已办接口 类型VEND（供应商）得到返回id
function submit_4_1_1(pernr,begD,endD){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":{
				"FLOWNO":'',
				"PERNR":'',
				"ZDOMAIN":'',
				"I_PAGENO":'',
				"I_PAGESIZE":''
			},
			"I_BEGDA":begD,
			"I_ENDDA":endD,
			"I_PERNR":pernr
		};
		$.post("/zvdf/zvdws1014",JSON.stringify(paramJSon),function(gystodoListsData){
			rtnJSON = gystodoListsData;
			rtnJSON.status = "0";
		});
	}else{
		rtnJSON.status = "-1";
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


//4.3 已审批获取修改前修改后数据
function submit_4_3(bussNo){
	var rtnJSON = {};
	if(bussNo){
		//拼接提交参数
		var paramJSon = {
			"FORM_ID":bussNo,
			"FORM_ITEM":1,
			"IS_PUBLIC":{
				"FLOWNO":'',
				"PERNR":'',
				"ZDOMAIN":'',
				"I_PAGENO":'',
				"I_PAGESIZE":''
			}
		}
		$.post("/zmm/ZMM_VENDER_GET_CHANGE",JSON.stringify(paramJSon),function(ModifyData){
			if( ModifyData.ES_PUBLIC.TYPE != 'S' ){
				rtnJSON.status = "-1";
				rtnJSON = ModifyData;
			}else{
				rtnJSON = ModifyData;
				rtnJSON.status = "0";
			}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}