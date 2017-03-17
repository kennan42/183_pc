//弹出框
function AlertTips(message,callback){
    bootbox.alert(message, callback);
}

function Confirm(message,callback){
    bootbox.confirm(message, callback);
}

//file_input.ace_file_input('loading', true);

var upload_url="http://upload.media.aliyun.com/api/proxy/upload";

//图片上传
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};




//ajax
function loadingTimeout() {
    AlertTips("请求超时");
}


function Ace_HttpPost(url, data, callback,isAsync) {
    if (url == '') {
        alert('请求地址不能为空！');
    } else {
        setTimeout('loadingTimeout()', 10000);
        url = url;
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            contentType: "application/json",
            async:isAsync,
            data: data,
            success: function (result) {
                callback(result);
            }
        });
    }
}

function callbackreload()
{
    window.location.reload();
}