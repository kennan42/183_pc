/**
 * Created by Admin on 2015/12/14.
 */
var it_service_users = {
    //currentUrl: 'http://aiqas.cttq.com:808',
    //userLoginNewUrl:'http://aiqas.cttq.com:808'

    currentUrl: 'http://aidev.cttq.com:808',
    userLoginNewUrl:'http://aidev.cttq.com:808'
};


var it_service_user={
    //DEV800-URL
    UserBase:it_service_users.currentUrl+'/zhrws/ZHRWS_DYNAMIC_PERSON',
    Search:it_service_users.currentUrl+'/zhrws/ZHRWS_FUZZY_SEARCH',
   // UserLogin:it_service_users.userLoginUrl+'/AdService/AdWebService.asmx',
    UserLoginNew:it_service_users.userLoginNewUrl+'/base/login2',
    //查询外部员工接口
    OuterUser:it_service_users.currentUrl+'/zhrtxws/ZLYGERPWS10'
};


//获取用户基本信息(workcode)
var userDataSearch={
    "I_PUBLIC": {
        "FLOWNO": "",
        "PERNR": "",
        "ZDOMAIN": "600",
        "I_PAGENO": "1",
        "I_PAGESIZE": "10"
    },
    "P_SEARCH": ""
};

//获取用户信息（模糊搜索）
var userDataBase={
    "DYFLG": "",
    "IS_PUBLIC": {
        "FLOWNO": "",
        "PERNR": "",
        "ZDOMAIN": "600",
        "I_PAGENO": "1",
        "I_PAGESIZE": "10"
    },
    "KEYDATE": "",
    "P_ORGEH": {
        "item": {
            "ORGEH": ""
        }
    },
    "P_PERNR": {
        "item": {
            "PERNR": ""
        }
    }
};


//外部人员接口
var outUserData={
    "IM_BUKRS": "",
    "IM_COMSTIRNG": "",
    "IM_KUNNR": "",
    "IM_PARNR": "",
    "IM_PERNR": "",
    "IM_VTWEG": "",
    "IS_PUBLIC": {
        "FLOWNO": "",
        "PERNR": "",
        "ZDOMAIN": "600",
        "I_PAGENO": "1",
        "I_PAGESIZE": "10"
    }
};

//获取外部人员信息
function getOutUser(param,callback){
    outUserData.IM_BUKRS=param;
    var data = JSON.stringify(outUserData);
    $.ajax({
        type: "POST",
        url: it_service_user.OuterUser,
        data: data,
        async:false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            callback(result);
        }
    });
}



var userData = {
    "Envelope": {
        "Header": {
            "__prefix": "soapenv"
        },
        "Body": {
            "ZHR_GET_PER_FUZZY_SEARCH": {
                "I_PUBLIC": {
                    "FLOWNO": "",
                    "PERNR": "",
                    "ZDOMAIN": "600",
                    "I_PAGENO": "1",
                    "I_PAGESIZE": "10"
                },
                "P_SEARCH": "",
                "__prefix": "urn"
            },
            "__prefix": "soapenv"
        },
        "_xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
        "_xmlns:urn": "urn:sap-com:document:sap:rfc:functions",
        "__prefix": "soapenv"
    }
};

var testData={
    "Envelope": {
        "Header": {
            "__prefix": "soapenv"
        },
        "Body": {
            "ZHR_GET_PER_FUZZY_SEARCH": {
                "I_PUBLIC": {
                    "FLOWNO": "",
                    "PERNR": "",
                    "ZDOMAIN": "600",
                    "I_PAGENO": "1",
                    "I_PAGESIZE": "10"
                },
                "P_SEARCH": "",
                "__prefix": "urn"
            },
            "__prefix": "soapenv"
        },
        "_xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
        "_xmlns:urn": "urn:sap-com:document:sap:rfc:functions",
        "__prefix": "soapenv"
    }
}

