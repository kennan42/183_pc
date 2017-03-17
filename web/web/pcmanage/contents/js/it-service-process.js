var it_service_processes= {
    //currentUrl: 'http://aiqas.cttq.com:808'
    currentUrl: 'http://aidev.cttq.com:808'
};


var it_service_process={
    Process:it_service_processes.currentUrl+'/portal/PORTAL_BPMI_SubJoint',//流程提交
    ViewProcess:it_service_processes.currentUrl+'/portal/PORTAL_BPMI_BPMNtUsrQryWithNo',//查看下一步审批人
    AdviceProcess:it_service_processes.currentUrl+'/portal/PORTAL_BPMI_ProcPathQry'  //流程处理意见
};


//转流程(new)
var busdataNew={
    "input": {
        "channelSerialNo": "",
        "currUsrId": "",
        "domain": "400",
        //"extendMap": {
        //    "entry": {
        //        "Key": "",
        //        "Value": ""
        //    }
        //},
        "pubStartPro": {
            "reqUsr": "",
            "reqUsrNm": ""
        },
        "bussType": "",
        "bussNo": "",
        "RouteList": [
            {
                "srnr": "",
                "apprUsrId": "",
                "apprUsrNm": "",
                "plans": "",
                "plsTx": "",
                "SPCJ": "",
                "SPCJT": "",
                "orgEh": "",
                "orgTx": "",
                "roleType": ""
            }
        ]
    }
};

//初始化
function initbusdataNew(){
    busdataNew={
       "input": {
           "channelSerialNo": "",
           "currUsrId": "",
           "domain": "400",
           //"extendMap": {
           //    "entry": {
           //        "Key": "",
           //        "Value": ""
           //    }
           //},
           "pubStartPro": {
               "reqUsr": "",
               "reqUsrNm": ""
           },
           "bussType": "",
           "bussNo": "",
           "RouteList": [
               {
                   "srnr": "",
                   "apprUsrId": "",
                   "apprUsrNm": "",
                   "plans": "",
                   "plsTx": "",
                   "SPCJ": "",
                   "SPCJT": "",
                   "orgEh": "",
                   "orgTx": "",
                   "roleType": ""
               }
           ]
       }
   };
}


//查看流程审批路径(new)
var viewBusDataNew={
    "input": {
        "channelSerialNo": "",
        "currUsrId": "",
        "domain": "400",
        "extendMap": {
            "entry": {
                "Key": "",
                "Value": ""
            }
        },
        "bussType": "",
        "bussNo": ""
    },
    "__prefix": "por"
};

//查看下一步骤审批人(new)
var viewNextBusDataNew={
    "input": {
        "channelSerialNo": "",
        "currUsrId": "",
        "domain": "400",
        "extendMap": {
            "entry": {
                "Key": "",
                "Value": ""
            }
        },
        "bussType": "",
        "bussNo": ""
    }
};

function initNextBusDataNew(){
    viewNextBusDataNew={
        "input": {
            "channelSerialNo": "",
            "currUsrId": "",
            "domain": "400",
            "extendMap": {
                "entry": {
                    "Key": "",
                    "Value": ""
                }
            },
            "bussType": "",
            "bussNo": ""
        }
    }
}


//流程回调接口(不用)
var flowCallbackData=  {
    "flowCid":"",
    "bussFlowState":1,
    "outFlowId":""
};






//转流程
var busData={
    "Envelope": {
        "Header": {
            "__prefix": "soapenv"
        },
        "Body": {
            "PORTALBPMISubJoint": {
                "input": {
                    "channelSerialNo": "",
                    "currUsrId": "8102597",
                    "domain": "300",
                    "extendMap": {
                        "entry": {
                            "Key": "",
                            "Value": ""
                        }
                    },
                    "pubStartPro": {
                        "reqUsr": "8102597",
                        "reqUsrNm": "晋爱勤"
                    },
                    "bussType": "",
                    "bussNo": "",
                    "RouteList": [{
                        "srnr": "",
                        "apprUsrId": "",
                        "apprUsrNm": "",
                        "plans": "",
                        "plsTx": "",
                        "SPCJ": "",
                        "SPCJT": "",
                        "orgEh": "",
                        "orgTx": "",
                        "roleType": ""
                    }]
                },
                "__prefix": "por"
            },
            "__prefix": "soapenv"
        },
        "_xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
        "_xmlns:por": "http://www.thitech.com/PORTAL_BPMI_SubJoint/",
        "__prefix": "soapenv"
    }
};

//问题回复
var replyData={
    "quesCid":"",
    "answerCid":"",
    "replyContent":"",
    "imageInfos":[
        {
            "imageSeqVal":"",
            "imagePath":""
        }
    ],
    "userWorkCode":"",
    "userName":""
};


//评价
 var postdata = {
            "quesEvaluateType" : 0,  //评价结果类型
            "serviceAttitudeType" : 0,  //评分-服务态度
            "responseSpeedType" : 0,  //评分-响应速度
            "solveMethodType" : 0,    //评分-解决方案
            "userWorkCode" : "",  //评价人员工号
            "userName":"",  //评价人员姓名
            "quesEvaluateContent" : "",  //评价内容
			"evaluateScore":"",// 积分管理评分
            "mainQuesCid" : "" // 问题cid
        };




//初始化
function initReplyData(){
    replyData={
        "quesCid":"",
        "answerCid":"",
        "replyContent":"",
        "imageInfos":[
            {
                "imageSeqVal":"",
                "imagePath":""
            }
        ],
        "userWorkCode":"",
        "userName":""
    }
}


