//1.3 登录提交
function submit_1_3(){
	var userid = $("#userid").value;
	var password = $("#password").value;
	$("#loginForm").submit();
}

//2.3.1初始化日历
function submit_2_3_1(dateJson,p_pernr){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(p_pernr?p_pernr:pernrBase);
	//var p_pernr = p_pernr?p_pernr:pernrBase;   //员工号    从存储中获取
	//初始化当前年月
	var p_begDate = dateJson.p_begDate?dateJson.p_begDate:getFirstDay_8();
	var p_endDate = dateJson.p_endDate?dateJson.p_endDate:getLastDay_8();
	//拼接提交参数
	var paramJSon = {
		"P_BEGDA":p_begDate,
		"P_ENDDA":p_endDate,
		"P_PERNR":pernr1
	};
	
	var myCaleData = null;
	var myOverviewData = null;
	//提交
	$.post("/zhrws/ZHRWS_MY_TIME_CALENDAR",JSON.stringify(paramJSon),function(data){
		if(data.status == '-1'){
			alert(errMsg);
			emptyCal(dateJson);
			return;
		}else{
			if(data.RETURN_SUBRC != '0'){
				alert("" == data.RETURN_MESSAGE?errMsg1:data.RETURN_MESSAGE);
				emptyCal(dateJson);
				//alert(errMsg1);
				
				return;
			}else{
				myCaleData = data.MY_TIME_CALE.item;  //月历列表
				//localStorage.myCaleData = JSON.stringify(myCaleData);
//2.3.2 考勤概览请求
				$.post("/zhrws/ZHRWS_MY_TIME_OVERVIEW",JSON.stringify(paramJSon),function(data1){
					if(data1.status == '-1'){
						alert(errMsg);
						return;
					}else{
						if(data1.RETURN_SUBRC != '0'){
							alert("" == data1.RETURN_MESSAGE?errMsg1:data1.RETURN_MESSAGE);
							
							//alert(errMsg1);
							return;
						}else{
							myOverviewData = data1.MY_TIME_OVERVIEW.item; //某天考勤信息概览列表
							//localStorage.myOverviewData = JSON.stringify(myOverviewData);
							//alert(myCaleData[0].DATUM + "||" +myOverviewData[4].CLOCK );
							
							//显示的日期数组
							var showArr = [];
							//当月信息
							var thisY = dateJson.year?dateJson.year:new Date().getFullYear();
							var thisM = dateJson.month?dateJson.month:new Date().getMonth()+1;
							var lastM = dateJson.month?(dateJson.month-1):new Date().getMonth();
							var DateOne = new Date(thisY,lastM,1);
							var dayOne = DateOne.getDay();//当月1号星期几   8月1日周五  返回5
							//上月信息
							var daysEachMonThis = [31,28,31,30,31,30,31,31,30,31,30,31];//每个月的天数
							var lastMonthDayLast = 31;
							daysEachMonThis[1] = (0==thisY%4 && (thisY%100!=0 || thisY%400==0)) ? 29 : 28; //闰年二月为29天
							if(thisM != '0'){
								lastMonthDayLast = daysEachMonThis[lastM];
							}
							
							for(var i =dayOne;i>0;i--){
								showArr.push({type:"lastMonth",
									dateShow:lastMonthDayLast-i+1,
									ifData:false,
									datum:'0',
									status:'0',
									data:""});
							}
							
							for(var j=1;j<=daysEachMonThis[lastM];j++){
								showArr.push({type:"thisMonth",
									dateShow:j,
									ifData:typeof myOverviewData[j-1].CLOCK == "object"?false:true,
									status:myOverviewData[j-1].STATUS,
									datum:myOverviewData[j-1].DATUM,
									data:typeof myOverviewData[j-1].CLOCK == "object"?"":myOverviewData[j-1].CLOCK});
							}
							
							var lenTemp = showArr.length;
							for(var k=42;k>lenTemp;k--){
								showArr.push({type:"nextMonth",
									dateShow:43-k,
									ifData:false,
									datum:'0',
									status:'0',
									data:""});
							}
							//初始化showArr完成
							
							var tbodyStr = '<tr class="fc-week fc-first">';
							var strTemp = '';
							var monType = '';
							var monType1 = '';
							var mark = '';
							var onclickstr = '';
							markCalss = '';
							for(var i=0;i<showArr.length;i++){
								
								if(showArr[i].ifData){
									if(showArr[i].status =='3'){
										mark = '<div class="fc-day-content">\
                                                                            <div style="position: relative; height:auto;background-color:#FFFF99;font-size:1.5em !important">'+showArr[i].data.replace(/,/g,'<br/>')+'</div>\
                                                                        </div>';
										markCalss = 'mark-yellow';
									}else{
										mark = '<div class="fc-day-content">\
                                                                            <div style="position: relative; height:auto;background-color:#66FF99;font-size:1.5em !important">'+showArr[i].data.replace(/,/g,'<br/>')+'</div>\
                                                                        </div>';
										markCalss = 'mark-green';
									}
									
								}else if(showArr[i].status =='3'){
									mark = '<div class="fc-day-content">\
                                                                            <div style="position: relative; height:20px;background-color:#FFFF99;font-size:1.5em !important"></div>\
                                                                        </div>';
									markCalss = 'mark-yellow';
								}else{
									mark = '';
								}
								
																		
																		
																		
																		
								monType = showArr[i].type != "thisMonth"?'fc-other-month':'';
								if( i % 7 == 0){
									monType1 = ' fc-first';
								}else if(i%7 == 6){
									monType1 = ' fc-last';
								}else{
									monType1 = '';
								}
								
								if (i ==35) {
									tbodyStr += '<tr class="fc-week fc-last">';
								}else if (i != 0 && i % 7 == 0) {
									tbodyStr += '<tr class="fc-week">';
								}
								
								onclickstr = 'openDetail(\''+(showArr[i].datum?showArr[i].datum:'') +'\',\''+showArr[i].status+'\')'; 
								
									tbodyStr += '<td onclick="'+onclickstr+'" class="fc-day fc-sun fc-widget-content '+monType+' fc-past '+monType1+'">\
                                                                    <div style="min-height: 101px;" class="'+markCalss+'">\
                                                                        <div class="fc-day-number  numberShow" style="float:none; !important">'+showArr[i].dateShow+'</div>'
																		+mark
                                                                    +'</div>\
                                                                </td>';
																
								if(i%7 == 6){
									tbodyStr += '</tr>';
								}		
								
								
												
								markCalss = '';
							}
							$('#calTbody').html(tbodyStr)	;	
							
						}
					}
				});
				
			}
		}
	});
}


//2.3.3 请求无数据时画空日历
function emptyCal(dateJson){
	//显示的日期数组
							var showArr = [];
							//当月信息
							var thisY = dateJson.year?dateJson.year:new Date().getFullYear();
							var thisM = dateJson.month?dateJson.month:new Date().getMonth()+1;
							var lastM = dateJson.month?(dateJson.month-1):new Date().getMonth();
							var DateOne = new Date(thisY,lastM,1);
							var dayOne = DateOne.getDay();//当月1号星期几   8月1日周五  返回5
							//上月信息
							var daysEachMonThis = [31,28,31,30,31,30,31,31,30,31,30,31];//每个月的天数
							var lastMonthDayLast = 31;
							daysEachMonThis[1] = (0==thisY%4 && (thisY%100!=0 || thisY%400==0)) ? 29 : 28; //闰年二月为29天
							if(thisM != '0'){
								lastMonthDayLast = daysEachMonThis[lastM];
							}
							
							for(var i =dayOne;i>0;i--){
								showArr.push({type:"lastMonth",
									dateShow:lastMonthDayLast-i+1,
									ifData:false,
									status:'0',
									data:""});
							}
							
							for(var j=1;j<=daysEachMonThis[lastM];j++){
								showArr.push({type:"thisMonth",
									dateShow:j,
									ifData:false,
									status:'0',
									data:""});
							}
							
							var lenTemp = showArr.length;
							for(var k=42;k>lenTemp;k--){
								showArr.push({type:"nextMonth",
									dateShow:43-k,
									ifData:false,
									status:'0',
									data:""});
							}
							//初始化showArr完成
							
							var tbodyStr = '<tr class="fc-week fc-first">';
							var strTemp = '';
							var monType = '';
							var monType1 = '';
							var mark = '';
							for(var i=0;i<showArr.length;i++){
															
								monType = showArr[i].type != "thisMonth"?'fc-other-month':'';
								if( i % 7 == 0){
									monType1 = ' fc-first';
								}else if(i%7 == 6){
									monType1 = ' fc-last';
								}else{
									monType1 = '';
								}
								
								if (i ==35) {
									tbodyStr += '<tr class="fc-week fc-last">';
								}else if (i != 0 && i % 7 == 0) {
									tbodyStr += '<tr class="fc-week">';
								}
								
									tbodyStr += '<td class="fc-day fc-sun fc-widget-content '+monType+' fc-past '+monType1+'">\
                                                                    <div style="min-height: 101px;">\
                                                                        <div class="fc-day-number">'+showArr[i].dateShow+'</div>'
                                                                    +'</div>\
                                                                </td>';
																
								if(i%7 == 6){
									tbodyStr += '</tr>';
								}			
			}
			$('#calTbody').html(tbodyStr)	;		
}

//3个人考勤信息详情 
//3.2.1考勤异常信息请求
//pernr(员工工号)可从存储中获取
function submit_3_2_1(begda,pernr,endda){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	begda = formatDate(begda);
	//拼接提交参数
	var paramJSon = {
		"P_BEGDA":begda,
		"P_ENDDA":begda,
		"T_PERNR": [
							    {
							        "item": {
							           "PERNR": pernr1
							         }
							     }
						 ]
	};
	$.post("/zhrws/ZHRWS_TIME_ERROR",JSON.stringify(paramJSon),function(attError){
		if(attError.status == '-1'){
				alert(errMsg);
				return;
			}else{
				if(attError.RETURN_SUBRC != '0'){
					alert("" == attError.RETURN_MESSAGE?errMsg1:attError.RETURN_MESSAGE);
					//alert(errMsg1);
					return;
				}else{
					//处理考勤异常返回
					var myAttErrorData = attError.TIME_DWS.item; //考勤异常数组
				}
			}
	});
}

//3.3.1考勤刷卡信息请求
//pernr(员工工号)可从存储中获取
function submit_3_3_1(begda,pernr,endda){
	var begda = formatDate(begda);
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	//拼接提交参数
	var paramJSon = {
		"APPROVAL":'',
		"BEGDA":begda,
		"ENDDA":begda,
		"T_PERNR": [
			{
				"item":{
					"PERNR":pernr1
				}
			}
		]
	};
	$.post("/zhrws/ZHRWS_TIME_CLOCK",JSON.stringify(paramJSon),function(clockData){
		if(clockData.status == '-1'){
				//alert(errMsg);
				return;
			}else{
				if(clockData.RETURN_SUBRC != '0'){
					//$('#err_clock').html('当日刷卡数据：');
					//alert("" == clockData.RETURN_MESSAGE?errMsg1:clockData.RETURN_MESSAGE);
					//alert(errMsg1);
					return;
				}else{
					//处理考勤刷卡信息返回
					var myClockData = clockData.TIME_CLOCK.item; //考勤刷卡信息数组
					//$('#err_clock').html('当日刷卡数据：'+checkNoChar(myClockData[0].CLOCK));
					$('#bq_clock').html(checkNoChar(myClockData[0].CLOCK));
				}
			}
	});
}



