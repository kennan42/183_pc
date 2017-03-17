/*
1.登录
*/

var IS_PUBLIC={
						"FLOWNO":"",
						"PERNR":"",
						"ZDOMAIN":"410",
						"I_PAGENO":"",
						"I_PAGESIZE":""
					};
/*
2.个人考勤
*/
//2.1个人考勤月历概览
function submit_2_1(myOverviewData,json_ym,p){
	
	var temp_d = new Date();
	var temp_y = temp_d.getFullYear();
	var temp_m = temp_d.getMonth()+1;
	var temp_date = temp_d.getDate();
	var temp_c = temp_y + '-' +(temp_m<10?'0':'')+temp_m+'-'+temp_date;
	var EventsArr = [];
	var clockArr = [];
	var dateArr = [];
	var clockJson = {};
	var className1 = 'label-success';
	
	
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
			"P_BEGDA":getMonth1(json_ym),
			"P_ENDDA":getMonth2(json_ym),
			"P_PERNR":p
		};
		$.post("/zhrws/ZHRWS_MY_TIME_CALENDAR",JSON.stringify(paramJSon),function(calendarData){
			var calendarData = typeof calendarData == 'object'?calendarData:JSON.parse(calendarData);
			if (calendarData.status == '-1') {
				alert(errMsg);
				return;
			}
			else {
				if (calendarData.RETURN_SUBRC != '0') {
					alert(errMsg);
					return;
				}
				else {
					var calendarItem = calendarData.MY_TIME_CALE.item;
					//有新入职的员工，其实日期补全
					var item1 = calendarItem[0];
					if(checkNoChar(item1.DATUM).substring(8,10) != '01'){
					    var tempArr = [];
					    var temp_day = parseInt(checkNoChar(item1.DATUM).substring(8,10));
					    var temp_month = parseInt(checkNoChar(item1.DATUM).substring(0,8));
					    var temp_DATUM = '';
					    for(var temp_dayI=1;temp_dayI<temp_day;temp_dayI++){
					        temp_DATUM = temp_month + '' + (temp_dayI<10?'0':'')+temp_dayI;
					        tempArr.push({"DATUM":temp_DATUM,"TAGTY":2});
					    }
					    
					    calendarItem = tempArr.concat(calendarItem);
					}
					
					
					for(var k in myOverviewData){
						clockArr = checkNoChar(myOverviewData[k].CLOCK)?checkNoChar(myOverviewData[k].CLOCK).split(','):[];
						//dateArr = checkNoChar(myOverviewData[k].DATUM).split('-');
						var isError = checkNoChar(myOverviewData[k].STATUS) == '3'?true:false;
						//异常数据使用 label-yellow
						if(isError){
							className1 = 'label-yellow';
						}else{
							if(calendarItem[k].TAGTY == '0'){
								className1 = 'label-success';
							}else{
								className1 = 'label-wh';
							}
							
						}
						
						if(clockArr.length==0){
							if(isError){
								clockJson = {
									title:'',
									start:myOverviewData[k].DATUM,
									className:className1,
									allDay: true
									};
								EventsArr.push(clockJson);
							}else{
								if(new Date(temp_c) > new Date(myOverviewData[k].DATUM)){
									clockJson = {
										title:'',
										start:myOverviewData[k].DATUM,
										className:className1,
										allDay: true
										};
									EventsArr.push(clockJson);
								}
								
							}
							
						}else{
							for(var ki in clockArr){
								if(clockArr[ki].indexOf(';')>-1){
									var temp_infos = clockArr[ki].split(';');
									for(var ti in temp_infos){
										clockJson = {
											title:temp_infos[ti],
											//start:new Date(dateArr[0],parseInt(dateArr[1])-1,dateArr[2]),
											start:myOverviewData[k].DATUM,
											className:className1,
											allDay: true
											};
										EventsArr.push(clockJson);
									}
									
//								clockJson = {
//									title:clockArr[ki].split(';')[1],
//									//start:new Date(dateArr[0],parseInt(dateArr[1])-1,dateArr[2]),
//									start:myOverviewData[k].DATUM,
//									className:className1,
//									allDay: true
//									};
//								EventsArr.push(clockJson);
								}else{
									clockJson = {
									title:clockArr[ki],
									//start:new Date(dateArr[0],parseInt(dateArr[1])-1,dateArr[2]),
									start:myOverviewData[k].DATUM,
									className:className1,
									allDay: true
									};
								EventsArr.push(clockJson);
								}
								
							}
						}
	}
				}
			}
		});
	
	
	
	return EventsArr;
}

//2.2个人考勤概览
function submit_2_2(json_ym,myOverviewData,p){
	//var myOverviewData = [];
	//var pernr = localStorage.pernrBase;
	if(p){
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
			"P_BEGDA":getMonth1(json_ym),
			"P_ENDDA":getMonth2(json_ym),
			"P_PERNR":p
		};
		$.post("/zhrws/ZHRWS_MY_TIME_OVERVIEW",JSON.stringify(paramJSon),function(overviewData){
			var overviewData = typeof overviewData == 'object'?overviewData:JSON.parse(overviewData);
			if (overviewData.status == '-1') {
				alert(errMsg);
			}
			else {
				if (overviewData.RETURN_SUBRC != '0') {
					//alert("" == checkNoChar(overviewData.RETURN_MESSAGE) ? errMsg1 : overviewData.RETURN_MESSAGE);
					
				}
				else {
					myOverviewData = myOverviewData.concat(overviewData.MY_TIME_OVERVIEW.item); //考勤信息概览列表
				}
			}
		});
	}else{
		//alert(noUserMsg);
		
	}
	return myOverviewData;
}


