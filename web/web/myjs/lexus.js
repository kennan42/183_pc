/*
这个js定义一些公共方法
*/

/*
1常量
*/
var noUserMsg = "无法获取当前人员信息，请重新登录";
var errMsg = "网络异常，请稍后再试！";
var errMsg1 = "数据返回异常，请检查提交数据后重试";
var initErrMsg = "数据初始化异常，请关闭页面重试";
var submitErrMsg = "提交失败，请联系管理员";

//分页条数
var pagesize = 20;

var spPageSize = 20;


//下载需要地址
// var localHostIp = '10.10.1.183:808';
//var localHostIp = '10.10.1.152:808';
//var localHostIp = '10.10.1.145:808';
//var localHostIp = '10.10.1.150:808';
var localHostIp = 'ai.cttq.com:808';
//企业信息门户跳转地址
function MHUrl(){
    //开发
    //$("#qiyemenghu").attr("href","http://cpd.cttq.com:50000/irj/portal/");
    //测试
    //$("#qiyemenghu").attr("href","http://cpq.cttq.com:52200/irj/portal/");
    //生产
    $("#qiyemenghu").attr("href","http://portal.cttq.com:53300/irj/portal");
}
function depClockTop_MHUrl(){
    //开发
    //window.parent.location.href = "http://cpd.cttq.com:50000/irj/portal/"
    //测试
    //window.parent.location.href = "http://cpq.cttq.com:52200/irj/portal/"
    //生产
    window.parent.location.href = "http://portal.cttq.com:53300/irj/portal"
}

var timeout = 5000; 

//定义星期
var weekArr = ['周日','周一','周二','周三','周四','周五','周六'];

//定义页面模块id
var modeJSON = {"001":"waVacation.html","002":"aaVacation.html","011":"depAttendance.html","012":"depHrDetail.html","021":"perAttendance.html","022":"perHrDetail.html","023":"vacationAsk.html","024":"overtimeAsk.html"}; 




/*
 * 1.1 员工号  测试用p_pernr = '08102406';
*/
//8102851
//var pernrBase = '08102406';  //郑
//var pernrBase = '08100006';
//var pernrBase = '08102289';  //师
//var pernrBase = '08102623';   //张
//var pernrBase = '08101195';   //徐
//var pernrBase = '8101524'; 
//var pernrBase = '8100323'; 
//var pernrBase = '8100492'; //8102597
//08100731江舜安


//localStorage.pernrBase = pernrBase;


/*
 * 1.2关闭当前页面
*/
function closeThis(){
	window.close();
}

//1.3判断字符串是否是空字符串
function isEmpty(str){
	var isEmpty = false;
	if(str == ''){
		isEmpty = true;
	}
	return isEmpty;
}




/*
2.1获取当年年月并拼接成字符串
如“201408”“20140814”
*/
var thisYear = new Date().getFullYear();
var lastMonth = new Date().getMonth();
var thisMonth = new Date().getMonth() + 1;
var daysEachMon = [31,28,31,30,31,30,31,31,30,31,30,31];//每个月的天数
daysEachMon[1] = (0==thisYear%4 && (thisYear%100!=0 || thisYear%400==0)) ? 29 : 28; //闰年二月为29天
//2.1.1获取当前年月的第一天
function getFirstDay_8(){
	var firstDay = thisYear + (thisMonth<10?"0":"") + thisMonth + "01";
	return firstDay;
}
//2.1.2获取当前年月的最后一天
function getLastDay_8(){
	var lastDay = thisYear + (thisMonth<10?"0":"") + thisMonth + daysEachMon[lastMonth];
	return lastDay;
}
//2.1.3获取当前月的上下个月的日期
function getMonth1(thisDate){
	var firstDay = thisDate.year + (thisDate.month<10?"0":"") + thisDate.month + "01";
	return firstDay;
}
function getMonth2(thisDate){
	var daysEachMon2 = [31,28,31,30,31,30,31,31,30,31,30,31];//每个月的天数
	daysEachMon[1] = (0==thisDate.year%4 && (thisDate.year%100!=0 || thisDate.year%400==0)) ? 29 : 28; //闰年二月为29天
	var lastDay = thisDate.year + (thisDate.month<10?"0":"") + thisDate.month + daysEachMon[thisDate.month-1];
	return lastDay;
}
//2.1.4获取当天的日期
function getToday8(){
	var dateT = new Date();
	var y = dateT.getFullYear();
	var m = dateT.getMonth()+1;
	var d = dateT.getDate();
	return y + (m<10?'0':'') + m + (d<10?'0':'') + d;
}

//2.1.5月对象，可获取某年某月的第一天和最后一天的日期

//2.1.6已审批中需要查询90天和30天内的数据
function getbeg90(){
	var dateT = new Date();
	var dateE = new Date(dateT.getTime() - 90*24*60*60*1000);
	var y = dateE.getFullYear();
	var m = dateE.getMonth()+1;
	var d = dateE.getDate();
	return y + (m<10?'0':'') + m + (d<10?'0':'') + d;
}

function getbeg30(){
	var dateT = new Date();
	var dateE = new Date(dateT.getTime() - 30*24*60*60*1000);
	var y = dateE.getFullYear();
	var m = dateE.getMonth()+1;
	var d = dateE.getDate();
	return y + (m<10?'0':'') + m + (d<10?'0':'') + d;
}

//2.1.7 根据年月，获取当月首末天日期
function getFirstDay(y,m){
	return y + (m<10?'0':'') + m + '01';
}
function getLastDay(y,m){
	var daysEachMon1 = [31,28,31,30,31,30,31,31,30,31,30,31];
	daysEachMon1[1] = (0==y%4 && (y%100!=0 || y%400==0)) ? 29 : 28; 
	return y + (m<10?'0':'') + m + daysEachMon1[(parseInt(m)-1)];
}





