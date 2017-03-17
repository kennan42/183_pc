//申请人信息
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
//4_1 已办接口 类型VEND（供应商）得到返回id
function submit_4_1(pernr,startPage,pageSize){
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