//3.4.1考勤排班信息请求
//pernr(员工工号)可从存储中获取
function submit_3_4_1(begda,pernr,endda){
	//alert(begda);
	begda = formatDate(begda);
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	//拼接提交参数
	var paramJSon = {
		"BEGDA":begda,
		"ENDDA":begda,
		"T_PERNR": [ {
							        "item": {
							           "PERNR": pernr1
							         }
							     }
						 ],
		"USEDTYPE":''
	};
	$.post("/zhrws/ZHRWS_TIME_DWS",JSON.stringify(paramJSon),function(dwsData){
		if(dwsData.status == '-1'){
				$('#paibanDiv').html('排班信息请求异常！'+errMsg);
				//alert(errMsg);
				return;
			}else{
				if(dwsData.RETURN_SUBRC != '0'){
					//alert("" == dwsData.RETURN_MESSAGE?errMsg1:dwsData.RETURN_MESSAGE);
					$('#paibanDiv').html('排班信息请求异常！'+errMsg1);
					//alert(errMsg1);
					return;
				}else{
					//处理考勤排班信息返回
					var myDwsData = dwsData.TIME_DWS.item; //考勤排班信息数组
					if(myDwsData.length>0){
						var myDwsData1 = myDwsData[0];
						$('#paiban_riqi').html('日期　'+myDwsData1.DATUM+' '+myDwsData1.WEEK);
						$('#paiban_anpai').html('工作安排　'+myDwsData1.DWS);
						$('#paiban_shijian').html('工作时间　'+myDwsData1.BEGUZ+'-'+myDwsData1.ENDUZ);
						$('#paiban_xiuxi').html('休息时间　'+myDwsData1.PBEG1+'-'+myDwsData1.PEND1);
						
						//补签卡部分增加排班字段显示
						$('#bq_dws').html(myDwsData1.DWS);
					}else{
						$('#paibanDiv').html('无当天排班信息！');
					}
					
				}
			}
	});
}



//3.4.2考勤请假信息请求
//pernr(员工工号)可从存储中获取
function submit_3_4_2(begda,pernr,endda){
	begda = formatDate(begda);
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	//拼接提交参数
	var paramJSon = {
		"BEGDA":begda,
		"ENDDA":begda,
		"T_PERNR": [ {
							        "item": {
							           "PERNR": pernr1
							         }
							     }
						 ],
		"USEDTYPE":''
	};
	$.post("/zhrws/ZHRWS_TIME_ABSENCE",JSON.stringify(paramJSon),function(absenceData){
		if(absenceData.status == '-1'){
				//alert(errMsg);
				$('#xiujiaDiv').html('请假信息请求异常！' +errMsg);
				return;
			}else{
				if(absenceData.RETURN_SUBRC != '0'){
					//alert("" == dwsData.RETURN_MESSAGE?errMsg1:dwsData.RETURN_MESSAGE);
					$('#xiujiaDiv').html('请假信息请求异常！' +"" == absenceData.RETURN_MESSAGE?errMsg1:absenceData.RETURN_MESSAGE);
					//alert(errMsg1);
					return;
				}else{
					//处理考勤请假信息返回
					var myAbsenceData = absenceData.TIME_ABSENCE.item; //考勤请假信息数组
					if(myAbsenceData != undefined && myAbsenceData.length>0){
						var innerT = '';
						var ifhr = '';
						for(var i=0;i<myAbsenceData.length;i++){
							ifhr = i>0?'<hr/>':'';
							innerT += ifhr;
							innerT +='<ul style="font-size:18px">'
							+'<li style="list-style-type:none"><div>休假开始时间　'+checkNoChar(myAbsenceData[i].BEGDA)+' '+checkNoChar(myAbsenceData[i].BEGUZ)+'</div></li>'
							+'<li style="list-style-type:none"><div >休假结束时间　'+checkNoChar(myAbsenceData[i].ENDDA)+' '+checkNoChar(myAbsenceData[i].ENDUZ)+'</div></li>'
							+'<li style="list-style-type:none"><div style="margin-left:35px">休假类型　'+checkNoChar(myAbsenceData[i].ATEXT)+' </div></li>'
							+'<li style="list-style-type:none"><div style="margin-left:35px">休假事由　'+checkNoChar(myAbsenceData[i].REASON)+'</div></li>'
							+'<li style="list-style-type:none"><div style="margin-left:35px">审批状态　'+checkApprovalStatus(myAbsenceData[i].APPROVAL_STATUS)+'</div></li></ul>';
						}
						
						$('#xiujiaList').html(innerT);
						$('#xiujiaDiv').show();
					}else{
						$('#xiujiaDiv').hide();
					}
					
				}
			}
	});
}


//3.4.3考勤差旅信息请求
//pernr(员工工号)可从存储中获取
function submit_3_4_3(begda,pernr,endda){
	begda = formatDate(begda);
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	//拼接提交参数
	var paramJSon = {
		"BEGDA":begda,
		"ENDDA":begda,
		"T_PERNR": [ {
							        "item": {
							           "PERNR": pernr1
							         }
							     }
						 ],
		"USEDTYPE":''
	};
	$.post("/zhrws/ZHRWS_TIME_ABSENCE",JSON.stringify(paramJSon),function(absenceData){
		if(absenceData.status == '-1'){
				//alert(errMsg);
				$('#xiujiaDiv').html('请假信息请求异常！' +errMsg);
				return;
			}else{
				if(absenceData.RETURN_SUBRC != '0'){
					//alert("" == dwsData.RETURN_MESSAGE?errMsg1:dwsData.RETURN_MESSAGE);
					$('#xiujiaDiv').html('请假信息请求异常！' +"" == absenceData.RETURN_MESSAGE?errMsg1:absenceData.RETURN_MESSAGE);
					//alert(errMsg1);
					$('#xiujiaDiv').hide();
					return;
				}else{
					//处理考勤排班信息返回
					var myAbsenceData = absenceData.TIME_ABSENCE.item; //考勤排班信息数组
					if(myAbsenceData != undefined && myAbsenceData.length>0){
						var innerT = '';
						var ifhr = '';
						for(var i=0;i<myAbsenceData.length;i++){
							ifhr = i>0?'<hr/>':'';
							innerT += ifhr;
							innerT +='<ul style="font-size:18px">'
							+'<li style="list-style-type:none"><div>休假开始时间：'+checkNoChar(myAbsenceData[i].BEGDA)+' '+checkNoChar(myAbsenceData[i].BEGUZ)+'</div></li>'
							+'<li style="list-style-type:none"><div id="xiujia_end">休假结束时间：'+checkNoChar(myAbsenceData[i].ENDDA)+' '+checkNoChar(myAbsenceData[i].ENDUZ)+'</div></li>'
							+'<li style="list-style-type:none"><div id="xiujia_type">休假类型：'+checkNoChar(myAbsenceData[i].ATEXT)+' </div></li>'
							+'<li style="list-style-type:none"><div id="xiujia_reason">休假事由：'+checkNoChar(smyAbsenceData[i].REASON)+'</div></li>'
							+'<li style="list-style-type:none"><div id="xiujia_status">审批状态：'+checkApprovalStatus(myAbsenceData[i].APPROVAL_STATUS)+'</div></li></ul>';
						}
						
						$('#xiujiaList').html(innerT);
						$('#xiujiaDiv').show();
					}else{
						$('#xiujiaDiv').hide();
					}
					
				}
			}
	});
}



//3.4.4考勤异常信息请求
//pernr(员工工号)可从存储中获取
function submit_3_4_4(begda,pernr,endda){
	begda = formatDate(begda);
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	//拼接提交参数
	var paramJSon = {
		"BEGDA":begda,
		"ENDDA":begda,
		"T_PERNR": [ {
							        "item": {
							           "PERNR": pernr1
							         }
							     }
						 ],
		"USEDTYPE":''
	};
	$.post("/zhrws/ZHRWS_TIME_ERROR",JSON.stringify(paramJSon),function(errorData){
		if(errorData.status == '-1'){
				//alert(errMsg);
				$('#errorInfo_no').html('请假信息请求异常！' +errMsg);
				$('#errorInfo').hide();
				$('#errorInfo_no').show();
				
				return;
			}else{
				if(errorData.RETURN_SUBRC != '0'){
					//alert("" == dwsData.RETURN_MESSAGE?errMsg1:dwsData.RETURN_MESSAGE);
					$('#errorInfo_no').html('请假信息请求异常！' +"" == errorData.RETURN_MESSAGE?errMsg1:errorData.RETURN_MESSAGE);
					$('#errorInfo').hide();
					$('#errorInfo_no').show();
					//alert(errMsg1);
					return;
				}else{
					//处理考勤异常信息返回
					var myErrorData = errorData.TIME_ERROR.item; //考勤异常信息数组
					if(myErrorData != undefined && myErrorData.length>0){
						$('#errorInfo').hide();
						$('#errorInfo_no').hide();
						var innerT = '';
						innerT += '<ul style="font-size: 18px; list-style-type: none;">'
						+'<li>'
						+'<span style="color: #93B9D6">异常信息</span>'
						+'</li>';
						for(var k in myErrorData){
							innerT += '<li style="margin-top:8px">'
							+'<span style="margin-left: 20px; ">异常消息</span>'
							+'<span style=" margin-left: 10px;">'+checkNoChar(myErrorData[k].ERROR_MESSAGE)+'</span>'
							+'</li>'
							+'<li style="margin-top:8px">'+
							'<span style="margin-left: 20px;">刷卡数据 </span>'
							+' <span style="margin-left:8px ;">'+checkNoChar(myErrorData[k].CLOCK)+'</span>'
							+'</li><hr/>';
						}
						innerT += '</ul>';
						
						
						$('#errList').html(innerT);
						$('#errorInfo').show();
					}else{
						$('#errorInfo_no').html('当日无异常数据！');
						$('#errList').hide();
						$('#errorInfo').show();
						$('#errorInfo_no').show();
					}
					
				}
			}
	});
}




//3.4.5补签卡原因加载
//pernr(员工工号)可从存储中获取
function submit_3_4_5(p_para){
	var keyDate = getToday8();
	//拼接提交参数
	var paramJSon = {
		"P_KEYDATE":keyDate,
		"P_PARA":p_para
	};
	$.post("/base/BASE_CONFIG_DETAILED_LIST",JSON.stringify(paramJSon),function(configListData){
		if(configListData.status == '-1'){
				//$('#paibanDiv').html('排班信息请求异常！'+errMsg);
				alert('补签原因初始化失败，暂不能提供补签操作');
				$('#bqBtn').attr('disabled',"true");
				return;
			}else{
				if(configListData.RETURN_SUBRC != '0'){
					//alert("" == dwsData.RETURN_MESSAGE?errMsg1:dwsData.RETURN_MESSAGE);
					//$('#paibanDiv').html('排班信息请求异常！'+errMsg1);
					//alert(errMsg1);
					alert('补签原因初始化失败，暂不能提供补签操作');
					$('#bqBtn').attr('disabled',"true");
					return;
				}else{
					//处理补签信息返回
					var myConData = configListData.T_CUST_LIST.item; 
					if(myConData.length>0){
						var listStr = '';
						for(var k in myConData){
							listStr += '<option onclick="setBQLS(\'bqyy\',\''+myConData[k].VALUE+'\')" value="'+myConData[k].VALUE+'">'+myConData[k].VALUE_TXT+'</option>'
						}
						
						$('#bqyy').html(listStr);
					}else{
						//$('#paibanDiv').html('无当天排班信息！');
					}
					
				}
			}
	});
}