/*
 * 2.2 格式化日期格式为8位20140823
*/
function formatDate(dateOne){
	if(dateOne.indexOf('-')>-1){
		return dateOne.replace(/-/g,'');
	}
	if(dateOne.indexOf('/')>-1){
		return dateOne.replace(/\//g,'');
	}
	return dateOne;
}


//2.3日期格式化 09/08/2014
function formatDate1(dateOne){
	var dates = dateOne.split('/');
	
	return dates[2]+''+dates[0]+''+dates[1];
}

//2.5时间格式化
//08:94---》089400
function formatTime(timeOne){
	var times = timeOne.split(':');
	var timeShow = '';
	for(var k in times){
		timeShow += times[k].toString();
	}
	if(timeShow.length == 4){
		timeShow += '00';
	}
	return timeShow;
}

//2.6日期时间选择空间 转换json  09/03/2014 10:00 PM
function datetime2json(datetime){
	var datetimes = datetime.split(' ');
	var date = formatDate1(datetimes[0]);
	var timeType = datetimes[2];
	var time4 = datetimes[1].replace(':','');
	if(timeType == 'PM'){
		time4 = (parseInt(time4)+1200).toString();
	}
	var thisJson = {
		"date":date,
		"time4":add0(time4,4)
	};
	return thisJson;
} 

//2.7 字符串前补0
//@len:位数 @str
function add0(str,len){
	var len_str = str.length;
	if(len_str >= len){
		return str;
	}
	for(var i=len_str;i<len;i++){
		str = '0'+str;
	}
	return str;
}

//2.8员工号显示时去前面的0，提交是补全8位(add0)
function pernrShow(pernr){
	return pernr.replace(/(^0*)/g,"");
}


//2.9CE接口需要序列号，这里采用时间作为序列号
function getDateNumber(){
	var date = new Date();
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	var dateNumber = ''+y.toString()+(m<10?'0':'')+m+(d<10?'0':'')+d+(h<10?'0':'')+h+(mi<10?'0':'')+mi+(s<10?'0':'')+s;
	return '123456789'+dateNumber;
}


//2.10去除左右空格
function trim(str){ //删除左右两端的空格
　　     return str.replace(/(^\s*)|(\s*$)/g, "");
　　 }
function ltrim(str){ //删除左边的空格
　　     return str.replace(/(^\s*)/g,"");
　　 }
function rtrim(str){ //删除右边的空格
　　     return str.replace(/(\s*$)/g,"");
　　 }


//2.11时间省去秒
function cutSecond(str){
	var str1 = str;
	if(str.length>5){
		str1 = str.substr(0,5);
	}
	return str1;
}

//2.12  4位小时+秒转化成6位时间
function hm2hms6(str){
	
	var time6 = "";
	var times = str.split(":");
	time6 = (times[0]<10?'0':'')+parseInt(times[0])+times[1]+'00';
	return time6;
}

//2.13 加班时间不足0.5的取0.不足1的取0.5
function formatJBTime(str){
	if(parseFloat(str) - parseFloat(parseInt(str)) >= 0.5){
		return (parseFloat(parseInt(str))+0.5).toFixed(1);
	}
	return parseFloat(parseInt(str)).toFixed(1);
}


//2.14日期去除时间
function cutTime(str){
	var str1 = str;
	if(str.length>10){
		str1 = str.substr(0,10);
	}
	return str1;
}

/*
3.个人考勤信息
3.1根据审批状态代码返回状态
*/
function checkApprovalStatus(sCode){
	if(sCode == '8'){
		return '已审批（未同意）';
	}
	if(sCode == '9'){
		return '已审批（同意）';
	}
	return '审批中';
}



/*
 * 3.2如果字段为空，接口返回{}，此时改为空字符串
*/
// function checkNoChar(returnObj){
// 	return (typeof returnObj) == 'object'?'':returnObj;
// }
function checkNoChar(returnObj){
	return ((typeof returnObj) == 'object' || (typeof returnObj) == 'undefined')?'':returnObj;
}
function checkNoChar1(returnObj){
    return ((typeof returnObj) == 'object' || (typeof returnObj) == 'undefined')?'':returnObj;
}


//3.3如果事由字数多于20个字则省略
function cutReason(str){
	//var sStr = '';
	if(str.length>20){
		return str.substr(0,20)+'...';
	}
	return str;
}

//3.4考勤异常配置表-P10上班  P20下班
function errorCon1(str){
	var str1 = '';
	if(str == 'P10'){
		str1 = '上班';
	}else if(str == 'P20'){
		str1 = '下班';
	}else{
		
	}
	return str1;
}

//3.5加班类型配置表-平日/休息日/节假日/NULL
function otTypeCon1(str){
	var str1 = '';
	if(str == '0'){
		str1 = '平日';
	}else if(str == '1'){
		str1 = '休息日';
	}else if(str == '2'){
		str1 = '节假日';
	}else{
		
	}
	return str1;
}

//3.6加班支付类型配置表-1、支付加班费  2、用于调休
function payTypeCon1(str){
	var str1 = '';
	if(str == '1'){
		str1 = '支付加班费';
	}else if(str == '2'){
		str1 = '用于调休';
	}else{
		
	}
	return str1;
}


//4有的item下面是对象，不是数组，此时构建数组{}转成【{}】
function obj2arr(soapItem){
	var returnItem = [];
	if(undefined!=soapItem){
		if(undefined == soapItem.length){
			returnItem.push(soapItem);
		}else{
			returnItem = soapItem;
		}
	}
	return returnItem;
}



