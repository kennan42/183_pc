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
    var html = year + '年' + month + '月' + day + '日&nbsp;&nbsp;' + hour + ':' + minute + '';
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
//2.1.4获取当天的日期
function getToday8(){
    var dateT = new Date();
    var y = dateT.getFullYear();
    var m = dateT.getMonth()+1;
    var d = dateT.getDate();
    m = (m<10?'0':'') + m;
    d = (d<10?'0':'') + d;
    var time = ''+y+'-'+m+'-'+d+'';
    return time;
}

//查询90天和30天内的数据
function getbeg90(){
    var dateT = new Date();
    var dateE = new Date(dateT.getTime() - 90*24*60*60*1000);
    var y = dateE.getFullYear();
    var m = dateE.getMonth()+1;
    var d = dateE.getDate();
    m = (m<10?'0':'') + m;
    d = (d<10?'0':'') + d;
    var time = ''+y+'-'+m+'-'+d+'';
    return time;
}
function getbeg30(){
    var dateT = new Date();
    var dateE = new Date(dateT.getTime() - 30*24*60*60*1000);
    var y = dateE.getFullYear();
    var m = dateE.getMonth()+1;
    var d = dateE.getDate();
    m = (m<10?'0':'') + m;
    d = (d<10?'0':'') + d;
    var time = ''+y+'-'+m+'-'+d+'';
    return time;
}
//查询待审批列表
function WaitHandleList_Request(userId,bussType,beginDate,endDate,startPage,pageSize){
	var rtnJSON = {};
    //拼接提交参数
    var paramJSon = {
        input: {
            "channelSerialNo": getDateNumber(), 
            "currUsrId": userId, 
            "domain": '400', 
            "extendMap": {
                "entry": {
                    "Key": '', 
                    "Value": ''
                }
            }, 
            "userId": '', 
            "bussType": bussType, 
            "beginDate": beginDate, 
            "endDate": endDate, 
            "startPage": startPage, 
            "pageSize": pageSize
        }
    }
    $.post("/docPlatform/PORTALBPMIAIWaitTaskListImplBean",JSON.stringify(paramJSon),function(ReturnData){
        rtnJSON = ReturnData;
    });
    return rtnJSON;
}
//查询已审批列表
function AlreadyHandleList_Request(userId,bussType,beginDate,endDate,startPage,pageSize){
    var rtnJSON = {};
    //拼接提交参数
    var paramJSon = {
        input: {
            "channelSerialNo": getDateNumber(), 
            "currUsrId": userId, 
            "domain": '400', 
            "extendMap": {
                "entry": {
                    "Key": '', 
                    "Value": ''
                }
            }, 
            "userId": '', 
            "bussType": bussType, 
            "beginDate": beginDate, 
            "endDate": endDate, 
            "startPage": startPage, 
            "pageSize": pageSize
        }
    }
    $.post("/docPlatform/PORTALBPMIAICompTaskListImplBean",JSON.stringify(paramJSon),function(ReturnData){
        rtnJSON = ReturnData;
    });
    return rtnJSON;
}
//查询处理意见
function WaitHandleOpinion_Request(bussNo,eachNum){
    var rtnJSON = {};
    //拼接提交参数
    var paramJSon = {
        "bussFlowCid": bussNo,
        "userWorkCode": eachNum
    }
    $.post("/its/flow/queryHandleIdea",JSON.stringify(paramJSon),function(ReturnData){
        rtnJSON = ReturnData;
    });
    return rtnJSON;
}
//查询待审批详情
function WaitHandleDetailed_Request(quesCid,eachNum){
    var rtnJSON = {};
    //拼接提交参数
    var paramJSon = {
        "quesCid": quesCid, 
        "userWorkCode": eachNum
    }
    $.post("/its/mainques/queryQuesDetail",JSON.stringify(paramJSon),function(ReturnData){
        rtnJSON = ReturnData;
    });
    return rtnJSON;
}
//查询内部员工基本信息
function getPerInfo(eachNum){
    var rtnJSON = {};
    //拼接提交参数
    var paramJSon = {
        "DYFLG": "",
        "IS_PUBLIC": {
            "FLOWNO": "",
            "PERNR": "",
            "ZDOMAIN": "400",
            "I_PAGENO": "",
            "I_PAGESIZE": ""
        },
        "KEYDATE": "",
        "P_ORGEH": {
            "item": {
                "ORGEH": ""
            }
        }, 
        "P_PERNR": {
            "item": {
                "PERNR": eachNum
            }
        }
    }
    $.post("/its/getUserDetail",JSON.stringify(paramJSon),function(ReturnData){
        rtnJSON = ReturnData;
    });
    return rtnJSON;
}
//查询审批路径
function getPath(eachNum,bussNo,bussType){
    var rtnJSON = {};
    if( bussType == 1 ){
        bussType = 'ITS01';
    }else if( bussType == 2 ){
        bussType = 'ITS02';
    }
    if(eachNum){
        //拼接提交参数
        var paramJSon = {
            "input":{
                "channelSerialNo": getDateNumber(),
                "currUsrId": eachNum,
                "domain":"400",
                "extendMap":{
                     "entry":[{
                        "Key":"",
                        "Value":""
                     }]
                },
                "bussType": bussType,
                "bussNo": bussNo
            }
        };
        // 01 流程发起人
        // 02 业务审批人
        // 03 技术支持
        // 04 IT合规人
        // 05 执行人
        // 06 二线工程师
        $.post("/portal/PORTAL_BPMI_ProcPathQry",JSON.stringify(paramJSon),function(ReturnData){
            rtnJSON = ReturnData;
        });
    }else{
        rtnJSON.status = "-1";
    }
    return rtnJSON;
}
//查询下一步审批人
function getNextPer(eachNum,bussNo,bussType){
    var rtnJSON = {};
    if( bussType == 1 ){
        bussType = 'ITS01';
    }else{
        bussType = 'ITS02';
    }
    //拼接提交参数
    var paramJSon = {
        input: {
            "channelSerialNo": getDateNumber(), 
            "currUsrId": eachNum, 
            "domain": '400', 
            "extendMap": {
                "entry": {
                    "Key": '', 
                    "Value": ''
                }
            }, 
            "bussType": bussType,
            "bussNo": bussNo
        }
    }
    $.post("/portal/PORTAL_BPMI_BPMNtUsrQryWithNo",JSON.stringify(paramJSon),function(ReturnData){
        rtnJSON = ReturnData;
    });
    return rtnJSON;
}
//IT服务审批
function IT_Audit(bussNo,bussType,taskId,appType,currStep,eachNum){
    var rtnJSON = {};
    //拼接提交参数
    var paramJSon = {
        "input": {
            "channelSerialNo": getDateNumber(), 
            "currUsrId": eachNum, 
            "domain": '400', 
            "extendMap": {
                "entry": {
                    "Key": '', 
                    "Value": ''
                }
            },
            "bussType": bussType,
            "bussNo": bussNo,
            "pubAppr": {
                "taskId": taskId,
                "appType": appType,
                "appOpinion": "123",
                "usrId": eachNum,
                "usrName": "",
                "currStep": currStep
            }
        }
    }
    $.post("/portal/PORTAL_BPMI_AprJoint",JSON.stringify(paramJSon),function(ReturnData){
        rtnJSON = ReturnData;
        //console.log(ReturnData);
    });
    return rtnJSON;
}
//IT服务批量审批
function IT_Audit_All(bussType,bussNoArr){
    var rtnJSON = {};
    //拼接提交参数
    var paramJSon={
        "input": {
            "channelSerialNo": getDateNumber(), 
                "currUsrId": eachNum, 
                "domain": '400', 
                "extendMap": {
                    "entry": {
                        "Key": '', 
                        "Value": ''
                    }
            },
            "bussType": bussType,
            "infoList": bussNoArr
        }
    };
    $.post("/docPlatform/PORTALBPMIBatchAprImplBean",JSON.stringify(paramJSon),function(ReturnData){
        rtnJSON = ReturnData;
        //console.log(ReturnData);
    });
    return rtnJSON;
}