//3.4.6考勤加班信息请求
//pernr(员工工号)可从存储中获取
function submit_3_4_6(begda,pernr,endda){
	begda = formatDate(begda);
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	//拼接提交参数
	var paramJSon = {
		"BEGDA":begda,
		"ENDDA":begda,
		"T_PERNR": [ {
							        "item": {
							           "PERNR": pernr1
							         }
							     }
						 ],
		"USEDTYPE":''
	};
	$.post("/zhrws/ZHRWS_TIME_OVERTIME",JSON.stringify(paramJSon),function(overTimeData){
		if(overTimeData.status == '-1'){
				//alert(errMsg);
				$('#jiabanDiv').html('请假信息请求异常！' +errMsg);
				$('#jiabanDiv').hide();
				return;
			}else{
				if(overTimeData.RETURN_SUBRC != '0'){
					//alert("" == dwsData.RETURN_MESSAGE?errMsg1:dwsData.RETURN_MESSAGE);
					$('#jiabanDiv').html('请假信息请求异常！' +"" == overTimeData.RETURN_MESSAGE?errMsg1:overTimeData.RETURN_MESSAGE);
					//alert(errMsg1);
					$('#jiabanDiv').hide();
					return;
				}else{
					//处理考勤请假信息返回
					var myOverTimeData = overTimeData.TIME_OVERTIME.item; //考勤请假信息数组
					if(myOverTimeData != undefined && myOverTimeData.length>0){
						var innerT = '';
						var ifhr = '';
						for(var i=0;i<myOverTimeData.length;i++){
							ifhr = i>0?'<hr/>':'';
							innerT += ifhr;
							innerT +='<ul style="font-size:18px">'
							+'<li style="list-style-type:none"><div>加班时间　'+checkNoChar(myOverTimeData[i].BEGUZ)+'~'+' '+checkNoChar(myOverTimeData[i].ENDUZ)+'</div></li>'
							+'<li style="list-style-type:none"><div >加班类型　'+checkNoChar(myOverTimeData[i].TYPE)+'</div></li>'
							+'<li style="list-style-type:none"><div >报酬类型　'+(checkNoChar(myOverTimeData[i].VERSL)=='1'?'支付加班费':'用于调休')+' </div></li>'
							+'<li style="list-style-type:none"><div >公司内加班　'+(checkNoChar(myOverTimeData[i].ZGSJB)=='1'?'是':'否')+'</div></li>'
							+'<li style="list-style-type:none"><div >审批状态　'+(checkNoChar(myOverTimeData[i].APPROVAL_STATUS)=='1'?'审批中':'已审批')+'</div></li></ul>';
						}
						
						$('#jiabanList').html(innerT);
						$('#jiabanDiv').show();
					}else{
						$('#jiabanDiv').hide();
					}
					
				}
			}
	});
}





/*
 * 4.个人人事信息
 * 4.3.1读取员工基本信息
 * pernr从存储中获取
*/
function submit_4_3_1(begda,pernr){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	
	var begda1 = begda?begda:getToday8();
	//拼接提交参数
	var paramJSon = {
		"IT_EXTENDMAP":[{
										"item": {
											"FIELDNAME":'',
											"VALUE":''
										}
										}
									],
		"I_PUBLIC":{
			"CHANNELSERIALNO":'',
			"ORIGINATETELLERID":'',
			"ZDOMAIN":'100',
			"I_PAGENO":'',
			"I_PAGESIZE":'',
			"ZVERSION":'',
		},
		"KEYDATE":begda1,
		"P_PERNR":pernr1,
		"P_PLANS":''
	};
	$.post("/zhrmss/ZHRMMS_READ_EE_INFO",JSON.stringify(paramJSon),function(eeInfoData){
		if(eeInfoData.status == '-1'){
				alert('个人信息请求异常！' +errMsg);
				return;
			}else{
				var E_PUBLIC = eeInfoData.E_PUBLIC;
				var IT0023 = eeInfoData.IT0023.item;
				var ZHR_EE_INFO = eeInfoData.ZHR_EE_INFO;
				
				if(undefined == ZHR_EE_INFO){
					alert('请求无数据！' );
					return;
				}else{
					if(undefined != IT0023 && IT0023.length>0){
						var localLvs = '';
						var otherLvs = '';
						for(var i=0;i<IT0023.length;i++){
							if(checkNoChar(IT0023[i].ZZ_LLLX)=='2'){
								if(localLvs != ''){
									localLvs += '<br/><br/>';
								}
								localLvs+='<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 时间 </div>'
								+'<div class="profile-info-value" style="width:45%">'
								+'<span class="editable" style="font-size:12px;">'
								+checkNoChar(IT0023[i].BEGDA)+'~'
								+checkNoChar(IT0023[i].ENDDA)
								+'</span>'
								+'</div>'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;">  </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;"></span>'
								+'</div>'
								+'</div>'
								+'<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 工作单位 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ARBGB)+'</span>'
								+'</div>'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 行业 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].BRANC_T)+'</span>'
								+'</div>'
								+'</div>'
								+'<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 部门 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ZZ_GZBM)+'</span>'
								+'</div>'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 岗位 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ZZ_JOB)+'</span>'
								+'</div>'
								+'</div>'
								+'<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 调动原因 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ZZ_DDYY)+'</span>'
								+'</div>'
								+'</div>';
							}else{
								if(otherLvs != ''){
									otherLvs += '<br/><br/>';
								}
								otherLvs+='<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 时间 </div>'
								+'<div class="profile-info-value" style="width:45%">'
								+'<span class="editable" style="font-size:12px;">'
								+checkNoChar(IT0023[i].BEGDA)+'~'
								+checkNoChar(IT0023[i].ENDDA)
								+'</span>'
								+'</div>'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;">  </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;"></span>'
								+'</div>'
								+'</div>'
								+'<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 工作单位 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ARBGB)+'</span>'
								+'</div>'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 行业 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].BRANC_T)+'</span>'
								+'</div>'
								+'</div>'
								+'<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 部门 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ZZ_GZBM)+'</span>'
								+'</div>'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 岗位 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ZZ_JOB)+'</span>'
								+'</div>'
								+'</div>'
								+'<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 调动原因 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ZZ_DDYY)+'</span>'
								+'</div>'
								+'</div>';
							}
							
						}
						$('#localLv').html(localLvs);
						$('#otherLv').html(otherLvs);
					}
					
					$('#NACHN').html(checkNoChar(ZHR_EE_INFO.NACHN));
					$('#NACHN1').html(checkNoChar(ZHR_EE_INFO.NACHN));
					$('#PERNR').html(checkNoChar(ZHR_EE_INFO.PERNR));
					//$('#PERNR1').html(checkNoChar(ZHR_EE_INFO.PERNR));
					$('#ORGTX').html(checkNoChar(ZHR_EE_INFO.ORGTX));
					$('#ORGTX1').html(checkNoChar(ZHR_EE_INFO.ORGTX));
					$('#GESCH_T').html(checkNoChar(ZHR_EE_INFO.GESCH_T));
					$('#ZZ_RZSJ').html(checkNoChar(ZHR_EE_INFO.ZZ_RZSJ));
					$('#GBDAT').html(checkNoChar(ZHR_EE_INFO.GBDAT));
					$('#PLSTX').html(checkNoChar(ZHR_EE_INFO.PLSTX));
					$('#ORGTX').html(checkNoChar(ZHR_EE_INFO.ORGTX));
					$('#ZZ_SPZXM').html(checkNoChar(ZHR_EE_INFO.ZZ_SPZXM));
					$('#ZZ_JSZWJBT').html(checkNoChar(ZHR_EE_INFO.ZZ_JSZWJBT));
					$('#ZZ_TEL1').html(checkNoChar(ZHR_EE_INFO.ZZ_TEL1));
					$('#ZZ_GZSJ').html(checkNoChar(ZHR_EE_INFO.ZZ_GZSJ));
					$('#ZZ_SXZY').html(checkNoChar(ZHR_EE_INFO.ZZ_SXZY));
					$('#ZZ_QDNX').html(checkNoChar(ZHR_EE_INFO.ZZ_HTKSRQ)+'~'+checkNoChar(ZHR_EE_INFO.ZZ_HTJZRQ));
					$('#ZZ_XZN').html(checkNoChar(ZHR_EE_INFO.ZZ_XZN));
					$('#INSTI').html(checkNoChar(ZHR_EE_INFO.INSTI));
					$('#ZZ_CZD1').html(checkNoChar(ZHR_EE_INFO.ZZ_CZD1));
					$('#SLART_T').html(checkNoChar(ZHR_EE_INFO.SLART_T));
					$('#ZZ_EMAIL').html(checkNoChar(ZHR_EE_INFO.ZZ_EMAIL));
					$('#ZZ_CZD').html(checkNoChar(ZHR_EE_INFO.ZZ_CZD));
					
					$('#jy_time').html(checkNoChar(ZHR_EE_INFO.ZZ_RXRQ)+'~'+checkNoChar(ZHR_EE_INFO.ZZ_BYRQ));
					$('#jy_school').html(checkNoChar(ZHR_EE_INFO.INSTI));
					$('#jy_pro').html(checkNoChar(ZHR_EE_INFO.ZZ_SXZY));
					$('#jy_edu').html(checkNoChar(ZHR_EE_INFO.SLART_T));
					$('#jy_deg').html(checkNoChar(ZHR_EE_INFO.SLART_T));
					$('#jy_type').html(checkNoChar(ZHR_EE_INFO.AUSBI_T));
					$('#jy_year').html(checkNoChar(parseInt(ZHR_EE_INFO.ZZ_XZN)));
					
				}
			}
	});
}


//4.3.2获取员工头像照片  base64
function submit_4_3_2(begda,pernr){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	
	var begda1 = begda?begda:getToday8();
	//拼接提交参数
	var paramJSon = {
		"IT_EXTENDMAP":[{
										"item": {
											"FIELDNAME":'',
											"VALUE":''
										}
										}
									],
		"I_PUBLIC":{
			"CHANNELSERIALNO":'',
			"ORIGINATETELLERID":'',
			"ZDOMAIN":'100',
			"I_PAGENO":'',
			"I_PAGESIZE":'',
			"ZVERSION":'',
		},
		"P_PERNR":pernr1,
	};
	$.post("/zhrmss/ZHRMMS_READ_PHOTO",JSON.stringify(paramJSon),function(photoData){
		if(photoData.status == '-1'){
				return;
			}else{
				var imgStr = '';
				var B64DATA = checkNoChar(photoData.B64DATA);
				var rtnCode = photoData.E_PUBLIC.CODE;
				if(rtnCode != '0'){
					
				}else{
					$('#touxiang').attr('src','data:image/jpg;base64,'+B64DATA);
				}
			}
	});
}



//4.3.3获取员工培训履历
function submit_4_3_3(begda,pernr){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	
	var begda1 = begda?begda:getToday8();
	//拼接提交参数
	var paramJSon = {
		"IT_EXTENDMAP":[{
										"item": {
											"FIELDNAME":'',
											"VALUE":''
										}
										}
									],
		"I_PUBLIC":{
			"CHANNELSERIALNO":'',
			"ORIGINATETELLERID":'',
			"ZDOMAIN":'100',
			"I_PAGENO":'',
			"I_PAGESIZE":'',
			"ZVERSION":'',
		},
		"P_PERNR":pernr1,
	};
	$.post("/zhrmss/ZHRMMS_READ_EE_TRAIN",JSON.stringify(paramJSon),function(trainData){
		if(trainData.status == '-1'){
				//alert('个人信息请求异常！' +errMsg);
				return;
			}else{
				var trainItems = trainData.IT9130.item;
				if(undefined != trainItems && trainItems.length>0){
					var trainStr = '';
					for(var i=0;i<trainItems.length;i++){
						trainStr+='<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 时间 </div>'
						+'<div class="profile-info-value" style="width:45%">'
						+'<span class="editable" style="font-size:12px;">'
						+checkNoChar(trainItems[i].BEGDA)+'~'
						+checkNoChar(trainItems[i].ENDDA)
						+'</span>'
						+'</div>'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;">  </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;"></span>'
						+'</div>'
						+'</div>'
						+'<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训课程名称 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXXM)+'</span>'
						+'</div>'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训方式 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXFST)+'</span>'
						+'</div>'
						+'</div>'
						+'<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训类型 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXLXT)+'</span>'
						+'</div>'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训阶段 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXJDT)+'</span>'
						+'</div>'
						+'</div>'
						+'<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训产品类型1 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXCPJXT)+'</span>'
						+'</div>'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训产品名称1 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXCPMCT)+'</span>'
						+'</div>'
						+'</div>'
						+'<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训产品类型2 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXCPJX2T)+'</span>'
						+'</div>'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训产品名称2 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXCPMC2T)+'</span>'
						+'</div>'
						+'</div>'
						+'<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训地点 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXDD)+'</span>'
						+'</div>'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训课时 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+parseInt(checkNoChar(trainItems[i].ZZ_PXKS))+'</span>'
						+'</div>'
						+'</div>'
						+'<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训机构 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXJG)+'</span>'
						+'</div>'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 获得资格 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_HDZG)+'</span>'
						+'</div>'
						+'</div>';
					}
					
					$('#trainDiv').html(trainStr);
				}else{
					
				}
				
			}
	});
}


