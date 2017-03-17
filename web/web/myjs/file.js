//1.获取详情
function getDetail(docId,bussType){
    var rtnJSON = {};
    var url = "/docPlatform/";
    if(bussType == "FMS_SAVE"){
        url += "getFilingInfo";
    }else if(bussType == "FMS_READ"){
        url += "getBorrowInfo";
    }else if(bussType == "FMS_DEST"){
        url += "getJudgeInfo";
    }
        //拼接提交参数
        var filingParam = {
            "arg0":docId
        };
        $.post(url,JSON.stringify(filingParam),function(data){
            var data = typeof data == 'object'?data:JSON.parse(data);
            if (data.status == '-1') {
                rtnJSON.status = "-1";
                rtnJSON = data;
            }else if(data.status == '-2'){
                layer.alert('请勿擅自修改请求信息，您的本次操作已被记录',8,function(){
                    window.close();
                });
                return;
            }else {
                rtnJSON = data;
                rtnJSON.status = "0";
            }
        });
    
    return rtnJSON;
}
//获取审批路径
function getSPList(pernr,bussType,bussNo){
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
//审批
//
function doFileSub(pernr,bussType,bussNo,taskId,currStep,tyType,opinion){
    var rtnJSON = {};
    if(pernr){
        //拼接提交参数
        var paramJSon = {
            "input":{
                    "channelSerialNo":getDateNumber(),
                    "currUsrId":pernr,
                    "domain":"400",
                    "bussType":bussType,
                    "bussNo":bussNo,
                    "taskId":taskId,
                    "aprUsrId":pernr,
                    "appType":tyType == 1?"AG":"RF",
                    "appOpinion":opinion,
                    "stepNo":currStep,
                    "adUsrList":{},
                    "extendMap":[
                        {"Key":"",
                        "Value":""}
                    ]
                }
        };
        $.post("/docPlatform/PORTALBPMIAprWithNtUsrImplBean",JSON.stringify(paramJSon),function(resData){
            var resData = typeof resData == 'object'?resData:JSON.parse(resData);
            if (resData.status == '-1') {
                rtnJSON.status = "-1";
            }
            else {
                if(resData.output.type != 'S'){
                    rtnJSON.status = "-1";
                }else if(resData.output.type == 'E'){
                    rtnJSON.status = "-1";
                    rtnJSON.errMsg = checkNoChar(resData.output.message);
                }else{
                    rtnJSON = resData;
                    rtnJSON.status = "0";
                }
            }
        });
    }else{
        rtnJSON.status = "-1";
    }
    return rtnJSON;
}

//W_1 获取File获取代办列表
function Filesubmit_W_1(pernr,bussType,startPage,pageSize){
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
        //console.log(paramJSon);
        $.post("/docPlatform/WaitTaskListInfo",JSON.stringify(paramJSon),function(gystodoListsData){
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

//W_1 获取File获取已办列表
function Filesubmit_A_1(pernr,bussType,startPage,pageSize,begD,endD){
    var rtnJSON = {};
    if(pernr){
        //拼接提交参数
        var begd = "";
        var endd = "";
        if(begD){
            begd = begD;
            endd = endD;
        }
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
                "beginDate":begd,
                "endDate":endd,
                "startPage":parseInt(startPage),
                "pageSize":pageSize
            }
        };
        //console.log(paramJSon);
        $.post("/docPlatform/CompleteTaskListInfo",JSON.stringify(paramJSon),function(gystodoListsData){
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

//获取条数
function getWtNum(pernr){
    var rtnJSON = {};
    if(pernr){
        //拼接提交参数
        var paramJSon = {
            "input":{
                "channelSerialNo":getDateNumber(),
                "currUsrId":parseInt(pernr).toString(),
                "domain":"410",
                "reqUsrId":parseInt(pernr).toString()
            }
        };
        //console.log(paramJSon);
        $.post("/docPlatform/PORTALBPMIWaitTaskNumImplBean",JSON.stringify(paramJSon),function(numRes){
           
            var numRes = typeof numRes == 'object'?numRes:JSON.parse(numRes);
            if (numRes.status == '-1') {
                rtnJSON.status = "-1";
                rtnJSON = numRes;
            }else if(numRes.status == '-2'){
                layer.alert('请勿擅自修改请求信息，您的本次操作已被记录',8,function(){
                    window.close();
                });
                return;
            }else {
                if(numRes.output.type != 'S'){
                    rtnJSON.status = "-1";
                    rtnJSON = numRes;
                }else{
                    rtnJSON = numRes;
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

function checkNoChar1(returnObj){
    return ((typeof returnObj) == 'object' || (typeof returnObj) == 'undefined')?'':returnObj;
}