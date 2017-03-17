var MEAP = require("meap");
var json2xls = require('json2xls');
var fs = require('fs');
function run(Param, Robot, Request, Response, IF) {

    var arg = JSON.parse(Param.body.toString());
    

    var data = {
        "titleType" : 6,
        "quesCode" : arg.quesCode,
        "quesContent" : arg.quesContent,
        "quesRaiserWorkCode" : arg.quesRaiserWorkCode,
        "quesRaiserName" : arg.quesRaiserName,
        "quesRaiserBeginTime" : arg.quesRaiserBeginTime,
        "quesRaiserEndTime" : arg.quesRaiserEndTime,
        "quesAccepterWorkCode" : arg.quesAccepterWorkCode,
        "quesAccepterName" : arg.quesAccepterName,
        "quesAcceptBeginTime" : arg.quesAcceptBeginTime,
        "quesAcceptEndTime" : arg.quesAcceptEndTime,
        "sysTypeCid" : arg.sysTypeCid,
        "belongSysTypeCid" : arg.belongSysTypeCid,
        "turnApproveBusi" :arg.belongSysTypeCid,
        "turnSubMaster" : arg.belongSysTypeCid,
        "pageNum" : 1,
        "pageSize" : 20000,
        "quesTypeCid" : arg.belongSysTypeCid,
        "quesOriginCid" : arg.quesOriginCid,
        "publishType" :""
    }

    // Response.setHeader("Content-type", "text/json;charset=utf-8");
    var option = {
        method : "POST",
        url : global.its + "/its-gwy/mainques/workBillMainList.json",
        Cookie : "true",
        agent : "false",
        Enctype : "application/json",
        Body : data
    };

    MEAP.AJAX.Runner(option, function(err, res, data) {
        
        
       console.log(data);
        if (!err) {
          
           var data =JSON.parse(data);
           if(data.resultJson!=null&&data.resultJson.list.length!=0){
               
                var xls = json2xls(data.resultJson.list);
                fs.writeFileSync('/opt/emm/uploads/its/积分管理工单.xlsx', xls, 'binary');
                Response.end(JSON.stringify({
                status : '1',
                message : "success"
                }));
           }
           
            
            
        } else {
            Response.end(JSON.stringify({
                status : '-1',
                message : JSON.stringify(err)
            }));
        }
    }, Robot);

    // var json = {
        // foo : 'bar',
        // qux : 'moo',
        // poo : 123,
        // stux : new Date()
    // }
    // var xls = json2xls(json);
    // //console.log(xls);
    // fs.writeFileSync('/usr/share/nginx/storage/test.xlsx', xls, 'binary');
    // Response.end(JSON.stringify({
        // status : 0,
        // message : "Success"
    // }));

    /*
     var noneExistFileName = ['async_create.', new Date()-0, '.txt'].join('');
     fs.writeFile(noneExistFileName, '鏂囦欢涓嶅瓨鍦紝鍒欏垱寤�, function(err){
     if(err) throw err;
     console.log(noneExistFileName+'涓嶅瓨鍦紝琚垱寤轰簡锛�);
     });*/

    console.log(111111);
}

exports.Runner = run; 