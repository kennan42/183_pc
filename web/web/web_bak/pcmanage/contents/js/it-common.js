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
var timeout;
function show1() {
    loading.init({ msg: '请稍候...', parent_container: 'body', is_show: false });
    loading.show();
    timeout = setTimeout('loadingTimeout()', 10000);
}

function hide1() {
    // $(".ajax-loading-overlay").hide();
    loading.hide();
    // clearTimeout(timeout);
}

function loadingTimeout() {
    loading.hide();
}


function Common_HttpPost(url, data, callback) {
    if (url == '') {
        alert('请求地址不能为空！');
    } else {
        show();
        url = url;
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            contentType: "application/json",
            data: data,
            success: function (json) {
                callback(json);
            }

        });
    }
}

function callbackreload()
{
    window.location.reload();
}