//业务审批
var businessData={
    "flowType":1,
    "quesTypeCids": [
        ""
    ],
    "belongSystypeCids": [
        ""
    ],
    "handleIdea":"",
    "userWorkCode":"",
    "userName":"",
    "quesCid":""
};

function  initBusinessData(){
    businessData={
        "flowType":1,
        "quesTypeCids": [
            ""
        ],
        "belongSystypeCids": [
            ""
        ],
        "handleIdea":"",
        "userWorkCode":"",
        "userName":"",
        "quesCid":""
    }
}


//查看转流程
var viewProcessData={
    "Envelope": {
        "Header": {
            "__prefix": "soapenv"
        },
        "Body": {
            "PORTALBPMI_BPMNtUsrQryWithNo": {
                "input": {
                    "channelSerialNo": "",
                    "currUsrId": "",
                    "domain": "600",
                    "extendMap": {
                        "entry": {
                            "Key": "",
                            "Value": ""
                        }
                    },
                    "bussType": "",
                    "bussNo": ""
                },
                "__prefix": "por"
            },
            "__prefix": "soapenv"
        },
        "_xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
        "_xmlns:por": "http://www.cttq.com/PORTAL_BPMI_BPMNtUsrQryWithNo/",
        "__prefix": "soapenv"
    }
};

//查看流程处理意见
var adviceProcessData={
    "Envelope": {
        "Header": {
            "__prefix": "soapenv"
        },
        "Body": {
            "PORTALBPMIProcPathQry": {
                "input": {
                    "channelSerialNo": "",
                    "currUsrId": "",
                    "domain": "600",
                    "extendMap": {
                        "entry": {
                            "Key": "",
                            "Value": ""
                        }
                    },
                    "bussType": "",
                    "bussNo": ""
                },
                "__prefix": "por"
            },
            "__prefix": "soapenv"
        },
        "_xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
        "_xmlns:por": "http://www.thitech.com/PORTAL_BPMI_ProcPathQry/",
        "__prefix": "soapenv"
    }
}

//查看下一步骤审批人
var viewNextProcessData={
    "Envelope": {
        "Header": {
            "__prefix": "soapenv"
        },
        "Body": {
            "PORTALBPMI_BPMNtUsrQryWithNo": {
                "input": {
                    "channelSerialNo": "",
                    "currUsrId": "",
                    "domain": "600",
                    "extendMap": {
                        "entry": {
                            "Key": "",
                            "Value": ""
                        }
                    },
                    "bussType": "",
                    "bussNo": ""
                },
                "__prefix": "por"
            },
            "__prefix": "soapenv"
        },
        "_xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
        "_xmlns:por": "http://www.cttq.com/PORTAL_BPMI_BPMNtUsrQryWithNo/",
        "__prefix": "soapenv"
    }
};


//工单模块
//新建工单
var newWork=  {
    "innerOuter": 1,
    "workCode": "",
    "userName": "",
    "cellPhone": "",
    "email": "",
    "company": "",
    "department": "",
    "jobTitle": "",
    "quesTypeCids": [
        ""
    ],
    "belongSystypeCids": [
        ""
    ],
    "updateToQuesBar": 1,
    "planRebackTime": "",
    "quesContent": "",
    "createrWorkCode": "",
    "createrName": ""
};

function initWorkData(){
    newWork = {
        "innerOuter": 1,
        "workCode": "",
        "userName": "",
        "cellPhone": "",
        "email": "",
        "company": "",
        "department": "",
        "jobTitle": "",
        "quesTypeCids": [
            ""
        ],
        "belongSystypeCids": [
            ""
        ],
        "updateToQuesBar": 1,
        "planRebackTime": "",
        "quesContent": "",
        "createrWorkCode": "",
        "createrName": ""
    }
}

//我的工单，全部工单
var workSearch={
    "titleType": "4",
    "quesCode": "",
    "quesContent": "",
    "quesRaiserWorkCode": "",
    "quesRaiserName": "",
    "quesRaiserBeginTime": "",
    "quesRaiserEndTime": "",
    "quesAccepterWorkCode": "",
    "quesAccepterName": "",
    "quesAcceptBeginTime": "",
    "quesAcceptEndTime": "",
    "quesStateIt":"",
    "sysTypeCid": "",
    "belongSysTypeCid": "",
    "turnApproveBusi": "",
    "turnSubMaster": "",
    "pageNum": "1",
    "pageSize": "100000"
};

//待受理。。。工单列表
var workListData={
    "titleType": "1",
    "quesCode": "",
    "quesContent": "",
    "quesRaiserWorkCode": "",
    "quesRaiserName": "",
    "quesRaiserBeginTime": "",
    "quesRaiserEndTime": "",
    "quesAccepterWorkCode": "",
    "quesAccepterName": "",
    "quesAcceptBeginTime": "",
    "quesAcceptEndTime": "",
    "quesTypeCid": "",
    "belongSysTypeCid": "",
    "turnApproveBusi": "",
    "turnSubMaster": "",
    "exceQuesType":"",
    "timeoutLong":"",
    "pageNum": "1",
    "pageSize": "10"
};


//消息推送
var pushMsgData={
    "userId":"",
    "userList":[""],
    "title":"",
    "content":"",
    "type":"0",
    "isUpdate":"0",
    "msgType":"ITS",
    "extras":{
        "key":"value"
    }
};