/*
 * 5.休假申请
 * 5.3.1休假类型初始化
*/
function submit_5_3_1(begda,pernr,endda){
	var begda1 = begda?begda:getToday8();
	//拼接提交参数
	var paramJSon = {
		"P_KEYDATE":begda1,
		"P_PARA":'AB_TYPE'
	};
	$.post("/base/BASE_CONFIG_DETAILED_LIST",JSON.stringify(paramJSon),function(vacaTypeListsData){
		if(vacaTypeListsData.status == '-1'){
				alert('休假类型初始化失败，请返回重新打开。');
				$('#sureBtn').attr('disabled',"true");
				return;
			}else{
				if (vacaTypeListsData.RETURN_SUBRC != '0') {
					alert(initErrMsg);
					$('#sureBtn').attr('disabled',"true");
					
					return;
				}else {
					vacaTypeLists = vacaTypeListsData.T_CUST_LIST.item;
					var listStr = '';
					
					for(var i=0;i<vacaTypeLists.length;i++){
						listStr += '<li>'
						+'<a onclick="chooseType(\''+vacaTypeLists[i].VALUE_TXT+'\',\''+checkNoChar(vacaTypeLists[i].VALUE_SPEC)+'\',\''+vacaTypeLists[i].VALUE+'\')">'+vacaTypeLists[i].VALUE_TXT+'</a>'
						+'</li>';
						if(checkNoChar(vacaTypeLists[i].VALUE_TXT).indexOf('调休')>-1){
							$('#xiujia_shuoming').html(checkNoChar(vacaTypeLists[i].VALUE_SPEC));
						}						
					}
					
					$('#vaLists').html(listStr);
				}
			}
	});
}

//5.3.2初始化休假页面个人信息
function submit_5_3_2(begda,pernr,endda){
	var begda1 = begda?begda:getToday8();
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	//拼接提交参数
	var paramJSon = {
		"P_DATE":begda1,
		"P_PERNR": [
							    {
							        "item": {
							           "PERNR": add0(pernr1,8)
							         }
							     }
						 ]
	};
	$.post("/zhr/ZHR_GET_PER_EASY_INFO",JSON.stringify(paramJSon),function(perInfoData){
		if(perInfoData.status == '-1'){
				alert('个人信息初始化失败，请返回重新打开。');
				$('#sureBtn').attr('disabled',"true");
				return;
			}else{
				if (perInfoData.RETURN_SUBRC != '0') {
					alert(initErrMsg);
					$('#sureBtn').attr('disabled',"true");
					
					return;
				}else {
					perInfo = perInfoData.EASY_TAB.item[0];
					$('#userIdShow').val(pernrShow(perInfo.PERNR));
					$('#userNameShow').html(checkNoChar(perInfo.NACHN));
					$('#butxt').val(checkNoChar(perInfo.BUTXT));
					$('#bumen').val(checkNoChar(perInfo.BUMEN));
					$('#plstx').val(checkNoChar(perInfo.PLSTX));
					$('#tell').val(checkNoChar(perInfo.TELL));
				}
			}
	});
}

//5.3.3判断是否考勤员
function submit_5_3_3(begda,pernr,endda){
	var begda1 = begda?begda:getToday8();
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	//拼接提交参数
	var paramJSon = {
		"I_PERNR":pernr1
	};
	$.post("/base/BASE_IS_KAOQINYUAN",JSON.stringify(paramJSon),function(ifKQYData){
		if(ifKQYData.status == '-1'){
				//alert('个人信息初始化失败，请返回重新打开。');
				$('#userIdShow').attr("readonly","true");
				$('#butxt').attr("readonly","true");
				$('#bumen').attr("readonly","true");
				$('#plstx').attr("readonly","true");
				return;
			}else{
				if (ifKQYData.RETURN_SUBRC != '0') {
//					$('#userIdShow').attr("readonly","true");
//					$('#butxt').attr("readonly","true");
//					$('#bumen').attr("readonly","true");
//					$('#plstx').attr("readonly","true");
					return;
				}else {
					//是考勤员
					$('#userIdShow').removeAttr("readonly");
				}
			}
	});
}



//5.3.4初始显示可调休天数
function submit_5_3_4(begda,pernr,endda){
	var begda1 = begda?begda:getToday8();
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	//拼接提交参数
	var paramJSon = {
		"BEGDA":begda1,
		"ENDDA":begda1,
		"T_PERNR": [
							    {
							        "item": {
							           "PERNR": pernr1
							         }
							     }
						 ]
	};
	$.post("/zhrws/ZHRWS_TIME_OT_QUOTA",JSON.stringify(paramJSon),function(otQuotaData){
		if(otQuotaData.status == '-1'){
				//接口失败回调
				return;
			}else{
				if (otQuotaData.RETURN_SUBRC != '0') {
					
					return;
				}else {
					var otQuotaItem = otQuotaData.T_OT_QA.item[0];
					var otQuotaItem0 = checkNoChar(otQuotaItem.P_OT_QA_NUM);
					//if(parseInt(otQuotaItem0) != 0){
						$('#xiujia_shuoming').html('剩余调休天数：'+otQuotaItem0+'天。'+$('#xiujia_shuoming').html());
					//}
					
					localStorage.setItem('P_OT_QA_NUM',checkNoChar(otQuotaItem0));
				}
			}
	});
}


//5.3.5计算休假天数
function submit_5_3_5(calParam){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	var userIdShow = calParam.userIdShow;
	var dateB = calParam.dateB;
	var dateE = calParam.dateE;
	var timeB = calParam.timeB;
	var timeE = calParam.timeE;
	var awart = calParam.awart;
	var allDay = calParam.allDay;
	
	//拼接提交参数
	var paramJSon = {
		"IT_P2001": [
							    {
							        "item": {
									   "AWART":awart,
									    "PERNR": userIdShow?userIdShow:pernr1,
									   "BEGDA":dateB,
									   "ENDDA":dateE,
									   "BEGUZ":timeB,
									   "ENDUZ":timeE,
									   "ABWTG":'',
									   "STDAZ":'',
									   "ALLDF":allDay?'X':'',
									   "COMM":'',
									   "REASON":''
							         }
							     }
						 ]
	};
	$.post("/zhrws/ZHRWS_WF_GET_DAY_COUNT",JSON.stringify(paramJSon),function(dayCountData){
		if(dayCountData.status == '-1'){
				//接口失败回调
				return;
			}else{
				if (dayCountData.RETURN_SUBRC != '0') {
					alert(dayCountData.RETURN_MESSAGE);
					return;
				}else {
					var dayCount = dayCountData.E_ABWTG;
					var timeCount = dayCountData.E_STDAZ;
					$('#dayCount').html(dayCount);
				}
			}
	});
}



//5.3.6休假申请提交
function submit_5_3_6(subParam,files){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	
	var FORM_TAB = [];
	var fileLists;
	if(files == ''){
	}else{
		fileLists = files.split(";");
		for(var k in fileLists){
			FORM_TAB.push({
					"MANDT":"",
					"FORM_ID":"",
					"DOC_ID":fileLists[k].split('|')[1],
					"PARENT_DOC_ID":fileLists[k].split('|')[2] == '0'?'':fileLists[k].split('|')[2]
					});
		}
	}
	//拼接提交参数
	var paramJSon = {
		"FORM_TAB": {
			"item":FORM_TAB
		},
		"IT_P2001": [
							    {
							        "item": {
									   "PERNR":subParam.PERNR,
									    "AWART":subParam.AWART,
									   "BEGDA":subParam.BEGDA,
									   "ENDDA":subParam.ENDDA,
									   "BEGUZ":subParam.BEGUZ,
									   "ENDUZ":subParam.ENDUZ,
									   "ABWTG":subParam.ABWTG,
									   "STDAZ":subParam.STDAZ,
									   "ALLDF":subParam.ALLDF,
									   "COMM":subParam.COMM,
									   "REASON":subParam.REASON,
							         }
							     }
						 ],
			"P_BUSINESS_TYPE":"2001",
			"P_FILL_FORM_PERNR":pernr1
	};
	$.post("/zhr/ZHR_WF_SUBMIT_AB",JSON.stringify(paramJSon),function(abSubData){
		if(abSubData.status == '-1'){
				alert('提交失败，请联系管理员或稍后重试')
				return;
			}else{
				if (abSubData.RETURN_SUBRC != '0') {
					alert(abSubData.RETURN_MESSAGE+'.请确认信息无误后重试');
					return;
				}else {
					alert('休假申请提交成功！');
//					$('#date-timepicker1').val('');
//					$('#date-timepicker2').val('');
//					$('#id-date-range-picker-1').val('');
//					$('#reason').val('');
					window.location.href="/web/vacation_ask.html"; 
				}
			}
	});
}








/*
 * 6申请提交
 * 6.1补签卡申请提交
*/
function submit_6_3_1(dakaType,lTime,bqyy,datum){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	var paramJSon = {
		"IT_P2011":[{
										"item": {
											"PERNR":pernr1,
											"SATZA":dakaType,
											"LDATE":formatDate(datum),
											"LTIME":lTime,
											"ABWGR":bqyy,
											"TERID":''
										}
										}
									],
		"P_BUSINESS_TYPE":'2011',
		"P_TJ_PERNR":pernr1,
	};
	
	$.post("/zhr/ZHR_WF_SUBMIT_CLOCK",JSON.stringify(paramJSon),function(subClockData){
		if(subClockData.status == '-1'){
				alert('提交失败！请检查网络后重试');
				return;
			}else{
				if (subClockData.RETURN_SUBRC != '0') {
					alert("" == subClockData.RETURN_MESSAGE?errMsg1:subClockData.RETURN_MESSAGE);
					return;
				}else {
//					var jiluStr = '<span style=" margin-left: 10px;">上班 </span>'
//					+'<span>08：30  </span>'
//					+'<span>  忘记打卡</span>'
//					+'<br/>';
//					$('#bq_jilu').html($('#bq_jilu').html()+jiluStr);
//					alert($('#bq_jilu').html());
					alert('提交成功！请注意不要重复提交相同数据。')
				}
			}
	});
	
}







/*
 * 7.加班申请
*/
//7.3.1加班页面初始化个人数据  
function submit_7_3_1(begda,pernr,endda){
	var begda1 = begda?begda:getToday8();
	var pernr2 = localStorage.pernrBase;
	var pernr1 = pernr?pernr:(pernr2?pernr2:pernrBase);
	//拼接提交参数
	var paramJSon = {
		"P_DATE":begda1,
		"P_PERNR": [
							    {
							        "item": {
							           "PERNR": add0(pernr1,8)
							         }
							     }
						 ]
	};
	$.post("/zhr/ZHR_GET_PER_EASY_INFO",JSON.stringify(paramJSon),function(perInfoData){
		if(perInfoData.status == '-1'){
				alert('个人信息初始化失败，请返回重新打开。');
				//$('#sureBtn').attr('disabled',"true");
				return;
			}else{
				if (perInfoData.RETURN_SUBRC != '0') {
					//alert(initErrMsg);
					//$('#sureBtn').attr('disabled',"true");
					alert(pernr?'请输入正确员工号':initErrMsg);
					$('#userIdShow').val('');
					$('#userNameShow').html('');
					$('#butxt').val('');
					$('#bumen').val('');
					$('#plstx').val('');
					return;
				}else {
					$('#sureBtn').removeAttr('disabled');
					perInfo = perInfoData.EASY_TAB.item[0];
					$('#userIdShow').val(pernrShow(perInfo.PERNR));
					$('#userNameShow').html(checkNoChar(perInfo.NACHN));
					$('#butxt').val(checkNoChar(perInfo.BUTXT));
					$('#bumen').val(checkNoChar(perInfo.BUMEN));
					$('#plstx').val(checkNoChar(perInfo.PLSTX));
				}
			}
	});
}
//7.3.2加班页面是否考勤员判断
function submit_7_3_2(begda,pernr,endda){
	var begda1 = begda?begda:getToday8();
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	//拼接提交参数
	var paramJSon = {
		"I_PERNR":pernr1
	};
	$.post("/base/BASE_IS_KAOQINYUAN",JSON.stringify(paramJSon),function(ifKQYData){
		if(ifKQYData.status == '-1'){
				//alert('数据初始化异常，请稍后再试');
				return;
			}else{
				if (ifKQYData.RETURN_SUBRC != '0') {
					//alert('数据初始化异常，请稍后再试')
					return;
				}else {
					$('#addBtn').show();
					$('#userIdShow').removeAttr("readonly");
				}
			}
	});
}



