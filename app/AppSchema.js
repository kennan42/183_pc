var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//子应用安装日志(app_install_logs)
var appInstallLogSchema = new Schema({
    userId:String,
    appId:String,
    appName:String,
    opType:Number,//操作类型 1安装  2删除
    createTime:Number//操作时间
});

//用户已安装子应用表 (app_install)
var installedAppSchema = new Schema({
    userId:String,
    appId:String,
    appName:String,
    receveMsg:Number,//1接收   0不接收  默认1
    createTime:Number,
    updateTime:Number
});

//消息模块与appId的映射关系 (app_message_push_modules)
var appMsgPushModuleSchema = new Schema({
    appId:String,
    msgModule:String,
    status:Number//1推送 0不推送  用于全局配置是否进行消息推送
});

//记录页面访问量(app_visit_page_log)
var appVisitPageLogSchema = new Schema({
    userId:String,//用户id
    userName:String,
    sex:String,
    age:Number,
    dept:String,
    deptName:String,
    plans:String,//职位
    plstx:String,//职位名称
    stell:String,//职务
    stltx:String,//职务名称
    module:String,//功能模块名称,
    subModule:String,//功能子模块
    page:String,//访问的页面名称
    startTime:Number,//进入页面时间
    endTime:Number,//离开页面时间,进入页面则存0
    stayTime:Number,//停留页面时间，进入页面存0
    createTime:Number//创建时间
});

//app功能访问记录(app_func_uselog)
var appFuncUseLogSchema = new Schema({
    userId:String,
    userName:String,
    sex:Number,
    age:Number,
    dept:String,
    deptName:String,
    plans:String,//职位
    plstx:String,//职位名称
    stell:String,//职务
    stltx:String,//职务名称
    module:String,//功能模块
    subModule:String,//功能子模块
    createTime:Number//建立时间
});

//极光注册(app_jpush_register_log)
var jpushRegisterLogSchema = new Schema({
    alias:String,//极光注册别名
    platform:Number,//平台 1:安卓     0:IOS
    createTime:String//注册时间
});

//app意见反馈(app_opinion)
var appOpinionSchema = new Schema({
    userId:String,
    userName:String,
    opinion:String,
    imgs:[],//图片数组
    status:Number,//0未回复  1已回复
    readStatus:Number,//回复是否已读
    reply:String,//回复内容
    replyImgs:[],//回复的图片
    replyUserId:String,
    createTime:Number,
    replyTime:Number,//回复时间
    readTime:Number//读回复信息时间
});

//员工信息(base_user)
var BaseUserSchema = new Schema({
    PERNR:String,//人员编号
    PLANS:String,//职务
    NACHN:String,//姓名
    VORNA:String,//姓名全拼
    INITS:String,//姓名简拼
    GESCH:String,//性别代码
    GESCH_T:String,//性别文本
    GBDAT:String,//出生日期
    BUKRS:String,//公司代码
    BUTXT:String,//公司代码或公司的名称
    ZZ_GS:String,//公司组织机构编码
    ZZ_GST:String,//公司组织机构描述
    ZZ_JG1:String,//一级部门
    ZZ_JG1T:String,//一级部门描述
    ZZ_JG2:String,//二级部门
    ZZ_JG2T:String,//二级部门描述
    ZZ_JG3:String,//三级部门
    ZZ_JG3T:String,//三级部门描述
    ZZ_JG4:String,//四级部门
    ZZ_JG4T:String,//四级部门描述
    ZZ_JG5:String,//五级部门    
    ZZ_JG5T:String,//五级部门描述
    ORGEH:String,//直接隶属单位
    ORGTX:String,//组织单位短文本
    PLSTX:String,//职位名称
    PROZT:String,//权重百分比--值为100%，没有兼职岗位；小于100%，有兼职岗位
    STELL:String,//职务
    STLTX:String,//职务名称
    ZZ_SPCJ:String,//审批层级
    ZZ_SPCJT:String,//审批层级描述
    STAT1:String,//员工状态
    STAT1T:String,//员工状态文本
    ZZ_TEL:String,//手机号
    ZZ_TEL_VIS:Number,//手机是否可见  1可见  0不可见
    ZZ_TEL_SUF:String,//手机后四位
    ZZ_RTX:String,//RTX号 
    ZZ_EMAIL:String,//邮箱
    LINE_MANAGER:String,//直线经理工号
    LM_NACHN:String,//直线经理姓名
    ZZ_RQ:String,//日期
    ZZ_SJ:String,//时间
    WERKS:String,//人事范围
    PBTXT:String,//人事范围文本
    BTRTL:String,//人事子范围
    BTRTX:String,//人员子范围文本
    PERSG:String,//员工组
    PGTXT:String,//员工组的名称
    PERSK:String,//员工子组
    PKTXT:String,//员工子组的名称
    ZZ_XSRY:String,//是否销售人员标识
    ZZ_RZSJ:String,//入职时间
    ZZ_ZZSJ:String,//转正时间
    ZZ_TCSJ:String,//计划离职日期
    ZZ_LZSJ:String,//离职时间
    ZZ_YGSL:String,//员工司龄
    ZZ_CZD:String,//常驻地
    ZZ_CZDA:String,//省(直辖市)
    ZZ_CZDA_T:String,//描述-省名称
    ZZ_CZDB:String,//常驻地：城市
    ZZ_CZDB_T:String,//描述-市名称
    ZZ_CZDC:String,//常驻地：县/区
    ZZ_CZDC_T:String,//描述-县名称
    ZZ_LDBG:String,//两地办公标识
    ZZ_CZD1:String,//第二办公地
    ZZ_CZDA1:String,//省(直辖市)
    ZZ_CZDA1_T:String,//描述-省名称
    ZZ_CZDB1:String,//第二办公地（市）
    ZZ_CZDB1_T:String,//描述-市名称
    ZZ_CZDC1:String,//第二办公地（县/区）
    ZZ_CZDC1_T:String,//描述-县名称
    ZZ_JTTF:String,//是否电话费集团统付
    ZZ_SFPC:String, //是否公司配车,
    syncTime:Number
});


exports.appInstallLogSchema = appInstallLogSchema;
exports.installedAppSchema = installedAppSchema;
exports.appMsgPushModuleSchema = appMsgPushModuleSchema;
exports.appVisitPageLogSchema = appVisitPageLogSchema;
exports.appFuncUseLogSchema = appFuncUseLogSchema;
exports.jpushRegisterLogSchema = jpushRegisterLogSchema;
exports.appOpinionSchema = appOpinionSchema;
exports.BaseUserSchema = BaseUserSchema;
