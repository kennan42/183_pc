'use strict';

var upload = require('./lib/upload.js');
var manage = require('./lib/manage.js');


//赋值秘钥和类型
/*
 AK:云存储公钥
 SK:云存储私钥
 TYPE:兼容TOP与tea云的 ak/sk
 */
function WANTU(AK, SK, TYPE) {
    if (!AK || !SK) {
        return;
    }
    this.AK = AK;
    this.SK = SK;
    this.type = TYPE || "TOP"; //"CLOUD";
    this.Manager = new manage(this.AK, this.SK, this.type);
    this.Uploader = new upload(this.AK, this.SK, this.type);
}

/*
 删除文件
 namespace: 命名空间
 dir: 目录
 file: 文件名
 callback: 回调
 */
WANTU.prototype.delFile = function (namespace, dir, file, callback){
    this.Manager.delFile(namespace, dir, file, callback)
};

/*
 文件是否存在
 namespace: 命名空间
 dir: 目录
 file: 文件名
 callback: 回调
 */
WANTU.prototype.existFile = function(namespace, dir, file, callback){
    this.Manager.existFile(namespace, dir, file, callback)
};

/*
 获取文件meta
 namespace: 命名空间
 dir: 目录
 file: 文件名
 callback: 回调
 */
WANTU.prototype.getFile = function(namespace, dir, file, callback){
    this.Manager.getFile(namespace, dir, file, callback)
};

/*
 获取文件列表
 namespace: 命名空间
 dir: 目录
 currentPage: 当前页码
 pageSize: 每页文件个数
 callback: 回调
 */
WANTU.prototype.listFiles = function(namespace, dir, currentPage, pageSize, callback){
    this.Manager.listFiles(namespace, dir, currentPage, pageSize, callback)
};

/*
 创建文件夹
 namespace: 命名空间
 dir: 目录
 callback: 回调
 */
WANTU.prototype.createDir = function (namespace, dir, callback){
    this.Manager.createDir(namespace, dir, callback)
};

/*
 删除文件夹
 namespace: 命名空间
 dir: 目录
 callback: 回调
 */
WANTU.prototype.delDir = function(namespace, dir, callback){
    this.Manager.delDir(namespace, dir, callback)
};

/*
 文件夹是否存在
 namespace: 命名空间
 dir: 目录
 callback: 回调
 */
WANTU.prototype.existDir = function(namespace, dir, callback){
    this.Manager.existDir(namespace, dir, callback)
};

/*
 获取子文件夹列表
 namespace: 命名空间
 dir: 目录
 currentPage: 当前页码
 pageSize: 每页文件个数
 callback: 回调
 */
WANTU.prototype.listDirs = function(namespace, dir, currentPage, pageSize, callback){
    this.Manager.listDirs(namespace, dir, currentPage, pageSize, callback)
};

/*
 新建持久化任务
 namespace: 命名空间
 dir: 目录
 file: 文件名
 fops: 持久化操作参数,
 notifyURL: 处理结果通知接收URL
 force: 0为不覆盖转换，1为强制覆盖转换
 callback: 回调
 */
WANTU.prototype.addPts = function(namespace, dir, file, fops, notifyURL, force, callback){
    this.Manager.addPts(namespace, dir, file, fops, notifyURL, force, callback)
};

/*
 持久化任务查询
 persistentId: 任务id
 callback: 回调
 */
WANTU.prototype.getPts = function(persistentId, callback){
    this.Manager.getPts(persistentId, callback)
};

/*
* 普通上传
* uploadPolicy：上传策略，json格式
* filepath：文件路径
* dir： 上传到文件夹路径
* meta：用户自定义的文件meta信息
* _var：魔法变量
* callback：回调
* */
WANTU.prototype.singleUpload = function(uploadPolicy, filePath, dir, meta, _var, callback){
    console.log(uploadPolicy);
    this.Uploader.singleUpload(uploadPolicy, filePath, dir, meta, _var, callback)
};

/*
 * 分片上传（完整过程）
 * uploadPolicy：上传策略，json格式
 * filepath：文件路径
 * dir： 上传到文件夹路径
 * meta：用户自定义的文件meta信息
 * _var：魔法变量
 * chunkSize: 分片大小
 * callback：回调
 * */
WANTU.prototype.multiUpload = function(uploadPolicy, filePath, dir, meta, _var, chunkSize, callback){
    this.Uploader.multiUpload(uploadPolicy, filePath, dir, meta, _var, chunkSize, callback)
};

/*
 * 初始化分片上传
 * uploadPolicy：上传策略，json格式
 * filepath：文件路径
 * dir： 上传到文件夹路径
 * meta：用户自定义的文件meta信息
 * _var：魔法变量
 * chunkSize: 第一片分片大小
 * callback：回调
 * */
WANTU.prototype.multiUploadInit = function(uploadPolicy, filePath, dir, meta, _var, chunkSize, callback){
    this.Uploader.multiUploadInit(uploadPolicy, filePath, dir, meta, _var, chunkSize, callback)
};

/*
 * 分片上传（初始化成功后上传）
 * uploadPolicy：上传策略，json格式
 * filepath：文件路径
 * id： 上传唯一id，由初始化分片上传返回
 * uploadId：分片上传Id，由初始化分片上传返回
 * partNumber：当前分片编号，从1开始
 * chunkStart： 当前分片开始位置
 * chunkSize: 当前分片大小
 * callback：回调
 * */
WANTU.prototype.multiUploadBlock = function(uploadPolicy, filePath, id, uploadId, partNumber, chunkStart, chunkSize, callback){
    this.Uploader.multiUploadInit(uploadPolicy, filePath, id, uploadId, partNumber, chunkStart, chunkSize, callback)
};

/*
 * 分片上传完成
 * uploadPolicy：上传策略，json格式
 * filepath：文件路径
 * id： 上传唯一id，由初始化分片上传返回
 * uploadId：分片上传Id，由初始化分片上传返回
 * eTags：每个分片上传后返回的eTag组成的数组
 * callback：回调
 * */
WANTU.prototype.multiUploadComplete = function(uploadPolicy, filePath, id, uploadId, eTags, callback){
    this.Uploader.multiUploadComplete(uploadPolicy, filePath, id, uploadId, eTags, callback)
};

/*
 * 取消分片上传
 * uploadPolicy：上传策略，json格式
 * id：上传唯一id，由初始化分片上传返回
 * uploadId： 分片上传Id，由初始化分片上传返回
 * callback：回调
 * */
WANTU.prototype.cancelMultiUpload = function(uploadPolicy, id, uploadId, callback){
    this.Uploader.cancelMultiUpload(uploadPolicy, id, uploadId, callback)
};


module.exports = exports.WANTU = WANTU;