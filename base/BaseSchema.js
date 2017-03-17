var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BaseFestivalSchema = new Schema({
    appId: String,
    imageURL: String,
    expireDate: Number,
    detail: String,
    createdAt: Number
});

//操作日志
var BaseOpLogSchema = new Schema({
    opType: String,//i:增加，u:修改，d:删除
    opArg: {},//请求参数前端传过来的
    opDocument: String,//操作文档，操作的哪张表
    userId: String,//操作id
    userName: String,//操作人姓名
    updateTime: String//操作日期
});

//推送消息记录
var BasePushMessageLogSchema = new Schema({
    appId: String,//应用id
    userId: String,//用户id
    title: String,//标题
    body: String,//内容
    pushTime: Number,//推送时间
    readStatus: Number,//阅读状态  1已读   0未读
    module: String,
    subModule: String,
    type: String//message   remind   func
});

//用户
var BaseUserSchema = new Schema({
    moduleName: Number,//所属动能模块：1:meet、2：carpool
    userId: String,//登录名
    roleName: String //角色名称
});

//欢迎页图片包
var BaseWelcomePackage = new Schema({
    appId: String,  //appID用于识别应用
    id: Number,  //自增id，100000开始；100000为默认
    images: Array,  //欢迎页图片的URL
    thumbnails: Array,  //欢迎页图片缩略图的URL
    description: String, //图片包描述
    status: Number,  //图片包状态，0表示启用1表示停用
    beginTime: Number,  //生效日期，Unix时间戳单位为ms
    endTime: Number,  //失效日期，Unix时间戳单位为ms
    priority: Number,  //优先级，整数，范围1-9，1最低，9最高；id为100000的图片优先级为0，不可修改
    skip: Number,  //是否允许跳过，0表示允许1表示不允许
    duration: Number,  //显示时长，整数，单位为s；单页面时用户可设置显示时长，多页面不存在请传-1
    createTime: Number,  //创建日期，，Unix时间戳单位为ms
    userId: String,  //创建者的用户名
    enterType: Number // 进入方式
});

// 用于自增ID的实现
var BaseCount = new Schema({
    name: String,
    seq: Number
});

/**
 * PC 端首页的用户权限控制
 * @type {mongoose.Schema}
 *
 * @author 陈恺垣
 */
var BaseJurisdictionUser = new Schema({
    userId: {type: String, trim: true}, // 用户名
    level: Number, // 等级，0为最高权限，1为普通权限
    jurisdictionId: {type: String, trim: true},
    abbreviation: {type: String, trim: true}, // 权限的中文全称
    createTime: Number // 创建时间
}).index({
        userId: 1,
        jurisdictionId: 1
    }, {
        unique: true
    }
);

/**
 * PC 端首页的权限列表
 * @type {mongoose.Schema}
 *
 * @author 陈恺垣
 */
var BaseJurisdiction = new Schema({
    level: Number, // 等级，0为最高权限，1为普通权限
    fullName: {type: String, trim: true}, // 权限的全称
    abbreviation: {type: String, trim: true}, // 权限的缩写
    createTime: Number // 创建时间
}).index({
        fullName: 1,
        abbreviation: 1
    }, {
        unique: true
    }
);

/**
 * PC 端首页的权限访问日志
 * @type {mongoose.Schema}
 *
 * @author 陈恺垣
 */
var BaseJurisdictionLog = new Schema({
    /*
     类型
     -1无权限非法访问，
     0增加权限，1删除权限，2修改权限，3分页查询权限，
     4增加用户权限，5删除用户权限，6修改用户权限，7分页查询用户权限
     */
    type: String,
    ids: Array, // 记录的 id
    opUserId: {type: String, trim: true}, // 操作者用户名
    params: {type: String, trim: true}, // 请求参数
    result: {type: String, trim: true}, // 获取结果
    status: Number, // 操作状态，0成功，1失败
    description: {type: String, trim: true}, // 操作描述
    createTime: Number // 创建时间
});

/**
 * 停机接口
 * @type {mongoose.Schema}
 *
 * @author 陈恺垣
 */
var downtimeInterface = new Schema({
    description: {type: String, trim: true}, // 接口描述
    name: {type: String, trim: true}, // 接口名称
    createTime: Number // 创建时间
}).index({
        name: 1
    }, {
        unique: true
    }
);

/**
 * 停机公告
 * @type {mongoose.Schema}
 *
 * @author 陈恺垣
 */
var downtimeNotice = new Schema({
    title: {type: String, trim: true}, // 公告标题
    content: {type: String, trim: true}, // 公告内容
    interfaceArr: {type: Array, trim: true}, // 公告接口列表 [{_id:xxx,description:xxx,name:xxx},..]
    beginTime: {type: Number, trim: true}, // 开始时间戳
    endTime: {type: Number, trim: true}, // 结束时间戳
    contactArr: {type: Array, trim: true}, // 联系人列表 [{name:xxx,phone:xxx},...]
    createTime: Number // 创建时间
});


exports.BaseFestivalSchema = BaseFestivalSchema;
exports.BaseOpLogSchema = BaseOpLogSchema;
exports.BasePushMessageLogSchema = BasePushMessageLogSchema;
exports.BaseUserSchema = BaseUserSchema;
exports.BaseWelcomePackage = BaseWelcomePackage;
exports.BaseCount = BaseCount;
exports.BaseJurisdiction = BaseJurisdiction;
exports.BaseJurisdictionUser = BaseJurisdictionUser;
exports.BaseJurisdictionLog = BaseJurisdictionLog;
exports.downtimeInterface = downtimeInterface;
exports.downtimeNotice = downtimeNotice;