//7.3.6加班申请提交
function submit_7_3_6(subParam,persArr){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	
	var perArr1 = [];
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
	//拼接提交参数
	var paramJSon = {
		"IT_P2005": {
							       "item":perArr1
						 },
			"P_BUSINESS_TYPE":"2005",
			"P_TJ_PERNR":pernr1
	};
	$.post("/zhrws/ZHRWS_OVERTIME_APPLY_SUBMIT",JSON.stringify(paramJSon),function(atSubData){
		if(atSubData.status == '-1'){
				alert('提交失败，请联系管理员或稍后重试')
				return;
			}else{
				if (atSubData.RETURN_SUBRC != '0') {
					alert(atSubData.RETURN_MESSAGE+'.请确认信息无误后重试');
					return;
				}else {
					alert('加班申请提交成功！');
					$('#date-timepicker1').val('');
					$('#date-timepicker2').val('');
					$('#timepicker1').val('');
					$('#timepicker2').val('');
					$('#content').html('请输入不多于80个字符');
					$('#jiabanTime').html('&nbsp-');
					$('#xiuxiTime').html('&nbsp-');
					$('#total').html('&nbsp-');
				}
			}
	});
}



//8 部门人事相关
//8.3.1 获取直属下属
function submit_8_3_1(pernr){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	
	//拼接提交参数
	var paramJSon = {
			"P_PERNR":pernr1,
	};
	$.post("/zhrws/ZHRWS_INQUIRY_SUBORDINATE",JSON.stringify(paramJSon),function(subordData){
		if(subordData.status == '-1'){
				alert(initErrMsg);
				return;
			}else{
				if (subordData.RETURN_SUBRC != '0') {
					$('#msg').hide();
					alert(subordData.RETURN_MESSAGE);
					return;
				}else {
					var subords = subordData.INQUIRY.item;
					localStorage.setItem('subordItem',JSON.stringify(subords));
					var listStr = '';
					for(var k in subords){
						listStr += '<input type="radio" name="ddlist" style="display:none"><div onclick="showDetail(\''+subords[k].PERNR+'\',this)" class="dd-handle tx-c">'+subords[k].NACHN+parseInt(subords[k].PERNR)+'</div>'
					}
					$('#subord').html(listStr);
					
					$("input[name='ddlist']")[0].checked = true;
					submit_8_3_2(getToday8(),subords[0].PERNR);
					submit_8_3_3(getToday8(),subords[0].PERNR);
					submit_8_3_4(getToday8(),subords[0].PERNR);
					$('#msg').show();
				}
			}
	});
}


//8.3.2 部门员工基本信息
function submit_8_3_2(begda,pernr){
	if(pernr == undefined || pernr.length < 6){
		alert('无法获取争取员工号，请重试');
		return;
	}
	var begda1 = begda?begda:getToday8();
	//拼接提交参数
	var paramJSon = {
		"IT_EXTENDMAP":[{
										"item": {
											"FIELDNAME":'',
											"VALUE":''
										}
										}
									],
		"I_PUBLIC":{
			"CHANNELSERIALNO":'',
			"ORIGINATETELLERID":'',
			"ZDOMAIN":'100',
			"I_PAGENO":'',
			"I_PAGESIZE":'',
			"ZVERSION":'',
		},
		"KEYDATE":begda1,
		"P_PERNR":add0(pernr,8),
		"P_PLANS":''
	};
	$.post("/zhrmss/ZHRMMS_READ_EE_INFO",JSON.stringify(paramJSon),function(eeInfoData){
		if(eeInfoData.status == '-1'){
				alert('个人信息请求异常！' +errMsg);
				return;
			}else{
				var E_PUBLIC = eeInfoData.E_PUBLIC;
				var IT0023 = eeInfoData.IT0023.item;
				var ZHR_EE_INFO = eeInfoData.ZHR_EE_INFO;
				
				if(undefined == ZHR_EE_INFO){
					alert('请求无数据！' );
					return;
				}else{
					if(undefined != IT0023 && IT0023.length>0){
						var localLvs = '';
						var otherLvs = '';
						for(var i=0;i<IT0023.length;i++){
							if(checkNoChar(IT0023[i].ZZ_LLLX)=='2'){
								if(localLvs != ''){
									localLvs += '<br/><br/>';
								}
								localLvs+='<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 时间 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'
								+checkNoChar(IT0023[i].BEGDA)+'~'
								+checkNoChar(IT0023[i].ENDDA)
								+'</span>'
								+'</div>'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> </div>'
								+'<div class="profile-info-value"style="width: 40%;">'
								+'<span class="editable" style="font-size:12px;"></span>'
								+'</div>'
								+'</div>'
								+'<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 工作单位 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ARBGB)+'</span>'
								+'</div>'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 行业</div>'
								+'<div class="profile-info-value"style="width: 40%;">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].BRANC_T)+'</span>'
								+'</div>'
								+'</div>'
								+'<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 部门 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ZZ_GZBM)+'</span>'
								+'</div>'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 岗位</div>'
								+'<div class="profile-info-value"style="width: 40%;">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ZZ_JOB)+'</span>'
								+'</div>'
								+'</div>'
								+'<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 变动原因 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ZZ_DDYY)+'</span>'
								+"</div>"
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> </div>'
								+'<div class="profile-info-value"style="width: 40%;">'
								+'<span class="editable" style="font-size:12px;" id=""></span>'
								+'</div>'
								+'</div>';
							}else{
								if(otherLvs != ''){
									otherLvs += '<br/><br/>';
								}
								otherLvs+='<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 时间 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;" id="username">'
								+checkNoChar(IT0023[i].BEGDA)+'~'
								+checkNoChar(IT0023[i].ENDDA)
								+'</span>'
								+'</div>'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> </div>'
								+'<div class="profile-info-value"style="width: 40%;">'
								+'<span class="editable" style="font-size:12px;"></span>'
								+'</div>'
								+'</div>'
								+'<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 工作单位 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ARBGB)+'</span>'
								+'</div>'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 行业</div>'
								+'<div class="profile-info-value"style="width: 40%;">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].BRANC_T)+'</span>'
								+'</div>'
								+'</div>'
								+'<div class="profile-info-row">'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 部门 </div>'
								+'<div class="profile-info-value">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ZZ_GZBM)+'</span>'
								+'</div>'
								+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 岗位</div>'
								+'<div class="profile-info-value"style="width: 40%;">'
								+'<span class="editable" style="font-size:12px;">'+checkNoChar(IT0023[i].ZZ_JOB)+'</span>'
								+'</div>'
								+'</div>';
							}
							
						}
						$('#localLv').html(localLvs);
						$('#otherLv').html(otherLvs);
					}
					
					$('#NACHN').html(checkNoChar(ZHR_EE_INFO.NACHN));
					$('#NACHN1').html(checkNoChar(ZHR_EE_INFO.NACHN));
					$('#PERNR').html(checkNoChar(ZHR_EE_INFO.PERNR));
					$('#PERNR1').html(checkNoChar(ZHR_EE_INFO.PERNR));
					$('#ORGTX').html(checkNoChar(ZHR_EE_INFO.ORGTX));
					$('#ORGTX1').html(checkNoChar(ZHR_EE_INFO.ORGTX));
					$('#GESCH_T').html(checkNoChar(ZHR_EE_INFO.GESCH_T));
					$('#ZZ_RZSJ').html(checkNoChar(ZHR_EE_INFO.ZZ_RZSJ));
					$('#GBDAT').html(checkNoChar(ZHR_EE_INFO.GBDAT));
					$('#PBTXT').html(checkNoChar(ZHR_EE_INFO.PBTXT));
					$('#BTRTX').html(checkNoChar(ZHR_EE_INFO.BTRTX));
					$('#PLSTX').html(checkNoChar(ZHR_EE_INFO.PLSTX));
					$('#ORGTX').html(checkNoChar(ZHR_EE_INFO.ORGTX));
					$('#ZZ_SPZXM').html(checkNoChar(ZHR_EE_INFO.ZZ_SPZXM));
					$('#ZZ_JSZWJBT').html(checkNoChar(ZHR_EE_INFO.ZZ_JSZWJBT));
					$('#ZZ_TEL1').html(checkNoChar(ZHR_EE_INFO.ZZ_TEL1));
					$('#ZZ_GZSJ').html(checkNoChar(ZHR_EE_INFO.ZZ_GZSJ));
					$('#ZZ_SXZY').html(checkNoChar(ZHR_EE_INFO.ZZ_SXZY));
					$('#ZZ_QDNX').html(checkNoChar(ZHR_EE_INFO.ZZ_HTKSRQ)+'~'+checkNoChar(ZHR_EE_INFO.ZZ_HTJZRQ));
					$('#ZZ_XZN').html(checkNoChar(ZHR_EE_INFO.ZZ_XZN));
					$('#INSTI').html(checkNoChar(ZHR_EE_INFO.INSTI));
					$('#ZZ_CZD1').html(checkNoChar(ZHR_EE_INFO.ZZ_CZD1));
					$('#SLART_T').html(checkNoChar(ZHR_EE_INFO.SLART_T));
					$('#ZZ_EMAIL').html(checkNoChar(ZHR_EE_INFO.ZZ_EMAIL));
					$('#ZZ_CZD').html(checkNoChar(ZHR_EE_INFO.ZZ_CZD));
					
					$('#jy_time').html(checkNoChar(ZHR_EE_INFO.ZZ_RXRQ)+'~'+checkNoChar(ZHR_EE_INFO.ZZ_BYRQ));
					$('#jy_school').html(checkNoChar(ZHR_EE_INFO.INSTI));
					$('#jy_pro').html(checkNoChar(ZHR_EE_INFO.ZZ_SXZY));
					$('#jy_edu').html(checkNoChar(ZHR_EE_INFO.SLART_T));
					$('#jy_deg').html(checkNoChar(ZHR_EE_INFO.SLART_T));
					$('#jy_type').html(checkNoChar(ZHR_EE_INFO.AUSBI_T));
					$('#jy_year').html(checkNoChar(parseInt(ZHR_EE_INFO.ZZ_XZN)));
					
				}
			}
	});
}