function getUsers(param,callback) {
    //testData.Envelope.Body.ZHR_GET_PER_FUZZY_SEARCH.P_SEARCH = param;
   // var x2js = new X2JS();
  //  var data = x2js.json2xml_str(testData);
    userDataSearch.P_SEARCH=param;
    var data=JSON.stringify(userDataSearch);

    $.ajax({
        type: "POST",
        url: it_service_user.Search,
        data: data,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            callback(result);
        }
    });
}

var baseData={
    "Envelope": {
        "Header": {
            "__prefix": "soapenv"
        },
        "Body": {
            "ZHRWS_DYNAMIC_PERSON": {
                "DYFLG": "",
                "IS_PUBLIC": {
                    "FLOWNO": "",
                    "PERNR": "",
                    "ZDOMAIN": "600",
                    "I_PAGENO": "1",
                    "I_PAGESIZE": "10"
                },
                "KEYDATE": "",
                "P_ORGEH": {
                    "item": { "ORGEH": "" }
                },
                "P_PERNR": {
                    "item": { "PERNR": "8102597" }
                },
                "__prefix": "urn"
            },
            "__prefix": "soapenv"
        },
        "_xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
        "_xmlns:urn": "urn:sap-com:document:sap:rfc:functions",
        "__prefix": "soapenv"
    }
};

//根据workcode获取用户
function getUserByCode(param,callback) {
    userDataBase.P_PERNR.item.PERNR=param;
    var data = JSON.stringify(userDataBase);
    $.ajax({
        type: "POST",
        url: it_service_user.UserBase,
        data: data,
        async:false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
          callback(result);
        }
    });
}


//用户登录接口新
var userLoginDataNew={
    "loginName": "",
    "password": ""
}

//用户登录
var userLoginData={
    "Envelope": {
        "Header": {
            "__prefix": "soapenv"
        },
        "Body": {
            "CheckUser2": {
                "loginName": {
                    "__prefix": "cttq",
                    "__text": ""
                },
                "password": {
                    "__prefix": "cttq",
                    "__text": ""
                },
                "invokeUser": {
                    "__prefix": "cttq",
                    "__text": "cttq"
                },
                "invokePassword": {
                    "__prefix": "cttq",
                    "__text": "cttq123.com"
                },
                "invokeApp": {
                    "__prefix": "cttq",
                    "__text": ""
                },
                "__prefix": "cttq"
            },
            "__prefix": "soapenv"
        },
        "_xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
        "_xmlns:cttq": "http://cttq.org/",
        "__prefix": "soapenv"
    }
}

//u:8103666,p:a123456
var loginData={
    "Envelope": {
        "Header": {
            "__prefix": "soapenv"
        },
        "Body": {
            "CheckUser": {
                "loginName": {
                    "__prefix": "cttq",
                    "__text": ""
                },
                "password": {
                    "__prefix": "cttq",
                    "__text": ""
                },
                "invokeUser": {
                    "__prefix": "cttq",
                    "__text": "cttq"
                },
                "invokePassword": {
                    "__prefix": "cttq",
                    "__text": "cttq123.com"
                },
                "invokeApp": {
                    "__prefix": "cttq",
                    "__text": ""
                },
                "__prefix": "cttq"
            },
            "__prefix": "soapenv"
        },
        "_xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
        "_xmlns:cttq": "http://cttq.org/",
        "__prefix": "soapenv"
    }
};


//cookie user
function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    return ""
}

function setCookie(c_name,value,expiredays)
{
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+expiredays)
    document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}

function checkCookie()
{
    //window.location.href=it_service_user.UserLogin + 'index#login.html';
    userWorkCode=getCookie('userWorkCode')
    if (userWorkCode!=null && userWorkCode!="") {}
    else {
        window.location.href='login.html';
    }
}

function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}


//login user
var userWorkCode=getCookie('userWorkCode');
var userType=getCookie('userType');
var userName=getCookie('userName');
var currentUser={
    userWorkCode:userWorkCode,
    userType:userType,
    userName:userName
};