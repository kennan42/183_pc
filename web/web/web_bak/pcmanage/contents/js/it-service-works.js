//URL匹配参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}


//获取工单状态text
function getEnums(param){
    var state="";
    switch(param)
    {
        case quesState.WaitSolve:
            state="待受理";
            return state;
        case quesState.handling:
            state="处理中";
            return state;
        case quesState.Solved:
            state="已解决";
            return state;
        case quesState.Confirmed:
            state="用户已确认";
            return state;
        case quesState.Marked:
            state="已评价";
            return state;
        case quesState.Cancel:
            state="已取消";
            return state;
    }
}

//时间戳
function getLocalTime(nS) {
    return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}

function getLocalTimes(nS) {
    return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');
}

//生成随机字符串
function randomWord(min){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}


//随机时间戳
function getNo(no) {
    var todayDate = new Date();
    var ran = Math.round((Math.random()) * 1000000);
    return todayDate.format("yyyyMMddhhmmssS") + ran + no;
}
Date.prototype.format = function(format) {
    var o = {
        "M+" : this.getMonth() + 1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};


//星级评价
function starMark(count,container){
    for(var i=0;i<count;i++) {
        $(container).append('<img src="../contents/img/c-7.png">');
    }
    for(var i=0;i<5 - count;i++) {
        $(container).append('<img src="../contents/img/c-6.png">');
    }
};

//评价类型
function setEvaluations(result)
{
    $("#evaluateDatetime").html(getLocalTime(result.resultJson.evaluateDatetime));
    $("#quesEvaluateContent").html(result.resultJson.quesEvaluateContent);
    $("#serviceAttitudeType").empty();
    $("#respondSpeedType").empty();
    $("#solveMethodType").empty();
    starMark(result.resultJson.serviceAttitudeType,"#serviceAttitudeType");
    starMark(result.resultJson.respondSpeedType,"#respondSpeedType");
    starMark(result.resultJson.solveMethodType,"#solveMethodType");
}


//回复记录
function replyAppends(result)
{
    $("#replyAppend").empty();
    for(var i in result.resultJson.answerObj) {
        var append=' <div class="row b-3"><div class="col-xs-12"><div class="row"> <img class="b-1" src="../contents/img/a-10.png">';
        append+=''+"IT技术支持"+'&nbsp&nbsp<span class="a-5">'+getLocalTime(result.resultJson.answerObj[i].replyDatetime)+'</span></div>';
        append+='<div class="row b-4">'+result.resultJson.answerObj[i].replyContent+'</div></div></div>';
        $("#replyAppend").append(append);
    }
    for(var i in result.resultJson.answerObj[0].answerReplyInfos) {
        if(result.resultJson.answerObj[0].answerReplyInfos[i].flowType==1) {

            if(result.resultJson.answerObj[0].answerReplyInfos[i].bussFlowState==1){
                //查看下一步骤审批人
                viewNextBusDataNew.input.channelSerialNo=randomWord(32);
                viewNextBusDataNew.input.bussNo=result.resultJson.answerObj[0].answerReplyInfos[i].flowCid;
                viewNextBusDataNew.input.bussType="ITS01";
                viewNextBusDataNew.input.currUsrId=currentUser.userWorkCode;
                var data = JSON.stringify(viewNextBusDataNew);

                $.ajax({
                    type: "POST",
                    url: it_service_process.ViewProcess,
                    data: data,
                    async:false,
                    contentType: "application/json; charset=utf-8",
                    success:function(result1){
                        var nextName="",roleType="";
                        if(result1.output.routeList instanceof Array){

                            for(var j in result1.output.routeList){
                                nextName+=result1.output.routeList[j].apprUsrNm+" ";
                            }
                            roleType=result1.output.routeList[0].roleType;
                        }
                        else{
                            nextName=result1.output.routeList.apprUsrNm;
                            roleType=result1.output.routeList.roleType;
                        }

                        var processStateValue="处理";
                        if(roleType=="02" || roleType=="04") {
                            processStateValue="审批";
                        }
                        var append="";
                        append+='<div class="row b-3">';
                        append+='<div class="col-xs-12">';
                        append+='<div class="row">';
                        append+='<img src="../contents/img/a-10.png" class="b-1">IT技术支持&nbsp&nbsp';
                        append+='<span>'+getLocalTime(result.resultJson.answerObj[0].answerReplyInfos[i].replyDatetime)+'</span>';
                        append+='</div>';
                        append+='<div class="row b-4">'+result.resultJson.answerObj[0].answerReplyInfos[i].replyContent+'</div>';
                        append+='<div class="row b-5">';
                        append+='<div class="bk bkApprove" data-id="'+result.resultJson.answerObj[0].answerReplyInfos[i].flowCid+'" ' + ' data-replycontent="'+result.resultJson.answerObj[0].answerReplyInfos[i].quickReplyContent+'">';
                        append+='<div class="bk-bc-1"> <div class="bk-left"><img src="../contents/img/a-9.png" style="padding-top: 20px;"></div>';
                        append+='<div class="bk-right"><div style="padding-top: 17px;">待<span style="padding: 0 5px;">'+nextName+'</span>'+processStateValue+'</div>';
                        append+='<div style="padding-top: 5px;">转业务审批流程</div></div></div><div class="bk-bottom">业务审批流程<img src="../contents/img/a-11.png" style="float: right; margin-top:7px;">';
                        append+='</div></div></div></div></div>';


                        $("#replyAppend").append(append);
                    },error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
            }
            else if(result.resultJson.answerObj[0].answerReplyInfos[i].bussFlowState==2){
                var append="";
                append+='<div class="row b-3">';
                append+='<div class="col-xs-12">';
                append+='<div class="row">';
                append+='<img src="../contents/img/a-10.png" class="b-1">IT技术支持&nbsp&nbsp';
                append+='<span>'+getLocalTime(result.resultJson.answerObj[0].answerReplyInfos[i].replyDatetime)+'</span>';
                append+='</div>';
                append+='<div class="row b-4">'+result.resultJson.answerObj[0].answerReplyInfos[i].replyContent+'</div>';
                append+='<div class="row b-5">';
                append+='<div class="bk bkApprove" data-id="'+result.resultJson.answerObj[0].answerReplyInfos[i].flowCid+'" ' + ' data-replycontent="'+result.resultJson.answerObj[0].answerReplyInfos[i].quickReplyContent+'">';
                append+='<div class="bk-bc-1"> <div class="bk-left"><img src="../contents/img/a-9.png" style="padding-top: 20px;"></div>';
                append+='<div class="bk-right"><div style="padding-top: 17px;">流程已完成</div>';
                append+='<div style="padding-top: 5px;">转业务审批流程</div></div></div><div class="bk-bottom">业务审批流程<img src="../contents/img/a-11.png" style="float: right; margin-top:7px;">';
                append+='</div></div></div></div></div>';
                $("#replyAppend").append(append);
            }
            else if(result.resultJson.answerObj[0].answerReplyInfos[i].bussFlowState==3){
                var append="";
                append+='<div class="row b-3">';
                append+='<div class="col-xs-12">';
                append+='<div class="row">';
                append+='<img src="../contents/img/a-10.png" class="b-1">IT技术支持&nbsp&nbsp';
                append+='<span>'+getLocalTime(result.resultJson.answerObj[0].answerReplyInfos[i].replyDatetime)+'</span>';
                append+='</div>';
                append+='<div class="row b-4">'+result.resultJson.answerObj[0].answerReplyInfos[i].replyContent+'</div>';
                append+='<div class="row b-5">';
                append+='<div class="bk bkApprove" data-id="'+result.resultJson.answerObj[0].answerReplyInfos[i].flowCid+'" ' + ' data-replycontent="'+result.resultJson.answerObj[0].answerReplyInfos[i].quickReplyContent+'">';
                append+='<div class="bk-bc-1"> <div class="bk-left"><img src="../contents/img/a-9.png" style="padding-top: 20px;"></div>';
                append+='<div class="bk-right"><div style="padding-top: 17px;">流程被拒绝</div>';
                append+='<div style="padding-top: 5px;">转业务审批流程</div></div></div><div class="bk-bottom">业务审批流程<img src="../contents/img/a-11.png" style="float: right; margin-top:7px;">';
                append+='</div></div></div></div></div>';
                $("#replyAppend").append(append);
            }

        }
        else if(result.resultJson.answerObj[0].answerReplyInfos[i].flowType==2) {

            if(result.resultJson.answerObj[0].answerReplyInfos[i].bussFlowState==1){
                viewNextBusDataNew.input.channelSerialNo=randomWord(32);
                viewNextBusDataNew.input.bussNo=result.resultJson.answerObj[0].answerReplyInfos[i].flowCid;
                viewNextBusDataNew.input.bussType="ITS02";
                viewNextBusDataNew.input.currUsrId=currentUser.userWorkCode;
                var data = JSON.stringify(viewNextBusDataNew);
                $.ajax({
                    type: "POST",
                    url: it_service_process.ViewProcess,
                    data: data,
                    async:false,
                    contentType: "application/json; charset=utf-8",
                    success:function(result1){
                        var nextName="";
                        if(result1.output.routeList instanceof Array){
                            for(var j in result1.output.routeList){
                                nextName+=result1.output.routeList[j].apprUsrNm+" ";
                            }
                        }
                        else{
                            nextName=result1.output.routeList.apprUsrNm;
                        }

                        var append="";
                        append+='<div class="row b-3">';
                        append+='<div class="col-xs-12">';
                        append+='<div class="row">';
                        append+='<img src="../contents/img/a-10.png" class="b-1">IT技术支持&nbsp&nbsp';
                        if(result.resultJson.answerObj[0].answerReplyInfos[i].replyDatetime!=null){
                            append+='<span>'+getLocalTime(result.resultJson.answerObj[0].answerReplyInfos[i].replyDatetime)+'</span>';
                        }
                        append+='</div>';
                        append+='<div class="row b-4">'+result.resultJson.answerObj[0].answerReplyInfos[i].replyContent+'</div>';
                        append+='<div class="row b-5">';
                        append+='<div class="bk bkSec" data-id="'+result.resultJson.answerObj[0].answerReplyInfos[i].flowCid+'" ' + ' data-replycontent="'+result.resultJson.answerObj[0].answerReplyInfos[i].quickReplyContent+'">';
                        append+='<div class="bk-bc-2"> <div class="bk-left"><img src="../contents/img/a-9.png" style="padding-top: 20px;"></div>';
                        append+='<div class="bk-right"><div style="padding-top: 17px;">待<span style="padding: 0 5px;">'+nextName+'</span>处理 </div>';
                        append+='<div style="padding-top: 5px;">转二线工程师</div></div></div><div class="bk-bottom">二线工程师<img src="../contents/img/a-11.png" style="float: right; margin-top:7px;">';
                        append+='</div></div></div></div></div>';

                        $("#replyAppend").append(append);
                    }
                });
            }
            else if(result.resultJson.answerObj[0].answerReplyInfos[i].bussFlowState==2){
                var append="";
                append+='<div class="row b-3">';
                append+='<div class="col-xs-12">';
                append+='<div class="row">';
                append+='<img src="../contents/img/a-10.png" class="b-1">IT技术支持&nbsp&nbsp';
                if(result.resultJson.answerObj[0].answerReplyInfos[i].replyDatetime!=null){
                    append+='<span>'+getLocalTime(result.resultJson.answerObj[0].answerReplyInfos[i].replyDatetime)+'</span>';
                }
                append+='</div>';
                append+='<div class="row b-4">'+result.resultJson.answerObj[0].answerReplyInfos[i].replyContent+'</div>';
                append+='<div class="row b-5">';
                append+='<div class="bk bkSec" data-id="'+result.resultJson.answerObj[0].answerReplyInfos[i].flowCid+'" ' + ' data-replycontent="'+result.resultJson.answerObj[0].answerReplyInfos[i].quickReplyContent+'">';
                append+='<div class="bk-bc-2"> <div class="bk-left"><img src="../contents/img/a-9.png" style="padding-top: 20px;"></div>';
                append+='<div class="bk-right"><div style="padding-top: 17px;">流程已完成</div>';
                append+='<div style="padding-top: 5px;">转二线工程师</div></div></div><div class="bk-bottom">二线工程师<img src="../contents/img/a-11.png" style="float: right; margin-top:7px;">';
                append+='</div></div></div></div></div>';

                $("#replyAppend").append(append);
            }
            else if(result.resultJson.answerObj[0].answerReplyInfos[i].bussFlowState==3){
                var append="";
                append+='<div class="row b-3">';
                append+='<div class="col-xs-12">';
                append+='<div class="row">';
                append+='<img src="../contents/img/a-10.png" class="b-1">IT技术支持&nbsp&nbsp';
                if(result.resultJson.answerObj[0].answerReplyInfos[i].replyDatetime!=null){
                    append+='<span>'+getLocalTime(result.resultJson.answerObj[0].answerReplyInfos[i].replyDatetime)+'</span>';
                }
                append+='</div>';
                append+='<div class="row b-4">'+result.resultJson.answerObj[0].answerReplyInfos[i].replyContent+'</div>';
                append+='<div class="row b-5">';
                append+='<div class="bk bkSec" data-id="'+result.resultJson.answerObj[0].answerReplyInfos[i].flowCid+'" ' + ' data-replycontent="'+result.resultJson.answerObj[0].answerReplyInfos[i].quickReplyContent+'">';
                append+='<div class="bk-bc-2"> <div class="bk-left"><img src="../contents/img/a-9.png" style="padding-top: 20px;"></div>';
                append+='<div class="bk-right"><div style="padding-top: 17px;">流程被拒绝</div>';
                append+='<div style="padding-top: 5px;">转二线工程师</div></div></div><div class="bk-bottom">二线工程师<img src="../contents/img/a-11.png" style="float: right; margin-top:7px;">';
                append+='</div></div></div></div></div>';

                $("#replyAppend").append(append);
            }
        }
        else{
            var append="";
            append+='<div class="row b-3">';
            append+='<div class="col-xs-12">';
            append+='<div class="row"> ';
            if(result.resultJson.answerObj[0].answerReplyInfos[i].replyWorkCode==result.resultJson.raiserUserWorkCode) {
                append += '<img style="padding-right: 10px; margin-top: -6px;" src="../contents/img/a-6.png"><span style="color:#333">'+result.resultJson.answerObj[0].answerReplyInfos[i].replyUserName+'</span>';
            }
            else {
                append+='<img class="b-1" src="../contents/img/a-10.png">IT技术支持';
            }
            append+='&nbsp&nbsp<span class="a-5">'+getLocalTime(result.resultJson.answerObj[0].answerReplyInfos[i].replyDatetime)+'</span></div>';
            append+='<div class="row b-4">'+result.resultJson.answerObj[0].answerReplyInfos[i].replyContent+'</div>';

            if(result.resultJson.answerObj[0].answerReplyInfos[i].replyImagePath!=null)
            {
                append+='<div class="row b-4">';
                append+='<ul class="ace-thumbnails clearfix">';
                for(var j in result.resultJson.answerObj[0].answerReplyInfos[i].replyImagePath)
                {
                    append+='<li>';
                    append+='<a width="300" height="300" href="'+result.resultJson.answerObj[0].answerReplyInfos[i].replyImagePath[j]+'" data-rel="colorbox">';
                    appendStr+='<img width="60" height="60" alt="60x60" src="'+result.resultJson.answerObj[0].answerReplyInfos[i].replyImagePath[j]+'" >';
                    appendStr+='<div class="text">';
                    appendStr+='<div class="inner">点击查看大图</div>';
                    appendStr+='</div>';
                    appendStr+='</a>';
                    appendStr+='</li>';
                }
                append+='</ul>';
                append+='</div>';
            }
            append+='</div></div>';
            $("#replyAppend").append(append);
        }
    }
}

//加载附件
function LoadPic(result,container)
{
    $(container).empty();
    var append="";
    append+='<ul class="ace-thumbnails clearfix">';
    for(var i in result.resultJson.quesImagePath)
    {
        append+='<li>';
        append+='<a width="300" height="300" href="'+result.resultJson.quesImagePath[i]+'" data-rel="colorbox">';
        append+='<img width="60" height="60" alt="60x60" src="'+result.resultJson.quesImagePath[i]+'" />';
        append+='<div class="text">';
        append+='<div class="inner">点击查看大图</div>';
        append+='</div>';
        append+='</a>';
        append+='</li>';
    }
    append+="</ul>";
    $(container).append(append);
}

function LoadReplyPic(result,container)
{
    for(var i in  result.resultJson.answerObj[0].answerReplyInfos)
    {
        var append="";
        append+='<img width="100" height="100"  src="'+result.resultJson.answerObj[0].answerReplyInfos[i].replyImagePath+'" >';
        $(container).append(append);
    }
}

//问题分类，系统分类展示
function quesSysAppends(result)
{
    var quesStr="",belongStr="";
    $("#quesAppend").empty();
    $("#belongAppend").empty();
    $(".quesOptoion").empty();
    $(".sysOptoion").empty();
    for(var i in result.resultJson.quesTypeInfos) {
        quesStr+=result.resultJson.quesTypeInfos[i].quesTypeCid+",";
        $("#quesAppend").append('<span class="bg-img2">'+result.resultJson.quesTypeInfos[i].quesTypeName+'</span>');
        $(".quesOptoion").append('<span class="nav-divw2">'+result.resultJson.quesTypeInfos[i].quesTypeName+'</span>');
    }
    for(var i in result.resultJson.belongSystypeInfos) {
        belongStr+=result.resultJson.belongSystypeInfos[i].belongSystypeCid+",";
        $("#belongAppend").append('<span class="bg-img2">'+result.resultJson.belongSystypeInfos[i].belongSystypeName+'</span>');
        $(".sysOptoion").append('<span class="nav-divw2">'+result.resultJson.belongSystypeInfos[i].belongSystypeName+'</span>');
    }
    $("#quesLableCids").val(quesStr);
    $("#belongSystypeCids").val(belongStr);
}




//
function NoToChinese(num) {
    if (!/^\d*(\.\d*)?$/.test(num)) { alert("Number is wrong!"); return "Number is wrong!"; }
    var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
    var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
    var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = "";
    for (var i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
            case 0: re = BB[7] + re; break;
            case 4: if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                re = BB[4] + re; break;
            case 8: re = BB[5] + re; BB[7] = BB[5]; k = 0; break;
        }
        if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
        if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re; k++;
    }

    if (a.length > 1) //加上小数部分(如果有小数部分)
    {
        re += BB[6];
        for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
    }
    return re;
}
