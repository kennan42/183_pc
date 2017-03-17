/**
 * 将yyyy-mm-dd hh:mm:ss格式化成Unix时间戳，ms为单位
 * @param string yyyy-mm-dd hh:mm:ss格式的字符串
 * @returns {number}
 */
function changeTimeToUnix(string) {
    var f = string.split(' ', 2);
    var d = (f[0] ? f[0] : '').split('-', 3);
    var t = (f[1] ? f[1] : '').split(':', 3);
    return (new Date(
        parseInt(d[0], 10) || null,
        (parseInt(d[1], 10) || 1) - 1,
        parseInt(d[2], 10) || null,
        parseInt(t[0], 10) || null,
        parseInt(t[1], 10) || null,
        parseInt(t[2], 10) || null
    )).getTime();
}

/**
 * 将Unix时间戳格式化成 yyyy年mm月dd日<br>hh:mm
 * @param time Unix时间戳，单位ms
 * @returns {string} yyyy年mm月dd日<br>hh:mm
 */
function formatUnix(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = (date.getMonth() + 101 + '').substr(1);
    var day = (date.getDate() + 100 + '').substr(1);
    var hour = (date.getHours() + 100 + '').substr(1);
    var minute = (date.getMinutes() + 100 + '').substr(1);
    var seconds = (date.getSeconds() + 100 + '').substr(1);
    var html = year + '-' + month + '-' + day + '&nbsp;&nbsp;' + hour + ':' + minute + ':' + seconds;
    return html;
}
//打开页面
var CHAT = {
    //打开页面
    open:function(name,url){
        appcan.window.open(name,url);
    },
    /**
     * 关闭页面
     * @param {num} type 窗口类型（主窗口0，浮动窗口1）
     * @param {num} time 超时时间
     */
    close:function(type,time){
        if(type){//浮动窗口关闭主窗口
            if(time){
                setTimeout("appcan.window.evaluateScript('','appcan.window.close()')",time);
            }else{
                appcan.window.evaluateScript('','appcan.window.close()');
            }
        }else{
            if(time){
                setTimeout("appcan.window.close()",time);
            }else{
                appcan.window.close();
            }
        }
        
    },
    /**
     * 关闭页面
     * @param {arr} winNames 需要关闭的页面名称数组
     */
    closeWins:function(winNames){
        for(var i in winNames){
            appcan.window.evaluateScript(winNames[i],"appcan.window.close()")
        }
    },
    //对象转数组--针对ECC或者CE接口存在单条数据时不返回数组结构
    sureArray:function(item){
        var arr = [];
        if(item && (typeof item == "object")){
            if(undefined != item.length){//是数组
                arr = item;
            }else{
                arr.push(item);
            }
        }
        return arr;
    },
    //解决字段为空又返回对象的情况
    checkNoChar:function(str){
        var type = typeof str;
        var returnStr = '';
        if(type == "undefined" || type == "null" || type == "object"){
            
        }else if(str == "[object Object]"){
            
        }else{
            returnStr = str;
        }
        return returnStr;
    },
    //存取缓存
    setLS:function(lsName,lsVal){
        var lsVal = lsVal;
        if(typeof lsVal == "object"){
            lsVal = JSON.stringify(lsVal);
        }
        appcan.locStorage.val(lsName,lsVal);
    },
    getLS:function(lsName){
      return appcan.locStorage.val(lsName);  
    },
    //滑动到页面底部
    toDown:function(){
        window.scrollTo(0,document.body.scrollHeight);
    },
    //补全工号到8位
    addId8:function(userId){
        var uId = userId;
        for(var i=8;i>userId.length;i--){
            uId = "0"+uId;
        }
        return uId;
    },
    showTime:function(time){
        var d1 = new Date();
        var d2 = new Date(time);
        var y1 = d1.getFullYear();
        var y2 = d2.getFullYear();
    }
};
//根据员工对象获取显示级别  xxx部门 xxx职务
    /**
     * 根据员工对象获取显示职务
     * @param {num} type 窗口类型
     */
function showPost(per,sp){
    var str1 = "";
    var str2 = "";
    var spStr = '  ';
    if(sp){
      spStr = " - ";  
    }
    if(per){
        if(CHAT.checkNoChar(per.ZZ_GST) == ""){
            return CHAT.checkNoChar(per.ORGTX);
        }
        str1 = CHAT.checkNoChar(per.ZZ_GST);
        if(CHAT.checkNoChar(per.ZZ_JG1T) == ""){
            return str1;
        }else{
            str2 = CHAT.checkNoChar(per.ZZ_JG1T);
        }
        
        if(CHAT.checkNoChar(per.ZZ_JG2T) == ""){
            return str1 + spStr + str2;
        }else{
            str1 = str2;
            str2 = CHAT.checkNoChar(per.ZZ_JG2T);
        }
        
        if(CHAT.checkNoChar(per.ZZ_JG3T) == ""){
            return str1 + spStr + str2;
        }else{
            str1 = str2;
            str2 = CHAT.checkNoChar(per.ZZ_JG3T);
        }
        
        if(CHAT.checkNoChar(per.ZZ_JG4T) == ""){
            return str1 + spStr + str2;
        }else{
            str1 = str2;
            str2 = CHAT.checkNoChar(per.ZZ_JG4T);
        }
        
        if(CHAT.checkNoChar(per.ZZ_JG5T) == ""){
            return str1 + spStr + str2;
        }else{
            str1 = str2;
            str2 = CHAT.checkNoChar(per.ZZ_JG5T);
        }
        
    }
    
    return str1 + spStr + str2;
}
/**
 * 将yyyy-mm-dd hh:mm:ss格式化成Unix时间戳，ms为单位
 * @param string yyyy-mm-dd hh:mm:ss格式的字符串
 * @returns {number}
 */