//8.3.4获取下属员工培训履历
function submit_8_3_4(begda,pernr){
	if(pernr == undefined || pernr.length < 6){
		alert('无法获取争取员工号，请重试');
		return;
	}
	
	var begda1 = begda?begda:getToday8();
	//拼接提交参数
	var paramJSon = {
		"IT_EXTENDMAP":[{
										"item": {
											"FIELDNAME":'',
											"VALUE":''
										}
										}
									],
		"I_PUBLIC":{
			"CHANNELSERIALNO":'',
			"ORIGINATETELLERID":'',
			"ZDOMAIN":'100',
			"I_PAGENO":'',
			"I_PAGESIZE":'',
			"ZVERSION":'',
		},
		"P_PERNR":pernr,
	};
	$.post("/zhrmss/ZHRMMS_READ_EE_TRAIN",JSON.stringify(paramJSon),function(trainData){
		if(trainData.status == '-1'){
				//alert('个人信息请求异常！' +errMsg);
				return;
			}else{
				var trainItems = trainData.IT9130.item;
				if(undefined != trainItems && trainItems.length>0){
					var trainStr = '';
					for(var i=0;i<trainItems.length;i++){
						if(trainStr != ''){
							trainStr += '<br/><br/>';
						}
						trainStr+='<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 时间 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'
						+checkNoChar(trainItems[i].BEGDA)+'~'
						+checkNoChar(trainItems[i].ENDDA)
						+'</span>'
						+'</div>'
						+'</div>'
						+'<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训课程名称 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXXM)+'</span>'
						+'</div>'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训方式</div>'
						+'<div class="profile-info-value"style="width: 40%;">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXFST)+'</span>'
						+'</div>'
						+'</div>'
						+'<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训类型 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;" >'+checkNoChar(trainItems[i].ZZ_PXLXT)+'</span>'
						+'</div>'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训阶段</div>'
						+'<div class="profile-info-value"style="width: 40%;">'
						+'<span class="editable" style="font-size:12px;" >'+checkNoChar(trainItems[i].ZZ_PXJDT)+'</span>'
						+'</div>'
						+'</div>'
						+'<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训产品类型1 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXCPJXT)+'</span>'
						+'</div>'			
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训产品名称1</div>'
						+'<div class="profile-info-value"style="width: 40%;">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXCPMCT)+'</span>'
						+'</div>'
						+'</div>'						
						+'<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训产品类型2 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXCPJX2T)+'</span>'
						+'</div>'			
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训产品名称2</div>'
						+'<div class="profile-info-value"style="width: 40%;">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXCPMC2T)+'</span>'
						+'</div>'
						+'</div>'	
						+'<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训地点 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXDD)+'</span>'
						+'</div>'			
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训课时</div>'
						+'<div class="profile-info-value"style="width: 40%;">'
						+'<span class="editable" style="font-size:12px;">'+parseInt(checkNoChar(trainItems[i].ZZ_PXKS))+'</span>'
						+'</div>'
						+'</div>'								
						+'<div class="profile-info-row">'
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 培训机构 </div>'
						+'<div class="profile-info-value">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_PXJG)+'</span>'
						+'</div>'			
						+'<div class="profile-info-name" style="color:#3399FF; font-size:12px;"> 获得资格</div>'
						+'<div class="profile-info-value"style="width: 40%;">'
						+'<span class="editable" style="font-size:12px;">'+checkNoChar(trainItems[i].ZZ_HDZG)+'</span>'
						+'</div>'
						+'</div>';							
												
					}
					
					$('#trainDiv').html(trainStr);
				}else{
					
				}
				
			}
	});
}


//8.3.3获取员工头像照片  base64
function submit_8_3_3(begda,pernr){
	if(pernr == undefined || pernr.length < 6){
		alert('无法获取争取员工号，请重试');
		return;
	}
	
	var begda1 = begda?begda:getToday8();
	//拼接提交参数
	var paramJSon = {
		"IT_EXTENDMAP":[{
										"item": {
											"FIELDNAME":'',
											"VALUE":''
										}
										}
									],
		"I_PUBLIC":{
			"CHANNELSERIALNO":'',
			"ORIGINATETELLERID":'',
			"ZDOMAIN":'100',
			"I_PAGENO":'',
			"I_PAGESIZE":'',
			"ZVERSION":'',
		},
		"P_PERNR":pernr,
	};
	$.post("/zhrmss/ZHRMMS_READ_PHOTO",JSON.stringify(paramJSon),function(photoData){
		if(photoData.status == '-1'){
				return;
			}else{
				var imgStr = '';
				var B64DATA = checkNoChar(photoData.B64DATA);
				var rtnCode = photoData.E_PUBLIC.CODE;
				if(rtnCode != '0'){
					$('#touxiang').attr('src','./assets/avatars/name.png');
				}else{
					$('#touxiang').attr('src','data:image/jpg;base64,'+B64DATA);
				}
			}
	});
}


//8.4 部门考勤相关
//8.4.1 获取直属下属  公共方法 返回数组
function submit_8_4_1(pernr){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	
	//拼接提交参数
	var paramJSon = {
			"P_PERNR":pernr1,
	};
	var rtnArr = [];
	$.post("/zhrws/ZHRWS_INQUIRY_SUBORDINATE",JSON.stringify(paramJSon),function(subordData){
		if(subordData.status == '-1'){
				alert(initErrMsg);
				//return rtnArr;
			}else{
				if (subordData.RETURN_SUBRC != '0') {
					$('#msg').hide();
					alert(subordData.RETURN_MESSAGE);
					//return rtnArr;
				}else {
					rtnArr = subordData.INQUIRY.item;
					//localStorage.setItem('subordItem',JSON.stringify(subords));
					
				}
			}
	});
	return rtnArr;
}

//8.4.2 获取部门考勤异常列表信息
function submit_8_4_2(subordData){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	
	var BEGDA = "20140601";
	var ENDDA = "20140630";
	
	var P_PERNR = [];
	for(var k in subordData){
		P_PERNR.push({"PERNR":subordData[k].PERNR});
	}
	//拼接提交参数
	var paramJSon = {
		"BEGDA":BEGDA,
		"ENDDA":ENDDA,
		"T_PERNR":{
			"item":P_PERNR
		}
	};
	$.post("/zhrws/ZHRWS_TIME_ERROR",JSON.stringify(paramJSon),function(attError){
		if(attError.status == '-1'){
				alert(errMsg);
				return;
			}else{
				if(attError.RETURN_SUBRC != '0'){
					alert("" == attError.RETURN_MESSAGE?errMsg1:attError.RETURN_MESSAGE);
					//alert(errMsg1);
					return;
				}else{
					//处理考勤异常返回
					var T_COUNT = attError.T_COUNT.item;
					var listStr = '';
					$('#totalCount').html(T_COUNT.length);
					for(var k in T_COUNT){
						listStr += '<div class="panel panel-default" style="background-color: white; margin-left: -12px; margin-right: -12px;">'
						+'<div class="panel-heading">'
						+'<h4 class="panel-title">'
						+'<a onclick="getPerData(\''+k+'\',\''+T_COUNT[k].PERNR+'\',\''+BEGDA+'\',\''+ENDDA+'\')" class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#lists" href="#collapse'+k+'">'
						+'<div style="color:#A9AAAC; font-size: 14px;">'
						+'<i class="ace-icon fa fa-angle-right bigger-110" data-icon-hide="ace-icon fa fa-angle-down" data-icon-show="ace-icon fa fa-angle-right" style="float:left">'
						+'</i>'
						+'<span style="margin-left:45px" class="col-xs-3">'+T_COUNT[k].PERNR+'</span>'
						+'<span style="margin-left:0px" class="col-xs-4">'+T_COUNT[k].NACHN+'</span>'
						+'<span style="margin-left:0px" >'+T_COUNT[k].LINES+' </span>'
						+'</div>'
						+'</a>'
						+'</h4>'
						+'</div>'
						+'<div class="panel-collapse collapse" id="collapse'+k+'">'
						+'</div>'
						+'</div>';
						

					}
					$('#lists').html(listStr);
				}
			}
	});
	
}


//8.4.3 获取部门考勤加班列表信息
function submit_8_4_3(subordData){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	
	var BEGDA = "20140601";
	var ENDDA = "20140630";
	
	var P_PERNR = [];
	for(var k in subordData){
		P_PERNR.push({"PERNR":subordData[k].PERNR});
	}
	//拼接提交参数
	var paramJSon = {
		"APPROVAL":"",
		"BEGDA":BEGDA,
		"ENDDA":ENDDA,
		"T_PERNR":{
			"item":P_PERNR
		}
	};
	$.post("/zhrws/ZHRWS_TIME_OVERTIME",JSON.stringify(paramJSon),function(otData){
		if(otData.status == '-1'){
				alert(errMsg);
				return;
			}else{
				if(otData.RETURN_SUBRC != '0'){
					alert("" == otData.RETURN_MESSAGE?errMsg1:otData.RETURN_MESSAGE);
					//alert(errMsg1);
					return;
				}else{
					//处理考勤异常返回
					var T_COUNT = otData.T_COUNT.item;
					var listStr = '';
					$('#totalCount').html(T_COUNT.length);
					for(var k in T_COUNT){
						listStr += '<div class="panel panel-default" style="background-color: white; margin-left: -12px; margin-right: -12px;">'
						+'<div class="panel-heading">'
						+'<h4 class="panel-title">'
						+'<a onclick="getPerData(\''+k+'\',\''+checkNoChar(T_COUNT[k].PERNR)+'\',\''+BEGDA+'\',\''+ENDDA+'\')" class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#lists" href="#collapse'+k+'">'
						+'<div style="color:#A9AAAC; font-size: 14px;">'
						+'<i class="ace-icon fa fa-angle-right bigger-110" data-icon-hide="ace-icon fa fa-angle-down" data-icon-show="ace-icon fa fa-angle-right" style="float:left">'
						+'</i>'
						+'<span style="margin-left:45px" class="col-xs-3">'+T_COUNT[k].PERNR+'</span>'
						+'<span style="margin-left:0px" class="col-xs-4">'+T_COUNT[k].NACHN+'</span>'
						+'<span style="margin-left:0px" >'+T_COUNT[k].LINES+' </span>'
						+'</div>'
						+'</a>'
						+'</h4>'
						+'</div>'
						+'<div class="panel-collapse collapse" id="collapse'+k+'">'
						+'</div>'
						+'</div>';
						

					}
					$('#lists').html(listStr);
				}
			}
	});
	
}


//8.4.4 获取直属下属 部门刷卡信息
function submit_8_4_4(pernr){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	
	//拼接提交参数
	var paramJSon = {
			"P_PERNR":pernr1,
	};
	$.post("/zhrws/ZHRWS_INQUIRY_SUBORDINATE",JSON.stringify(paramJSon),function(subordData){
		if(subordData.status == '-1'){
				alert(initErrMsg);
				return;
			}else{
				if (subordData.RETURN_SUBRC != '0') {
					//$('#msg').hide();
					alert(subordData.RETURN_MESSAGE);
					return;
				}else {
					var subords = subordData.INQUIRY.item;
					localStorage.setItem('subordItem',JSON.stringify(subords));
					var listStr = '';
					for(var k in subords){
						listStr += '<input type="radio" name="ddlist" style="display:none"><div onclick="showDetail(\''+subords[k].PERNR+'\',this)" class="dd-handle tx-c" style="font-weight:400">'+subords[k].NACHN+parseInt(subords[k].PERNR)+'</div>'
					}
					$('#subord').html(listStr);
					
					$("input[name='ddlist']")[0].checked = true;
					
					//test
					var thisYear = new Date().getFullYear();
				var lastMonth = new Date().getMonth();
				var thisMonth = new Date().getMonth() + 1;
				var daysEachMon = [31,28,31,30,31,30,31,31,30,31,30,31];//每个月的天数
				daysEachMon[1] = (0==thisYear%4 && (thisYear%100!=0 || thisYear%400==0)) ? 29 : 28; //闰年二月为29天
				var thisDate = {year:thisYear,month:thisMonth,daysCount:daysEachMon[lastMonth]};
					submit_8_4_5(thisDate,subords[0].PERNR);
				}
			}
	});
}