//2.3base 把考勤概览数组转化成日历上显示的日程数组
function submit_2_3(myOverviewData){
	var temp_d = new Date();
	var temp_y = temp_d.getFullYear();
	var temp_m = temp_d.getMonth()+1;
	var temp_date = temp_d.getDate();
	var temp_c = temp_y + '-' +(temp_m<10?'0':'')+temp_m+'-'+temp_date;
	var EventsArr = [];
	var clockArr = [];
	var dateArr = [];
	var clockJson = {};
	var className1 = 'label-success';
	for(var k in myOverviewData){
		clockArr = checkNoChar(myOverviewData[k].CLOCK)?checkNoChar(myOverviewData[k].CLOCK).split(','):[];
		//dateArr = checkNoChar(myOverviewData[k].DATUM).split('-');
		var isError = checkNoChar(myOverviewData[k].STATUS) == '3'?true:false;
		//异常数据使用 label-yellow
		if(isError){
			className1 = 'label-yellow';
		}else{
			className1 = 'label-success';
		}
		
		if(clockArr.length==0){
			if(isError){
				clockJson = {
					title:'',
					start:myOverviewData[k].DATUM,
					className:className1,
					allDay: true
					};
				EventsArr.push(clockJson);
			}else{
//				if(new Date(temp_c) > new Date(myOverviewData[k].DATUM)){
//					clockJson = {
//						title:'',
//						start:myOverviewData[k].DATUM,
//						className:className1,
//						allDay: true
//						};
//					EventsArr.push(clockJson);
//				}
				
			}
			
		}else{
			for(var ki in clockArr){
				clockJson = {
					title:clockArr[ki],
					//start:new Date(dateArr[0],parseInt(dateArr[1])-1,dateArr[2]),
					start:myOverviewData[k].DATUM,
					className:className1,
					allDay: true
					};
				EventsArr.push(clockJson);
			}
		}
	}
	return EventsArr;
}

//2.4日历视图上下月切换
function getOverView(type){
	var showY = $('#showY').val();
	var showM = $('#showM').val();
	if(type == 'pre'){
		if(showM == '0'){
			aa = layer.load('正在加载数据，请稍后');
			showM = '11';
			showY = parseInt(showY)-1;
			window.location.href="/web/perAttendance.html?y="+showY+"&m="+showM;
		}else{
			showM = parseInt(showM)-1;
			window.location.href="/web/perAttendance.html?y="+showY+"&m="+showM;
		}
	}else{
		if(showM == '11'){
			aa = layer.load('正在加载数据，请稍后');
			showM = '0';
			showY = parseInt(showY)+1;
			window.location.href="/web/perAttendance.html?y="+showY+"&m="+showM;
		}else{
			showM = parseInt(showM)+1;
			window.location.href="/web/perAttendance.html?y="+showY+"&m="+showM;
		}
	}
	$('#showY').val(showY);
	$('#showM').val(showM);
	
	//var myOverviewData = submit_2_2({"year":showY,"month":parseInt(showM)+1});
	//var EventsArr = submit_2_3(myOverviewData);
	//$('#calendar').html('');
//	var calendar = $('#calendar').fullCalendar({
//		events:EventsArr
//	});
	
	//for(var i =0,len=EventsArr.length;i<len;i++){
	//	$('#calendar').fullCalendar('renderEvent', EventsArr[i], true);
	//}
	
} 

