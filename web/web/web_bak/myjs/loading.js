//登录工号获取
var localCookie = document.cookie;
var cookie_user = '';
if(localCookie.length > 0 && localCookie.indexOf('userid')>-1){
    localCookie = localCookie.split(';');
    for(var lc in localCookie){
        if(localCookie[lc].indexOf('userid=')>-1){
            cookie_user = localCookie[lc];
            break;
        }
    } 
    if(cookie_user == ''){
        var unique_id = $.gritter.add({
            title: '系统登录错误提示',
            text: '无法获取信息，请重新登录<p style="padding-top:14px;"><span class="col-sm-6"></span><span class="col-sm-6" style="text-align:right;"><button class="btn btn-xs btn-success" onclick="CloseGritter(this);WindowClose();"><i class="ace-icon fa fa-check"></i>确定</button></span></p>',
            sticky: true,
            time: '',
            class_name: 'gritter-info gritter-center'
        });
    }else{
        cookie_user = trim(cookie_user).substring(7);
        localStorage.removeItem('pernrBase');
        localStorage.setItem('pernrBase',cookie_user);
    }
}else{
    var unique_id = $.gritter.add({
        title: '系统登录错误提示',
        text: '无法获取信息，请重新登录<p style="padding-top:14px;"><span class="col-sm-6"></span><span class="col-sm-6" style="text-align:right;"><button class="btn btn-xs btn-success" onclick="CloseGritter(this);WindowClose();"><i class="ace-icon fa fa-check"></i>确定</button></span></p>',
        sticky: true,
        time: '',
        class_name: 'gritter-info gritter-center'
    });
}
var eachNum = localStorage.pernrBase?localStorage.pernrBase:'';
//加载动画
var opts = {            
    lines: 10, // 花瓣数目
    length: 0, // 花瓣长度
    width: 10, // 花瓣宽度
    radius: 20, // 花瓣距中心半径
    corners: 1, // 花瓣圆滑度 (0-1)
    rotate: 0, // 花瓣旋转角度
    direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
    color: '#2679b5', // 花瓣颜色
    speed: 1, // 花瓣旋转速度
    trail: 60, // 花瓣旋转时的拖影(百分比)
    shadow: false, // 花瓣是否显示阴影
    hwaccel: false, //spinner 是否启用硬件加速及高速旋转            
    className: 'spinner', // spinner css 样式名称
    zIndex: 2e9, // spinner的z轴 (默认是2000000000)
    top: '-100', // spinner 相对父容器Top定位 单位 px
    left: '0'// spinner 相对父容器Left定位 单位 px
};
var target = document.getElementById("Loading");  
var spinner = new Spinner(opts).spin(target);
var pagei = '';
function loading_Open(){
    pagei = $.layer({
        type: 1,   //0-4的选择,
        title: false,
        border: [0],
        closeBtn: [0],
        offset:['' , '47.8%'],
        shadeClose: false,
        area: ['auto', 'auto'],
        page: {dom : '#Loading'}
    });
}