//8.4.5部门考勤 刷卡信息月历
function submit_8_4_5(dateJson,p_pernr){
	//var p_pernr = p_pernr?p_pernr:pernrBase;   //员工号    从存储中获取
	//初始化当前年月
	var p_begDate = dateJson.p_begDate?dateJson.p_begDate:getFirstDay_8();
	var p_endDate = dateJson.p_endDate?dateJson.p_endDate:getLastDay_8();
	//拼接提交参数
	var paramJSon = {
		"P_BEGDA":p_begDate,
		"P_ENDDA":p_endDate,
		"P_PERNR":p_pernr
	};
	
	var myCaleData = null;
	var myOverviewData = null;
	//提交
	$.post("/zhrws/ZHRWS_MY_TIME_CALENDAR",JSON.stringify(paramJSon),function(data){
		if(data.status == '-1'){
			alert(errMsg);
			emptyCal(dateJson);
			return;
		}else{
			if(data.RETURN_SUBRC != '0'){
				alert("" == data.RETURN_MESSAGE?errMsg1:data.RETURN_MESSAGE);
				emptyCal(dateJson);
				//alert(errMsg1);
				
				return;
			}else{
				myCaleData = data.MY_TIME_CALE.item;  //月历列表
				//localStorage.myCaleData = JSON.stringify(myCaleData);
//2.3.2 考勤概览请求
				$.post("/zhrws/ZHRWS_MY_TIME_OVERVIEW",JSON.stringify(paramJSon),function(data1){
					if(data1.status == '-1'){
						alert(errMsg);
						return;
					}else{
						if(data1.RETURN_SUBRC != '0'){
							alert("" == data1.RETURN_MESSAGE?errMsg1:data1.RETURN_MESSAGE);
							
							//alert(errMsg1);
							return;
						}else{
							myOverviewData = data1.MY_TIME_OVERVIEW.item; //某天考勤信息概览列表
							//localStorage.myOverviewData = JSON.stringify(myOverviewData);
							//alert(myCaleData[0].DATUM + "||" +myOverviewData[4].CLOCK );
							
							//显示的日期数组
							var showArr = [];
							//当月信息
							var thisY = dateJson.year?dateJson.year:new Date().getFullYear();
							var thisM = dateJson.month?dateJson.month:new Date().getMonth()+1;
							var lastM = dateJson.month?(dateJson.month-1):new Date().getMonth();
							var DateOne = new Date(thisY,lastM,1);
							var dayOne = DateOne.getDay();//当月1号星期几   8月1日周五  返回5
							//上月信息
							var daysEachMonThis = [31,28,31,30,31,30,31,31,30,31,30,31];//每个月的天数
							var lastMonthDayLast = 31;
							daysEachMonThis[1] = (0==thisY%4 && (thisY%100!=0 || thisY%400==0)) ? 29 : 28; //闰年二月为29天
							if(thisM != '0'){
								lastMonthDayLast = daysEachMonThis[lastM];
							}
							
							for(var i =dayOne;i>0;i--){
								showArr.push({type:"lastMonth",
									dateShow:lastMonthDayLast-i+1,
									ifData:false,
									datum:'0',
									status:'0',
									data:""});
							}
							
							for(var j=1;j<=daysEachMonThis[lastM];j++){
								showArr.push({type:"thisMonth",
									dateShow:j,
									ifData:typeof myOverviewData[j-1].CLOCK == "object"?false:true,
									status:myOverviewData[j-1].STATUS,
									datum:myOverviewData[j-1].DATUM,
									data:typeof myOverviewData[j-1].CLOCK == "object"?"":myOverviewData[j-1].CLOCK});
							}
							
							var lenTemp = showArr.length;
							for(var k=42;k>lenTemp;k--){
								showArr.push({type:"nextMonth",
									dateShow:43-k,
									ifData:false,
									datum:'0',
									status:'0',
									data:""});
							}
							//初始化showArr完成
							
							var tbodyStr = '<tr class="fc-week fc-first">';
							var strTemp = '';
							var monType = '';
							var monType1 = '';
							var mark = '';
							var onclickstr = '';
							markCalss = '';
							for(var i=0;i<showArr.length;i++){
								
								if(showArr[i].ifData){
									if(showArr[i].status =='3'){
										mark = '<div class="fc-day-content">\
                                                                            <div style="position: relative; height:auto;background-color:#FFFF99;font-size:1.1em !important">'+showArr[i].data.replace(/,/g,'<br/>')+'</div>\
                                                                        </div>';
										markCalss = 'mark-yellow';
									}else{
										mark = '<div class="fc-day-content">\
                                                                            <div style="position: relative; height:auto;background-color:#66FF99;font-size:1.1em !important">'+showArr[i].data.replace(/,/g,'<br/>')+'</div>\
                                                                        </div>';
										markCalss = 'mark-green';
									}
									
								}else if(showArr[i].status =='3'){
									mark = '<div class="fc-day-content">\
                                                                            <div style="position: relative; height:20px;background-color:#FFFF99;font-size:1.1em !important"></div>\
                                                                        </div>';
									markCalss = 'mark-yellow';
								}else{
									mark = '';
								}
								
																		
																		
																		
																		
								monType = showArr[i].type != "thisMonth"?'fc-other-month':'';
								if( i % 7 == 0){
									monType1 = ' fc-first';
								}else if(i%7 == 6){
									monType1 = ' fc-last';
								}else{
									monType1 = '';
								}
								
								if (i ==35) {
									tbodyStr += '<tr class="fc-week fc-last">';
								}else if (i != 0 && i % 7 == 0) {
									tbodyStr += '<tr class="fc-week">';
								}
								
								onclickstr = 'openDetail(\''+(showArr[i].datum?showArr[i].datum:'') +'\',\''+showArr[i].status+'\')'; 
								
									tbodyStr += '<td onclick="'+onclickstr+'" class="fc-day fc-sun fc-widget-content '+monType+' fc-past '+monType1+'">\
                                                                    <div style="min-height: 101px;" class="'+markCalss+'">\
                                                                        <div class="fc-day-number  numberShow" style="float:none; !important">'+showArr[i].dateShow+'</div>'
																		+mark
                                                                    +'</div>\
                                                                </td>';
																
								if(i%7 == 6){
									tbodyStr += '</tr>';
								}		
								
								
												
								markCalss = '';
							}
							$('#calTbody').html(tbodyStr)	;	
							
						}
					}
				});
				
			}
		}
	});
}

//8.4.6 获取部门休假列表信息
function submit_8_4_6(subordData){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	
	var BEGDA = "20140601";
	var ENDDA = "20140630";
	
	var P_PERNR = [];
	for(var k in subordData){
		P_PERNR.push({"PERNR":subordData[k].PERNR});
	}
	//拼接提交参数
	var paramJSon = {
		"APPROVAL":"",
		"BEGDA":BEGDA,
		"ENDDA":ENDDA,
		"T_PERNR":{
			"item":P_PERNR
		}
	};
	$.post("/zhrws/ZHRWS_TIME_ABSENCE",JSON.stringify(paramJSon),function(vaData){
		if(vaData.status == '-1'){
				alert(errMsg);
				return;
			}else{
				if(vaData.RETURN_SUBRC != '0'){
					alert("" == vaData.RETURN_MESSAGE?errMsg1:vaData.RETURN_MESSAGE);
					//alert(errMsg1);
					return;
				}else{
					//处理考勤异常返回
					var T_COUNT = vaData.T_COUNT.item;
					var listStr = '';
					$('#totalCount').html(T_COUNT.length);
					for(var k in T_COUNT){
						listStr += '<div class="panel panel-default" style="background-color: white; margin-left: -12px; margin-right: -12px;">'
						+'<div class="panel-heading">'
						+'<h4 class="panel-title">'
						+'<a onclick="getPerData(\''+k+'\',\''+checkNoChar(T_COUNT[k].PERNR)+'\',\''+BEGDA+'\',\''+ENDDA+'\')" class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#lists" href="#collapse'+k+'">'
						+'<div style="color:#A9AAAC; font-size: 14px;">'
						+'<i class="ace-icon fa fa-angle-right bigger-110" data-icon-hide="ace-icon fa fa-angle-down" data-icon-show="ace-icon fa fa-angle-right" style="float:left">'
						+'</i>'
						+'<span style="margin-left:45px" class="col-xs-3">'+T_COUNT[k].PERNR+'</span>'
						+'<span style="margin-left:0px" class="col-xs-4">'+T_COUNT[k].NACHN+'</span>'
						+'<span style="margin-left:0px" >'+T_COUNT[k].LINES+' </span>'
						+'</div>'
						+'</a>'
						+'</h4>'
						+'</div>'
						+'<div class="panel-collapse collapse" id="collapse'+k+'">'
						+'</div>'
						+'</div>';
						

					}
					$('#lists').html(listStr);
				}
			}
	});
	
}



//8.4.7 获取部门出差列表信息
function submit_8_4_7(subordData){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	
	var BEGDA = "20140601";
	var ENDDA = "20140630";
	
	var P_PERNR = [];
	for(var k in subordData){
		P_PERNR.push({"PERNR":subordData[k].PERNR});
	}
	//拼接提交参数
	var paramJSon = {
		"BEGDA":BEGDA,
		"ENDDA":ENDDA,
		"T_PERNR":{
			"item":P_PERNR
		}
	};
	$.post("/zhrws/ZHRWS_TIME_ATTENDANCE",JSON.stringify(paramJSon),function(trData){
		if(trData.status == '-1'){
				alert(errMsg);
				return;
			}else{
				if(trData.RETURN_SUBRC != '0'){
					alert("" == trData.RETURN_MESSAGE?errMsg1:trData.RETURN_MESSAGE);
					//alert(errMsg1);
					return;
				}else{
					//处理考勤异常返回
					var T_COUNT = trData.T_COUNT.item;
					var listStr = '';
					$('#totalCount').html(T_COUNT.length);
					for(var k in T_COUNT){
						listStr += '<div class="panel panel-default" style="background-color: white; margin-left: -12px; margin-right: -12px;">'
						+'<div class="panel-heading">'
						+'<h4 class="panel-title">'
						+'<a onclick="getPerData(\''+k+'\',\''+checkNoChar(T_COUNT[k].PERNR)+'\',\''+BEGDA+'\',\''+ENDDA+'\')" class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#lists" href="#collapse'+k+'">'
						+'<div style="color:#A9AAAC; font-size: 14px;">'
						+'<i class="ace-icon fa fa-angle-right bigger-110" data-icon-hide="ace-icon fa fa-angle-down" data-icon-show="ace-icon fa fa-angle-right" style="float:left">'
						+'</i>'
						+'<span style="margin-left:45px" class="col-xs-3">'+T_COUNT[k].PERNR+'</span>'
						+'<span style="margin-left:0px" class="col-xs-4">'+T_COUNT[k].NACHN+'</span>'
						+'<span style="margin-left:0px" >'+T_COUNT[k].LINES+' </span>'
						+'</div>'
						+'</a>'
						+'</h4>'
						+'</div>'
						+'<div class="panel-collapse collapse" id="collapse'+k+'">'
						+'</div>'
						+'</div>';
						

					}
					$('#lists').html(listStr);
				}
			}
	});
	
}

//9统一待办wa_
//9.1 待审批相关
//9.1.1加班和考勤异常待审条数
function submit_9_1_1(){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	
	//拼接提交参数
	var paramJSon = {
		"P_SP_PERNR":pernr1,
		"P_SP_STATUS":"0"
	};
	$.post("/zhrws/ZHRWS_GET_OT_CO_LINES",JSON.stringify(paramJSon),function(waCountData){
		if(waCountData.status == '-1'){
				return;
			}else{
				$('#overtime_count').html(checkNoChar(waCountData.E_2005));
				$('#error_count').html(checkNoChar(waCountData.E_2011));
			}
	});
}