//2.5个人考勤之异常信息
function submit_2_5(date8,pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
			"BEGDA":date8,
			"ENDDA":date8,
			"T_PERNR": {
								        "item": [{
								           "PERNR": pernr
								         }]
								     }
		};
		$.post("/zhrws/ZHRWS_TIME_ERROR",JSON.stringify(paramJSon),function(attError){
			var attError = typeof attError == 'object'?attError:JSON.parse(attError);
			if (attError.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(attError.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = attError;
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

//2.6个人考勤补签卡提交
function submit_2_6(paramJson){
	var rtnJSON = {};
		$.post("/zhr/ZHR_WF_SUBMIT_CLOCK",JSON.stringify(paramJson),function(subClockData){
			var subClockData = typeof subClockData == 'object'?subClockData:JSON.parse(subClockData);
			if (subClockData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(subClockData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = checkNoChar(subClockData.RETURN_MESSAGE);
				}else{
					rtnJSON = subClockData;
					rtnJSON.status = "0";
				}
			}
		});
	
	return rtnJSON;
}

//2.7个人考勤补签卡出差事由提交
function submit_2_7(paramJson){
	var rtnJSON = {};
		$.post("/zhr/ZHR_WF_SUBMIT_AT",JSON.stringify(paramJson),function(subATData){
			var subATData = typeof subATData == 'object'?subATData:JSON.parse(subATData);
			if (subATData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(subATData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = checkNoChar(subATData.RETURN_MESSAGE);
				}else{
					rtnJSON = subATData;
					rtnJSON.status = "0";
				}
			}
		});
	
	return rtnJSON;
}

//2.8个人考勤之排班信息
function submit_2_8(date8,pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
		    "IS_PUBLIC":IS_PUBLIC,
			"BEGDA":date8,
			"ENDDA":date8,
			"T_PERNR": {
								        "item": [{
								           "PERNR": pernr
								         }]
								     }
		};
		$.post("/zhrws/ZHRWS_TIME_DWS",JSON.stringify(paramJSon),function(pbData){
			var pbData = typeof pbData == 'object'?pbData:JSON.parse(pbData);
			if (pbData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(pbData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = pbData;
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

//2.9个人考勤之差旅信息
function submit_2_9(date8,pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
		    "IS_PUBLIC":IS_PUBLIC,
			"BEGDA":date8,
			"ENDDA":date8,
			"T_PERNR": {
								        "item": [{
								           "PERNR": pernr
								         }]
								     }
		};
		$.post("/zhrws/ZHRWS_TIME_ATTENDANCE",JSON.stringify(paramJSon),function(travelData){
			var travelData = typeof travelData == 'object'?travelData:JSON.parse(travelData);
			if (travelData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(travelData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					if(undefined == travelData.TIME_ATTENDANCE.item){
						rtnJSON.status = "-1";
					}else{
						rtnJSON = travelData;
						rtnJSON.status = "0";
					}
					
				}
			}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}

//2.10个人考勤之休假信息
function submit_2_10(date8,pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
		    "IS_PUBLIC":IS_PUBLIC,
			"BEGDA":date8,
			"ENDDA":date8,
			"T_PERNR": {
								        "item": [{
								           "PERNR": pernr
								         }]
								     }
		};
		$.post("/zhrws/ZHRWS_TIME_ABSENCE",JSON.stringify(paramJSon),function(leaveData){
			var leaveData = typeof leaveData == 'object'?leaveData:JSON.parse(leaveData);
			if (leaveData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(leaveData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					if(undefined == leaveData.TIME_ABSENCE.item){
						rtnJSON.status = "-1";
					}else{
						rtnJSON = leaveData;
						rtnJSON.status = "0";
					}
					
				}
			}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}

//2.11个人考勤之加班信息
function submit_2_11(date8,pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
		    "IS_PUBLIC":IS_PUBLIC,
			"BEGDA":date8,
			"ENDDA":date8,
			"T_PERNR": {
								        "item": [{
								           "PERNR": pernr
								         }]
								     }
		};
		$.post("/zhrws/ZHRWS_TIME_OVERTIME",JSON.stringify(paramJSon),function(otData){
			var otData = typeof otData == 'object'?otData:JSON.parse(otData);
			if (otData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(otData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					if(undefined == otData.TIME_OVERTIME.item){
						rtnJSON.status = "-1";
					}else{
						rtnJSON = otData;
						rtnJSON.status = "0";
					}
					
				}
			}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}

//2.12个人考勤之刷卡信息
function submit_2_12(date8,pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
		    "IS_PUBLIC":IS_PUBLIC,
			"BEGDA":date8,
			"ENDDA":date8,
			"T_PERNR": {
								        "item": [{
								           "PERNR": pernr
								         }]
								     }
		};
		$.post("/zhrws/ZHRWS_TIME_CLOCK",JSON.stringify(paramJSon),function(skData){
			var skData = typeof skData == 'object'?skData:JSON.parse(skData);
			if (skData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(skData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = skData;
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
//2.13个人考勤补签卡提交前的校验
function submit_2_13(paramJ){
	var rtnJSON = {};
		$.post("/zhrws/ZHRWS_CHECK_CLOCK_REPEAT",JSON.stringify(paramJ),function(checkData){
			var checkData = typeof checkData == 'object'?checkData:JSON.parse(checkData);
			if (checkData.status == '-1') {
				rtnJSON.status = "-1";
			}else {
				rtnJSON = checkData;
				rtnJSON.status = "0";
			}
		});
	
	return rtnJSON;
}


//3.个人人事
//3.1读取员工基本信息  返回json数据
function submit_3_1(pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IT_EXTENDMAP":{
											"item": [{
												"FIELDNAME":'',
												"VALUE":''
											}]
											},
			"I_PUBLIC":{
				"CHANNELSERIALNO":'',
				"ORIGINATETELLERID":'',
				"ZDOMAIN":'100',
				"I_PAGENO":'',
				"I_PAGESIZE":'',
				"ZVERSION":''
			},
			"KEYDATE":getToday8(),
			"P_PERNR":pernr,
			"P_PLANS":''
		};
		$.post("/zhrmss/ZHRMMS_READ_EE_INFO",JSON.stringify(paramJSon),function(eeInfoData){
			var eeInfoData = typeof eeInfoData == 'object'?eeInfoData:JSON.parse(eeInfoData);
			if (eeInfoData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(eeInfoData.E_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = eeInfoData;
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

//3.2读取员工头像数据  返回json数据
function submit_3_2(pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IT_EXTENDMAP":{
											"item": [{
												"FIELDNAME":'',
												"VALUE":''
											}]
											},
			"I_PUBLIC":{
				"CHANNELSERIALNO":'',
				"ORIGINATETELLERID":'',
				"ZDOMAIN":'100',
				"I_PAGENO":'',
				"I_PAGESIZE":'',
				"ZVERSION":''
			},
			"P_PERNR":pernr
		};
		$.post("/zhrmss/ZHRMMS_READ_PHOTO",JSON.stringify(paramJSon),function(photoData){
			var photoData = typeof photoData == 'object'?photoData:JSON.parse(photoData);
			if (photoData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(photoData.E_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = photoData;
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


//3.3读取培训履历  返回json数据
function submit_3_3(pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IT_EXTENDMAP":{
											"item": [{
												"FIELDNAME":'',
												"VALUE":''
											}]
											},
			"I_PUBLIC":{
				"CHANNELSERIALNO":'',
				"ORIGINATETELLERID":'',
				"ZDOMAIN":'100',
				"I_PAGENO":'',
				"I_PAGESIZE":'',
				"ZVERSION":''
			},
			"P_PERNR":pernr
		};
		$.post("/zhrmss/ZHRMMS_READ_EE_TRAIN",JSON.stringify(paramJSon),function(trainData){
			var trainData = typeof trainData == 'object'?trainData:JSON.parse(trainData);
			if (trainData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(trainData.E_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = trainData;
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

//3.4读取教育履历  返回json数据
function submit_3_4(pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IT_EXTENDMAP":{
											"item": [{
												"FIELDNAME":'',
												"VALUE":''
											}]
											},
			"I_PUBLIC":{
				"CHANNELSERIALNO":'',
				"ORIGINATETELLERID":'',
				"ZDOMAIN":'100',
				"I_PAGENO":'',
				"I_PAGESIZE":'',
				"ZVERSION":''
			},
			"P_PERNR":pernr
		};
		$.post("/zhrmss/ZHRMMS_READ_EE_EDU",JSON.stringify(paramJSon),function(eduData){
			var eduData = typeof eduData == 'object'?eduData:JSON.parse(eduData);
			if (eduData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(eduData.E_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = eduData;
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

//3.5读取薪资卡信息 返回json数据
function submit_3_5(pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IT_EXTENDMAP":{
											"item": [{
												"FIELDNAME":'',
												"VALUE":''
											}]
											},
			"I_PERNR":pernr,
			"I_PUBLIC":{
				"CHANNELSERIALNO":'',
				"ORIGINATETELLERID":'',
				"ZDOMAIN":'100',
				"I_PAGENO":'',
				"I_PAGESIZE":'',
				"ZVERSION":''
			}
		};
		$.post("/zhrws/ZHRWSESS01",JSON.stringify(paramJSon),function(cardData){
			var cardData = typeof cardData == 'object'?cardData:JSON.parse(cardData);
			if (cardData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(cardData.E_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = cardData;
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

//3.6获取开户行
function submit_3_6(paranJson){
	var rtnJSON = {};


		$.post("/zhrws/ZBCMFORCE59",JSON.stringify(paranJson),function(OpneAData){
			var OpneAData = typeof OpneAData == 'object'?OpneAData:JSON.parse(OpneAData);
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
//3.7修改银行卡信息
function submit_3_7(paranJson){
	var rtnJSON = {};

		$.post("/zhrws/ZHRWSESS07",JSON.stringify(paranJson),function(SaveAData){
			var SaveAData = typeof SaveAData == 'object'?SaveAData:JSON.parse(SaveAData);
			if (SaveAData.status == '-1') {
				rtnJSON = SaveAData;
				rtnJSON.status = "-1";
			}
			else {
				if(SaveAData.E_PUBLIC.TYPE == 'S'){
					rtnJSON = SaveAData;
					rtnJSON.status = "0";
				}else{
					rtnJSON = SaveAData;
					rtnJSON.status = "-1";
				}
			}
		});

	return rtnJSON;
}

//4.部门管理
//4.1当前人员部门树
function submit_4_1(p_obj){
	var rtnJSON = {};
	//var pernr = localStorage.pernrBase;
	if(p_obj){
		//拼接提交参数
		var paramJSon = {
			"IT_EXTENDMAP":{
											"item": [{
												"FIELDNAME":'',
												"VALUE":''
											}]
											},
			"I_PUBLIC":{
				"CHANNELSERIALNO":'',
				"ORIGINATETELLERID":'',
				"ZDOMAIN":'100',
				"I_PAGENO":'',
				"I_PAGESIZE":'',
				"ZVERSION":''
			},
			"P_OBJ":p_obj
		};
		$.post("/base/GET_DEPT_TREE",JSON.stringify(paramJSon),function(orgData){
			var orgData = typeof orgData == 'object'?orgData:JSON.parse(orgData);
			if (orgData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(orgData.E_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = orgData;
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

//4.2搜索部门下人员
function submit_4_2(freetext,pernr){
	var rtnJSON = {};
	//var pernr = localStorage.pernrBase;
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"FREETEXT":'*'+trim(freetext)+'*',
			"IT_EXTENDMAP":{
											"item": [{
												"FIELDNAME":'',
												"VALUE":''
											}]
											},
			"I_PUBLIC":{
				"CHANNELSERIALNO":'',
				"ORIGINATETELLERID":pernr,
				"ZDOMAIN":'100',
				"I_PAGENO":'',
				"I_PAGESIZE":'',
				"ZVERSION":''
			}
		};
		$.post("/zhrmss/ZHRMMS_QRY_PERSON_IN_DEPT",JSON.stringify(paramJSon),function(searchData){
			var searchData = typeof searchData == 'object'?searchData:JSON.parse(searchData);
			if (searchData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(searchData.E_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = searchData;
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

//4.3保存修改常驻地和第二办公地
function submit_4_3(paramJSon){
	var rtnJSON = {};
		
		$.post("/zhrmss/ZHRMMS_IT9120_INS",JSON.stringify(paramJSon),function(searchData){
			var searchData = typeof searchData == 'object'?searchData:JSON.parse(searchData);
			if (searchData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(searchData.E_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = searchData;
					rtnJSON.status = "0";
				}
			}
		});
	
	return rtnJSON;
}

//4.4保存修改直线领导
function submit_4_4(paramJSon){
	var rtnJSON = {};
		
		$.post("/zhrmss/ZHRMMS_OBJECT_RELA_INS",JSON.stringify(paramJSon),function(changeData){
			var changeData = typeof changeData == 'object'?changeData:JSON.parse(changeData);
			if (changeData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				rtnJSON = changeData;
				if(changeData.E_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON.status = "0";
				}
				
			}
		});
	
	return rtnJSON;
}

//4.5团队考勤之异常信息
function submit_4_5(pernrArr,begD,endD){
	var rtnJSON = {};
	if(pernrArr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
			"BEGDA":begD,
			"ENDDA":endD,
			"T_PERNR": {
								        "item":pernrArr
								     }
		};
		$.post("/zhrws/ZHRWS_TIME_ERROR",JSON.stringify(paramJSon),function(attError){
			var attError = typeof attError == 'object'?attError:JSON.parse(attError);
			if (attError.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(attError.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = attError;
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

//4.6团队考勤之差旅信息
function submit_4_6(pernrArr,begD,endD){
	var rtnJSON = {};
	if(pernrArr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
			"BEGDA":begD,
			"ENDDA":endD,
			"T_PERNR": {
								        "item":pernrArr
								     }
		};
		$.post("/zhrws/ZHRWS_TIME_ATTENDANCE",JSON.stringify(paramJSon),function(travelData){
			var travelData = typeof travelData == 'object'?travelData:JSON.parse(travelData);
			if (travelData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(travelData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = travelData;
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

//4.7团队考勤之加班信息
function submit_4_7(pernrArr,begD,endD){
	var rtnJSON = {};
	if(pernrArr){
		//拼接提交参数
		var paramJSon = {
			"BEGDA":begD,
			"ENDDA":endD,
			"T_PERNR": {
								        "item":pernrArr
								     }
		};
		$.post("/zhrws/ZHRWS_TIME_OVERTIME",JSON.stringify(paramJSon),function(otData){
			var otData = typeof otData == 'object'?otData:JSON.parse(otData);
			if (otData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(otData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = otData;
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

//4.8团队考勤之休假信息
function submit_4_8(pernrArr,begD,endD){
	var rtnJSON = {};
	if(pernrArr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
			"BEGDA":begD,
			"ENDDA":endD,
			"T_PERNR": {
								        "item":pernrArr
								     }
		};
		$.post("/zhrws/ZHRWS_TIME_ABSENCE",JSON.stringify(paramJSon),function(vaData){
			var vaData = typeof vaData == 'object'?vaData:JSON.parse(vaData);
			if (vaData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(vaData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = vaData;
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

//4.9已审批 加班和异常条数
function submit_4_9(pernr,waflag,bedD,endD){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
			"P_BEGDA":bedD,
			"P_ENDDA":endD,
		"P_SP_PERNR":pernr,
		"P_SP_STATUS":waflag
	};
		$.post("/zhrws/ZHRWS_GET_OT_CO_LINES",JSON.stringify(paramJSon),function(waCountData){
			var waCountData = typeof waCountData == 'object'?waCountData:JSON.parse(waCountData);
				if(waCountData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = waCountData;
					rtnJSON.status = "0";
				}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}

//4.10获取该部门下所有人员清单
function submit_4_10(ORGEH){
	var rtnJSON = {};
	if(ORGEH){
		//拼接提交参数
		var paramJSon = {
			"IT_EXTENDMAP":{
											"item": [{
												"FIELDNAME":'',
												"VALUE":''
											}]
											},
			"I_PUBLIC":{
				"CHANNELSERIALNO":'',
				"ORIGINATETELLERID":'',
				"ZDOMAIN":'100',
				"I_PAGENO":'',
				"I_PAGESIZE":'',
				"ZVERSION":''
			},
			"I_SEARCH_TYPE":'C',
			"ORGEH":ORGEH
	};
		$.post("/zbcm/zbcmwsforios10",JSON.stringify(paramJSon),function(persData){
			var persData = typeof persData == 'object'?persData:JSON.parse(persData);
				if(persData.E_PUBLIC.TYPE != 'S'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = persData;
					rtnJSON.status = "0";
				}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}

//4.11保存手机号
function submit_4_11(paramJSon){
	var rtnJSON = {};
		
		$.post("/zbcm/zbcm_update_phone_no",JSON.stringify(paramJSon),function(changeData){
			var changeData = typeof changeData == 'object'?changeData:JSON.parse(changeData);
			if (changeData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(changeData.E_PUBLIC.TYPE == 'E'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = checkNoChar(changeData.E_PUBLIC.MESSAGE);
				}else{
					rtnJSON = changeData;
					rtnJSON.status = "0";
				}
			}
		});
	
	return rtnJSON;
}

//4.12团队管理之条数 2001 2005 2011
function submit_4_12(paramJSon){
	var rtnJSON = {};
		
		$.post("/zhrws/ZHRWS_GET_DEPT_LINES",JSON.stringify(paramJSon),function(changeData){
			var changeData = typeof changeData == 'object'?changeData:JSON.parse(changeData);
			if (changeData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(changeData.E_PUBLIC.TYPE != '0'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = checkNoChar(changeData.E_PUBLIC.MESSAGE);
				}else{
					rtnJSON = changeData;
					rtnJSON.status = "0";
				}
			}
		});
	
	return rtnJSON;
}


//5.公共
//5.1省市区接口获取数据
function submit_5_1(I_ZLEVL,I_ZPRID){
	var rtnJSON = {};
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
				"I_ZLEVL":I_ZLEVL,
				"I_ZPRID":I_ZPRID
		};
		$.post("/base/BASE_SHENGSHIQU",JSON.stringify(paramJSon),function(addData){
			var addData = typeof addData == 'object'?addData:JSON.parse(addData);
			if (addData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(addData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = addData;
					rtnJSON.status = "0";
				}
			}
		});
	
	return rtnJSON;
}

//5.2获取休假类型AB_TYPE
//签卡原因QKYY
function submit_5_2(flag){
	var rtnJSON = {};
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
				"P_KEYDATE":getToday8(),
				"P_PARA":flag
		};
		$.post("/base/BASE_CONFIG_DETAILED_LIST",JSON.stringify(paramJSon),function(configData){
			var configData = typeof configData == 'object'?configData:JSON.parse(configData);
			if (configData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(configData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = configData;
					rtnJSON.status = "0";
				}
			}
		});
	
	return rtnJSON;
}

//5.3由工号获得姓名、岗位、公司、部门、电话
function submit_5_3(pernr){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
			"P_DATE":getToday8(),
			"P_PERNR":{
								"item": [{
												"PERNR":pernr
											}]
											}
		};
		$.post("/zhr/ZHR_GET_PER_EASY_INFO",JSON.stringify(paramJSon),function(perData){
			var perData = typeof perData == 'object'?perData:JSON.parse(perData);
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


//6.人员模糊查询
//6.1获取数据
function submit_6_1(P_PNAME){
	var rtnJSON = {};
		//拼接提交参数
		var paramJSon = {
			"IT_EXTENDMAP":{
											"item": [{
												"FIELDNAME":'',
												"VALUE":''
											}]
											},
			"I_PUBLIC":{
				"CHANNELSERIALNO":'',
				"ORIGINATETELLERID":'',
				"ZDOMAIN":'100',
				"I_PAGENO":'',
				"I_PAGESIZE":'',
				"ZVERSION":''
			},
			"P_PNAME":'*'+P_PNAME+'*'
		};
		$.post("/base/GET_PERSON_INFO_LIKE",JSON.stringify(paramJSon),function(searchData){
			var searchData = typeof searchData == 'object'?searchData:JSON.parse(searchData);
			if (searchData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(searchData.E_PUBLIC.TYPE == 'E'){
					rtnJSON = searchData;
					rtnJSON.status = "-1";
					
				}else{
					rtnJSON = searchData;
					rtnJSON.status = "0";
				}
			}
		});
	
	return rtnJSON;
}

//7.是否考勤员接口
//7.1获取数据
function submit_7_1(pernr){
	var rtnJSON = {};
	//var pernr = localStorage.pernrBase;
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
			"I_PERNR":pernr
		};
		$.post("/base/BASE_IS_KAOQINYUAN",JSON.stringify(paramJSon),function(ifKQYData){
			var ifKQYData = typeof ifKQYData == 'object'?ifKQYData:JSON.parse(ifKQYData);
			if (ifKQYData.status == '-1') {
				rtnJSON.status = "-1";
			}else if (ifKQYData.status == '-2') {
				rtnJSON.status = "-2";
			}else {
				if(ifKQYData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = ifKQYData;
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

//8.休假申请相关
//8.1.加班可调休时数
function submit_8_1(pernr){
	var rtnJSON = {};
	//var pernr = localStorage.pernrBase;
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
		"BEGDA":'',
		"ENDDA":'',
		"T_PERNR": [
							    {
							        "item": {
							           "PERNR": pernr
							         }
							     }
						 ]
	};
		$.post("/zhrws/ZHRWS_TIME_OT_QUOTA",JSON.stringify(paramJSon),function(useTimeData){
			var useTimeData = typeof useTimeData == 'object'?useTimeData:JSON.parse(useTimeData);
			if (useTimeData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(useTimeData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = useTimeData;
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

//8.2计算休假天数
function submit_8_2(pJson){
	var rtnJSON = {};
		//拼接提交参数
		$.post("/zhrws/ZHRWS_WF_GET_DAY_COUNT",JSON.stringify(pJson),function(dayCountData){
			var dayCountData = typeof dayCountData == 'object'?dayCountData:JSON.parse(dayCountData);
			if (dayCountData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(dayCountData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = checkNoChar(dayCountData.RETURN_MESSAGE);
				}else{
					rtnJSON = dayCountData;
					rtnJSON.status = "0";
				}
			}
		});
	
	return rtnJSON;
}

//8.3休假申请提交
function submit_8_3(fjArr,pJSON,pernr){
	var rtnJSON = {};
	var FORM_TAB = [];
	var itemArr = [];
	itemArr.push(pJSON);
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
		"FORM_TAB": {
			"item":fjArr
		},
		"IT_P2001":  {
							        "item":itemArr
							     },
			"P_BUSINESS_TYPE":"2001",
			"P_FILL_FORM_PERNR":pernr
	};
		$.post("/zhr/ZHR_WF_SUBMIT_AB",JSON.stringify(paramJSon),function(sbAbData){
			var sbAbData = typeof sbAbData == 'object'?sbAbData:JSON.parse(sbAbData);
			if (sbAbData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(sbAbData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = checkNoChar(sbAbData.RETURN_MESSAGE);
				}else{
					rtnJSON = sbAbData;
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

//8.4休假待审批列表 CE
function submit_8_4(pernr,startPage,pageSize){
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
			"bussType":"2001",
			"startPage":parseInt(startPage),
			"pageSize":pageSize
		}
	};
		$.post("/portal/PORTAL_BPMI_TaskListQry",JSON.stringify(paramJSon),function(waVacationListsData){
			var waVacationListsData = typeof waVacationListsData == 'object'?waVacationListsData:JSON.parse(waVacationListsData);
			if (waVacationListsData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(waVacationListsData.output.type != 'S'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = waVacationListsData;
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

//8.5休假待审批详情 ECC
function submit_8_5(P_FORM_ID){
	var rtnJSON = {};
	//var pernr = localStorage.pernrBase;
	if(P_FORM_ID){
		//拼接提交参数
		var paramJSon = {
		"IS_PUBLIC":IS_PUBLIC,
		"DOC_TYPE":'A',
		"P_BUSI_TYPE":'2001',
		"P_FORM_ID":P_FORM_ID
		};
		$.post("/zhrws/ZHRWS_WF_GET_FORM_AB",JSON.stringify(paramJSon),function(xiujiaDetailData){
			var xiujiaDetailData = typeof xiujiaDetailData == 'object'?xiujiaDetailData:JSON.parse(xiujiaDetailData);
			if (xiujiaDetailData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(xiujiaDetailData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = xiujiaDetailData;
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

//8.6休假审批提交 CE
function submit_8_6(vaJSON){
	var rtnJSON = {};
		$.post("/portal/PORTAL_BPMI_AprPred",JSON.stringify(vaJSON),function(vaSubData){
			var vaSubData = typeof vaSubData == 'object'?vaSubData:JSON.parse(vaSubData);
			if (vaSubData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(vaSubData.output.type != 'S'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = vaSubData.output.message?vaSubData.output.message:'';
				}else{
					rtnJSON = vaSubData;
					rtnJSON.status = "0";
				}
			}
		});
	
	return rtnJSON;
}

//8.7休假已审批列表 CE
function submit_8_7(pernr,startPage,pageSize,begD,endD){
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
			"bussType":"2001",
			"beginDate":begD,
			"endDate":endD,
			"startPage":parseInt(startPage),
			"pageSize":pageSize
		}
	};
		$.post("/portal/PORTAL_BPMI_CompleteTaskSum",JSON.stringify(paramJSon),function(aaVacationListsData){
			var aaVacationListsData = typeof aaVacationListsData == 'object'?aaVacationListsData:JSON.parse(aaVacationListsData);
				if(aaVacationListsData.output.type != 'S'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = aaVacationListsData;
					rtnJSON.status = "0";
				}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}

//8.8获取审批路径 CE
function submit_8_8(pernr,bussNo){
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
			"bussType":"2001",
			"bussNo":bussNo
		}
	};
		$.post("/portal/PORTAL_BPMI_ProcPathQry",JSON.stringify(paramJSon),function(aaVacationWayData){
			var aaVacationWayData = typeof aaVacationWayData == 'object'?aaVacationWayData:JSON.parse(aaVacationWayData);
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

//8.9休假取消流程 CE
function submit_8_9(vaJSON){
	var rtnJSON = {};
		$.post("/portal/PORTAL_BPMI_ProcCancel",JSON.stringify(vaJSON),function(vaSubData){
			var vaSubData = typeof vaSubData == 'object'?vaSubData:JSON.parse(vaSubData);
			if (vaSubData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
				if(vaSubData.output.type != 'S'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = checkNoChar(vaSubData.output.message);
				}else{
					rtnJSON = vaSubData;
					rtnJSON.status = "0";
				}
			}
		});
	
	return rtnJSON;
}

//8.10 休假申请重复性校验
function submit_8_10(fjArr,pJSON,pernr){
	var rtnJSON = {};
	var itemArr = [];
	if(pernr){
		//拼接提交参数
		var paramJSon = {
		"IS_P2001": pJSON,
		"IS_PUBLIC":IS_PUBLIC,
	};
		$.post("/zhrws/ZHRWS_CHECK_AB_REPEAT",JSON.stringify(paramJSon),function(sbAbData){
			var sbAbData = typeof sbAbData == 'object'?sbAbData:JSON.parse(sbAbData);
			if (sbAbData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
					rtnJSON = sbAbData;
					rtnJSON.status = "0";
			}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}


//9加班和考勤异常条数
function submit_9_1(pernr,waflag){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
		"IS_PUBLIC":IS_PUBLIC,
		"P_SP_PERNR":pernr,
		"P_SP_STATUS":waflag
	};
		$.post("/zhrws/ZHRWS_GET_OT_CO_LINES",JSON.stringify(paramJSon),function(waCountData){
			var waCountData = typeof waCountData == 'object'?waCountData:JSON.parse(waCountData);
				if(waCountData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = waCountData;
					rtnJSON.status = "0";
				}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}

//10.加班相关
//10.1加班申请提交
function submit_10_1(subParam,persArr,pernr){
	var perArr1 = [];
	var rtnJSON = {};
	if(persArr.length == 0){
		perArr1.push({
									   "PERNR":subParam.PERNR,
									    "BEGDA":subParam.BEGDA,
									   "ENDDA":subParam.ENDDA,
									   "BEGUZ":subParam.BEGUZ,
									   "ENDUZ":subParam.ENDUZ,
									   "PBEG1":subParam.PBEG1,
									   "PEND1":subParam.PEND1,
									   "ZGSJB":subParam.ZGSJB,
									   "PUNB1":subParam.PUNB1,
									   "STDAZ":subParam.STDAZ,
									   "VTKEN":subParam.VTKEN,
									   "VERSL":subParam.VERSL,
									   "REASON":subParam.REASON
							         });
	}else{
		for(var k in persArr){
			perArr1.push({
				"PERNR":persArr[k].split('|')[1],
									    "BEGDA":subParam.BEGDA,
									   "ENDDA":subParam.ENDDA,
									   "BEGUZ":subParam.BEGUZ,
									   "ENDUZ":subParam.ENDUZ,
									   "PBEG1":subParam.PBEG1,
									   "PEND1":subParam.PEND1,
									   "ZGSJB":subParam.ZGSJB,
									   "PUNB1":subParam.PUNB1,
									   "STDAZ":subParam.STDAZ,
									   "VTKEN":subParam.VTKEN,
									   "VERSL":subParam.VERSL,
									   "REASON":subParam.REASON
			});
		}
	}
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
		"IT_P2005": {
							       "item":perArr1
						 },
			"P_BUSINESS_TYPE":"2005",
			"P_TJ_PERNR":pernr
	};
		$.post("/zhrws/ZHRWS_OVERTIME_APPLY_SUBMIT",JSON.stringify(paramJSon),function(atSubData){
//			if (atSubData.status == '-1') {
//				rtnJSON.status = "-1";
//			}
//			else {
var atSubData = typeof atSubData == 'object'?atSubData:JSON.parse(atSubData);
				if(atSubData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
					rtnJSON.errMsg = checkNoChar(atSubData.RETURN_MESSAGE);
				}else{
					rtnJSON = atSubData;
					rtnJSON.status = "0";
				}
//			}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
} 

//10.2加班待审批详情 ECC
function submit_10_2(pernr,spType,begD,endD){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
			"P_BEGDA":begD,
			"P_BUSI_TYPE":"2005",    //加班
			"P_ENDDA":endD,
			"P_FORM_ID":"",
			"P_SP_PERNR":pernr,
			"P_SP_STATUS":spType
		};
		$.post("/zhrws/ZHRWS_WF_GET_FORM_OT",JSON.stringify(paramJSon),function(waOvertimeListsData){
			var waOvertimeListsData = typeof waOvertimeListsData == 'object'?waOvertimeListsData:JSON.parse(waOvertimeListsData);
				if(waOvertimeListsData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = waOvertimeListsData;
					rtnJSON.status = "0";
				}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}
function submit_10_3(pernr,spType,formId,xh){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
			"P_BEGDA":"",
			"P_BUSI_TYPE":"2005",    //加班
			"P_ENDDA":"",
			"P_FORM_ID":formId,
			"P_SP_PERNR":pernr,
			"P_SP_STATUS":spType,
			"P_XH":xh
		};
		$.post("/zhrws/ZHRWS_WF_GET_FORM_OT",JSON.stringify(paramJSon),function(waOvertimeListsData){
			var waOvertimeListsData = typeof waOvertimeListsData == 'object'?waOvertimeListsData:JSON.parse(waOvertimeListsData);
				if(waOvertimeListsData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = waOvertimeListsData;
					rtnJSON.status = "0";
				}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}

//10.4加班审批提交 更新审批状态
function submit_10_4(otJSON){
	var rtnJSON = {};
		$.post("/zhrws/ZHRWS_CE_MOD_FORM_WF_STATUS",JSON.stringify(otJSON),function(otSubData){
			var otSubData = typeof otSubData == 'object'?otSubData:JSON.parse(otSubData);
				if(otSubData.RETURN_SUBRC == 'E'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = otSubData;
					rtnJSON.status = "0";
				}
		});
	
	return rtnJSON;
}

//10.5加班申请重复性校验
function submit_10_5(subParam,persArr,pernr){
	var perArr1 = [];
	var rtnJSON = {};
	if(persArr.length == 0){
		perArr1.push({
									   "PERNR":subParam.PERNR,
									    "BEGDA":subParam.BEGDA,
									   "ENDDA":subParam.ENDDA,
									   "BEGUZ":subParam.BEGUZ,
									   "ENDUZ":subParam.ENDUZ,
									   "PBEG1":subParam.PBEG1,
									   "PEND1":subParam.PEND1,
									   "ZGSJB":subParam.ZGSJB,
									   "PUNB1":subParam.PUNB1,
									   "STDAZ":subParam.STDAZ,
									   "VTKEN":subParam.VTKEN,
									   "VERSL":subParam.VERSL,
									   "REASON":subParam.REASON
							         });
	}else{
		for(var k in persArr){
			perArr1.push({
				"PERNR":persArr[k].split('|')[1],
									    "BEGDA":subParam.BEGDA,
									   "ENDDA":subParam.ENDDA,
									   "BEGUZ":subParam.BEGUZ,
									   "ENDUZ":subParam.ENDUZ,
									   "PBEG1":subParam.PBEG1,
									   "PEND1":subParam.PEND1,
									   "ZGSJB":subParam.ZGSJB,
									   "PUNB1":subParam.PUNB1,
									   "STDAZ":subParam.STDAZ,
									   "VTKEN":subParam.VTKEN,
									   "VERSL":subParam.VERSL,
									   "REASON":subParam.REASON
			});
		}
	}
	if(pernr){
		//拼接提交参数
		var paramJSon = {
		"IS_PUBLIC":IS_PUBLIC,
		"IT_P2005": {
							       "item":perArr1
						 }
	};
		$.post("/zhrws/ZHRWS_CHECK_OT_REPEAT",JSON.stringify(paramJSon),function(atSubData){
			var atSubData = typeof atSubData == 'object'?atSubData:JSON.parse(atSubData);
			if (atSubData.status == '-1') {
				rtnJSON.status = "-1";
			}
			else {
					rtnJSON = atSubData;
					rtnJSON.status = "0";
			}
		});
	}else{
		rtnJSON.status = "-1";
	}
	return rtnJSON;
} 

//11.考勤异常审批相关
//11.1考勤异常列表和详情11.2
function submit_11_1(pernr,spType,begD,endD){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var begd = '';
		var endd = '';
		if(begD){
			begd =begD;
			endd = endD; 
		}
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
			"P_BEGDA":begd,
			"P_BUSI_TYPE":"2011",    //考勤
			"P_ENDDA":endd,
			"P_FORM_ID":"",
			"P_SP_PERNR":pernr,
			"P_SP_STATUS":spType
		};
		$.post("/zhrws/ZHRWS_WF_GET_FORM_CLOCK",JSON.stringify(paramJSon),function(waErrorListsData){
			var waErrorListsData = typeof waErrorListsData == 'object'?waErrorListsData:JSON.parse(waErrorListsData);
				if(waErrorListsData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = waErrorListsData;
					rtnJSON.status = "0";
				}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}
function submit_11_2(pernr,spType,formId,xh){
	var rtnJSON = {};
	if(pernr){
		//拼接提交参数
		var paramJSon = {
			"IS_PUBLIC":IS_PUBLIC,
			"P_BEGDA":"",
			"P_BUSI_TYPE":"2011",    //考勤
			"P_ENDDA":"",
			"P_FORM_ID":formId,
			"P_SP_PERNR":pernr,
			"P_SP_STATUS":spType,
			"P_XH":xh
		};
		$.post("/zhrws/ZHRWS_WF_GET_FORM_CLOCK",JSON.stringify(paramJSon),function(waErrorListsData){
			var waErrorListsData = typeof waErrorListsData == 'object'?waErrorListsData:JSON.parse(waErrorListsData);
				if(waErrorListsData.RETURN_SUBRC != '0'){
					rtnJSON.status = "-1";
				}else{
					rtnJSON = waErrorListsData;
					rtnJSON.status = "0";
				}
		});
	}else{
		rtnJSON.status = "-1";
		//alert(noUserMsg);
	}
	return rtnJSON;
}