function changeTimeToUnix(string) {
    var f = string.split(' ', 2);
    var d = (f[0] ? f[0] : '').split('-', 3);
    var t = (f[1] ? f[1] : '').split(':', 3);
    return (new Date(
        parseInt(d[0], 10) || null,
        (parseInt(d[1], 10) || 1) - 1,
        parseInt(d[2], 10) || null,
        parseInt(t[0], 10) || null,
        parseInt(t[1], 10) || null,
        parseInt(t[2], 10) || null
    )).getTime();
}

/**
 * 将Unix时间戳格式化成 yyyy年mm月dd日<br>hh:mm
 * @param time Unix时间戳，单位ms
 * @returns {string} yyyy年mm月dd日<br>hh:mm
 */
function formatUnix(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = (date.getMonth() + 101 + '').substr(1);
    var day = (date.getDate() + 100 + '').substr(1);
    var hour = (date.getHours() + 100 + '').substr(1);
    var minute = (date.getMinutes() + 100 + '').substr(1);
    var seconds = (date.getSeconds() + 100 + '').substr(1);
    var html = year + '-' + month + '-' + day + '&nbsp;&nbsp;' + hour + ':' + minute + ':' + seconds;
    return html;
}
//获取意见反馈-----待回复列表
function WaitHandleListData(status,pageNumber,pageSize){
	var rtnJSON = {};
    //拼接提交参数
    var paramJSon = {
        "status":status,
        "startTime":'',
        "endTime":'',
        "pageNumber":pageNumber,
        "pageSize":pageSize
    }
    $.post("/app/getOpinions",JSON.stringify(paramJSon),function(gystodoListsData){
        if ( gystodoListsData.status == '0' ) {
            rtnJSON.status = "0";
            rtnJSON = gystodoListsData;
        }else{
            rtnJSON.status = "-1";
            rtnJSON = gystodoListsData;
        }
    });
    return rtnJSON;
}
//获取意见反馈-----待回复列表
function AlreadyHandleListData(status,pageNumber,pageSize,startTime,endTime){
	var rtnJSON = {};
    //拼接提交参数
    var paramJSon = {
        "status":status,
        "startTime":startTime,
        "endTime":endTime,
        "pageNumber":pageNumber,
        "pageSize":pageSize
    }
    $.post("/app/getOpinions",JSON.stringify(paramJSon),function(gystodoListsData){
        if ( gystodoListsData.status == '0' ) {
            rtnJSON.status = "0";
            rtnJSON = gystodoListsData;
        }else{
            rtnJSON.status = "-1";
            rtnJSON = gystodoListsData;
        }
    });
    return rtnJSON;
}
//获取意见反馈-----回复列表-----条数
function WaitHandleListNum(status,startTime,endTime){
	var rtnJSON = {};
    //拼接提交参数
    var paramJSon = {
        "status":status,
        "startTime":startTime,
        "endTime":endTime,
    }
    $.post("/app/getOpinionCount",JSON.stringify(paramJSon),function(gystodoListsData){
        if ( gystodoListsData.status == '0' ) {
            rtnJSON.status = "0";
            rtnJSON = gystodoListsData;
        }else{
            rtnJSON.status = "-1";
            rtnJSON = gystodoListsData;
        }
    });
    return rtnJSON;
}
//获取意见反馈-----详情
function WaitHandleDetails(taskId,userId){
	var rtnJSON = {};
	//拼接提交参数
    var paramJSon = {
        "id":taskId,
        "userId":userId
    }
    $.post("/app/getOpinion",JSON.stringify(paramJSon),function(gystodoListsData){
        if ( gystodoListsData.status == '0' ) {
            rtnJSON.status = "0";
            rtnJSON = gystodoListsData;
        }else{
            rtnJSON.status = "-1";
            rtnJSON = gystodoListsData;
        }
    });
    return rtnJSON;
}

//获取意见反馈-----详情
function WaitHandleHuiFu(taskId,userId,content,ImagesItem){
    var rtnJSON = {};
    //拼接提交参数
    var paramJSon = {
        "id":taskId,
        "userId":userId,
        "reply":content,
        "replyImgs":ImagesItem,
    }
    $.post("/app/replyOpinion",JSON.stringify(paramJSon),function(gystodoListsData){
        if ( gystodoListsData.status == '0' ) {
            rtnJSON.status = "0";
            rtnJSON = gystodoListsData;
        }else{
            rtnJSON.status = "-1";
            rtnJSON = gystodoListsData;
        }
    });
    return rtnJSON;
}