//9.1.2加班待审列表
function submit_9_1_2(spType){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	
	//拼接提交参数
	var paramJSon = {
		"P_BEGDA":"",
		"P_BUSI_TYPE":"2005",    //加班
		"P_ENDDA":"",
		"P_FORM_ID":"",
		"P_SP_PERNR":pernr1,
		"P_SP_STATUS":spType
	};
	$.post("/zhrws/ZHRWS_WF_GET_FORM_OT",JSON.stringify(paramJSon),function(waOTListsData){
		if(waOTListsData.status == '-1'){
				return;
			}else{
				if (waOTListsData.RETURN_SUBRC != '0') {
					alert("" == waOTListsData.RETURN_MESSAGE ? errMsg1 : waOTListsData.RETURN_MESSAGE);
					return;
				}
				else {
					var waOTLists = waOTListsData.WF_P2005.item;
					localStorage.setItem("waOTLists",JSON.stringify(waOTLists));  //存缓存，做分页用
					
					$('#totalCount').html(waOTLists.length);
					var listsStr = '';
					for(var i=0;i<waOTLists.length;i++){
						listsStr += '<div class="panel panel-default">'
						+'<div class="panel-heading">'
						+'<h4 class="panel-title" style="">'
						+'<label class="inline" style="width: 20px;margin-top: 10px;margin-left: 6px;">'
						+'<input name="a1" type="checkbox" class="ace" style="">'
						+'<span class="lbl" style=""></span>'
						+'</label>'
						+'<a onclick="getPerData(\''+i+'\',\''+checkNoChar(waOTLists[i].PERNR)+'\',\''+checkNoChar(waOTLists[i].FORM_ID)+'\',\''+checkNoChar(waOTLists[i].XH)+'\')" class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion"\ href="#collapse'+i+'" style="height: 30px;margin-left: 22px;margin-top: -32.6px;">'
//						+'<span style="font-size: 18px;color: #393939; margin-left: 65px;">'+checkNoChar(waOTLists[i].NACHN)+'</span>'
//						+'<span style="font-size: 18px;color: #393939;margin-left: 50px;">'+checkNoChar(waOTLists[i].BEGDA)+'</span>'
//						+'<span style="font-size: 18px;color: #393939;margin-left: 40px;">'+checkNoChar(waOTLists[i].BEGUZ)+'~'+checkNoChar(waOTLists[i].ENDUZ)+'</span>'
//						+'<span style="font-size: 18px; color: #393939;margin-left: 30px;">'+cutReason(checkNoChar(waOTLists[i].REASON))+'</span>'

						+'<table style="font-size: 20px;width:100%">'
						+'<tr>'
						+'<td style="width: 20%;">'+checkNoChar(waOTLists[i].NACHN)+' '+checkNoChar(waOTLists[i].PERNR)+'</td>'
						+'<td style="width: 15%;">'+checkNoChar(waOTLists[i].BEGDA)+'</td>'
						+'<td style="width: 20%;">'+checkNoChar(waOTLists[i].BEGUZ)+'~'+checkNoChar(waOTLists[i].ENDUZ)+'</td>'
						+'<td style="width: 44%;">'+cutReason(checkNoChar(waOTLists[i].REASON))+'</td>'
						+'</tr>'
						+'</table>'
						+'</a>'
						+'</h4>'
						+'</div>'
						+'<div class="panel-collapse collapse" id="collapse'+i+'" style="height: 0px;">'
						+'</div>'
						+'</div>';
					}
					
					$('#listsStr').html(listsStr);
					
				}
			}
	});
}


//9.1.3休假列表和条数 CE
function submit_9_1_3(){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	
	//拼接提交参数
	var paramJSon = {
		"input":{
			"channelSerialNo":getDateNumber(),
			"currUsrId":parseInt(pernr1).toString(),
			"domain":"400",
			"extendMap":{
				"entry":[{
					"Key":"",
					"Value":""
				}]
			},
			"qryType":"4",
			"userId":parseInt(pernr1).toString(),
			"lastTime":getToday8(),
			"bussType":"2001",
			"startPage":1,
			"pageSize":1000
		}
	};
	$.post("/portal/PORTAL_BPMI_TaskListQry",JSON.stringify(paramJSon),function(waVacationListsData){
		if(waVacationListsData.status == '-1'){
				return;
			}else{
				if (waVacationListsData.output.type != 'S') {
					//alert("" == waVacationListsData.output.message ? errMsg1 : waVacationListsData.output.message);
					return;
				}
				else {
					var waVacationLists = waVacationListsData.output.waitTaskList;
					localStorage.setItem("waVacationLists",JSON.stringify(waVacationLists));  //存缓存，做分页用
					$('#vacation_count').html(waVacationListsData.output.totalCount);
					$('#totalCount').html(waVacationListsData.output.totalCount);
					var listsStr = '';
					if(waVacationLists.length == undefined){
						listsStr += '<div class="panel panel-default">'
						+'<div class="panel-heading">'
						+'<h4 class="panel-title" style="">'
						+'<label class="inline" style="width: 20px;margin-top: 10px;margin-left: 6px;">'
						+'<input onclick="quanxuan()" name="a1" type="checkbox" class="ace" style="">'
						+'<span class="lbl" style=""></span>'
						+'</label>'
						+'<a onclick="getPerData(\''+i+'\',\''+checkNoChar(waVacationLists.reqUsrId)+'\',\''+checkNoChar(waVacationLists.bussNo)+'\',\''+checkNoChar(waVacationLists.taskId)+'\',\''+checkNoChar(waVacationLists.currStep)+'\')" class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion"\ href="#collapse'+i+'" style="height: 30px;margin-left: 22px;margin-top: -32.6px;">'
						+'<table style="font-size: 20px;width:100%">'
						+'<tr>'
						+'<td style="width: 18%;">'+checkNoChar(waVacationLists.reqUsrNm)+' '+checkNoChar(waVacationLists.reqUsrId)+'</td>'
						+'<td style="width: 10%;">'+'事假'+'</td>'
						+'<td style="width: 27%;">'+'2014-09-01至2014-09-02'+'</td>'
						+'<td style="width: 30%;">'+'休假事由测试1'+'</td>'
						+'<td style="width: 15%;">'+checkNoChar(waVacationLists.crtDate).substr(0,10)+'</td>'
						+'</tr>'
						+'</table>'
						+'</a>'
						+'</h4>'
						+'</div>'
						+'<div class="panel-collapse collapse" id="collapse'+i+'" style="height: 0px;">'
						+'</div>'
						+'</div>';
					}else{
						for(var i=0;i<waVacationLists.length;i++){
						listsStr += '<div class="panel panel-default">'
						+'<div class="panel-heading">'
						+'<h4 class="panel-title" style="">'
						+'<label class="inline" style="width: 20px;margin-top: 10px;margin-left: 6px;">'
						+'<input onclick="quanxuan()" name="a1" type="checkbox" class="ace" style="">'
						+'<span class="lbl" style=""></span>'
						+'</label>'
						+'<a onclick="getPerData(\''+i+'\',\''+checkNoChar(waVacationLists[i].reqUsrId)+'\',\''+checkNoChar(waVacationLists[i].bussNo)+'\',\''+checkNoChar(waVacationLists[i].taskId)+'\',\''+checkNoChar(waVacationLists[i].currStep)+'\')" class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion"\ href="#collapse'+i+'" style="height: 30px;margin-left: 22px;margin-top: -32.6px;">'
						+'<table style="font-size: 20px;width:100%">'
						+'<tr>'
						+'<td style="width: 18%;">'+checkNoChar(waVacationLists[i].reqUsrNm)+' '+checkNoChar(waVacationLists[i].reqUsrId)+'</td>'
						+'<td style="width: 10%;">'+'事假'+'</td>'
						+'<td style="width: 27%;">'+'2014-09-01至2014-09-02'+'</td>'
						+'<td style="width: 30%;">'+'休假事由测试1'+'</td>'
						+'<td style="width: 15%;">'+checkNoChar(waVacationLists[i].crtDate).substr(0,10)+'</td>'
						+'</tr>'
						+'</table>'
						+'</a>'
						+'</h4>'
						+'</div>'
						+'<div class="panel-collapse collapse" id="collapse'+i+'" style="height: 0px;">'
						+'</div>'
						+'</div>';
					}
					}
					
					
					$('#listsStr').html(listsStr);
					
				}
			}
	});
}


//9.1.4异常待审列表
function submit_9_1_4(spType){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:pernrBase;
	
	//拼接提交参数
	var paramJSon = {
		"P_BEGDA":"",
		"P_BUSI_TYPE":"2011",    //异常
		"P_ENDDA":"",
		"P_FORM_ID":"",
		"P_SP_PERNR":pernr1,
		"P_SP_STATUS":spType,
		"P_XH":""
	};
	$.post("/zhrws/ZHRWS_WF_GET_FORM_CLOCK",JSON.stringify(paramJSon),function(waClockListsData){
		if(waClockListsData.status == '-1'){
				return;
			}else{
				if (waClockListsData.RETURN_SUBRC != '0') {
					alert("" == waClockListsData.RETURN_MESSAGE ? errMsg1 : waClockListsData.RETURN_MESSAGE);
					return;
				}
				else {
					var waClockLists = waClockListsData.WF_P2011.item;
					localStorage.setItem("waClockLists",JSON.stringify(waClockLists));  //存缓存，做分页用
					
					$('#totalCount').html(waClockLists.length);
					var listsStr = '';
					for(var i=0;i<waClockLists.length;i++){
						listsStr += '<div class="panel panel-default">'
						+'<div class="panel-heading">'
						+'<h4 class="panel-title" style="">'
						+'<label class="inline" style="width: 20px;margin-top: 10px;margin-left: 6px;">'
						+'<input onclick="quanxuan()" name="a1" type="checkbox" class="ace" style="">'
						+'<span class="lbl" style=""></span>'
						+'</label>'
						+'<a onclick="getPerData(\''+i+'\',\''+checkNoChar(waClockLists[i].NACHN)+'\',\''+checkNoChar(waClockLists[i].PERNR)+'\',\''+checkNoChar(waClockLists[i].FORM_ID)+'\',\''+checkNoChar(waClockLists[i].XH)+'\',\''+errorCon1(checkNoChar(waClockLists[i].SATZA))+'\')" class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion"\ href="#collapse'+i+'" style="height: 30px;margin-left: 22px;margin-top: -32.6px;">'
//						+'<span style="font-size: 18px;color: #393939; margin-left: 65px;">'+checkNoChar(waOTLists[i].NACHN)+'</span>'
//						+'<span style="font-size: 18px;color: #393939;margin-left: 50px;">'+checkNoChar(waOTLists[i].BEGDA)+'</span>'
//						+'<span style="font-size: 18px;color: #393939;margin-left: 40px;">'+checkNoChar(waOTLists[i].BEGUZ)+'~'+checkNoChar(waOTLists[i].ENDUZ)+'</span>'
//						+'<span style="font-size: 18px; color: #393939;margin-left: 30px;">'+cutReason(checkNoChar(waOTLists[i].REASON))+'</span>'

						+'<table style="font-size: 20px;width:100%">'
						+'<tr>'
						+'<td style="width: 20%;">'+checkNoChar(waClockLists[i].NACHN)+' '+checkNoChar(waClockLists[i].PERNR)+'</td>'
						+'<td style="width: 15%;">'+errorCon1(checkNoChar(waClockLists[i].SATZA))+'</td>'
						+'<td style="width: 20%;">'+checkNoChar(waClockLists[i].LDATE)+'~'+cutSecond(checkNoChar(waClockLists[i].LTIME))+'</td>'
						+'<td style="width: 44%;">'+cutReason(checkNoChar(waClockLists[i].GTEXT))+'</td>'
						+'</tr>'
						+'</table>'
						+'</a>'
						+'</h4>'
						+'</div>'
						+'<div class="panel-collapse collapse" id="collapse'+i+'" style="height: 0px;">'
						+'</div>'
						+'</div>';
					}
					
					$('#listsStr').html(listsStr);
					
				}
			}
	});
}


//9.1.5休假条数（和列表一起返回） CE
function submit_9_1_5(begda,pernr){
	var pernr1 = localStorage.pernrBase;
	pernr1 = pernr1?pernr1:(pernr?pernr:pernrBase);
	
	//拼接提交参数
	var paramJSon = {
		"input":{
			"channelSerialNo":getDateNumber(),
			"currUsrId":parseInt(pernr1).toString(),
			"domain":"400",
			"extendMap":{
				"entry":[{
					"Key":"",
					"Value":""
				}]
			},
			"qryType":"4",
			"userId":parseInt(pernr1).toString(),
			"lastTime":getToday8(),
			"bussType":"2001",
			"startPage":1,
			"pageSize":1000
		}
	};
	$.post("/portal/PORTAL_BPMI_TaskListQry",JSON.stringify(paramJSon),function(waVacationListsData){
		if(waVacationListsData.status == '-1'){
				return;
			}else{
				if (waVacationListsData.output.type != 'S') {
					alert("" == waVacationListsData.output.message ? errMsg1 : waVacationListsData.output.message);
					return;
				}
				else {
					var waVacationLists = waVacationListsData.output.waitTaskList;
					$('#vacation_count').html(waVacationListsData.output.totalCount);
				}
			}
	});
}