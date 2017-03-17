'use strict';

var manageUri = "rs.media.aliyun.com";
var MANAGE_API_VERSION = "3.0";

var utils = require('./utils');
var querystring = require('querystring');

function Manage(AK, SK, TYPE) {
    this.AK = AK;
    this.SK = SK;
    this.TYPE = TYPE;
}

Manage.prototype.getHeader = function (path, query, body) {
    var date = new Date().toUTCString();
    var Authorization = "ACL_"+ this.TYPE + " " + utils.manageAuth(path, query, body, date, this.SK, this.AK);
    return {
        Date: date,
        Authorization: Authorization,
        "User-Agent": utils.getUserAgent(this.TYPE)
    };
};

Manage.prototype.delFile = function (namespace, dir, file, callback) {
    var resourceId = utils.getResourceId(namespace, dir, file),
        path = "/"+MANAGE_API_VERSION + "/files/" + resourceId;

    var headers = this.getHeader(path, '', '');

    var options = {
        host: manageUri,
        path: path,
        headers: headers,
        method: "DELETE"
    };

    utils.request(options, callback);
};

Manage.prototype.existFile = function (namespace, dir, file, callback) {
    var resourceId = utils.getResourceId(namespace, dir, file),
        path = "/"+MANAGE_API_VERSION + "/files/" + resourceId + "/exist";

    var headers = this.getHeader(path, '', '');

    var options = {
        host: manageUri,
        path: path,
        headers: headers,
        method: "GET"
    };

    utils.request(options, callback);
};

Manage.prototype.getFile = function (namespace, dir, file, callback) {
    var resourceId = utils.getResourceId(namespace, dir, file),
        path = "/"+MANAGE_API_VERSION + "/files/" + resourceId;

    var headers = this.getHeader(path, '', '');

    var options = {
        host: manageUri,
        path: path,
        headers: headers,
        method: "GET"
    };

    utils.request(options, callback);
};

Manage.prototype.listFiles = function (namespace, dir, currentPage, pageSize, callback) {
    var path = "/"+MANAGE_API_VERSION + "/files",
        query = "namespace=" + namespace + "&dir=" + dir + "&currentPage=" + currentPage + "&pageSize=" + pageSize;

    var headers = this.getHeader(path, query, '');

    var options = {
        host: manageUri,
        path: path + "?" + query,
        headers: headers,
        method: "GET"
    };

    utils.request(options, callback);
};

Manage.prototype.createDir = function (namespace, dir, callback) {
    var resourceId = utils.getResourceId(namespace, dir),
        path = "/"+MANAGE_API_VERSION + "/folders/" + resourceId;

    var headers = this.getHeader(path, '', '');

    var options = {
        host: manageUri,
        path: path,
        headers: headers,
        method: "POST"
    };

    utils.request(options, callback);
};

Manage.prototype.delDir = function (namespace, dir, callback) {

    var resourceId = utils.getResourceId(namespace, dir),
        path = "/"+MANAGE_API_VERSION + "/folders/" + resourceId;

    var headers = this.getHeader(path, '', '');

    var options = {
        host: manageUri,
        path: path,
        headers: headers,
        method: "DELETE"
    };

    utils.request(options, callback);
};

Manage.prototype.existDir = function (namespace, dir, callback) {

    var resourceId = utils.getResourceId(namespace, dir),
        path = "/"+MANAGE_API_VERSION + "/folders/" + resourceId + "/exist";

    var headers = this.getHeader(path, '', '');

    var options = {
        host: manageUri,
        path: path,
        headers: headers,
        method: "GET"
    };

    utils.request(options, callback);
};

Manage.prototype.listDirs = function (namespace, dir, currentPage, pageSize, callback) {
    var path = "/"+MANAGE_API_VERSION + "/folders",
        query = "namespace=" + namespace + "&dir=" + dir + "&currentPage=" + currentPage + "&pageSize=" + pageSize;

    var headers = this.getHeader(path, query, '');

    var options = {
        host: manageUri,
        path: path + "?" + query,
        headers: headers,
        method: "GET"
    };

    utils.request(options, callback);
};


//持久化任务接口pts
Manage.prototype.addPts = function(namespace, dir, file,fops,notifyURL,force,callback){
    var resourceId = utils.getResourceId(namespace, dir, file),
        path = "/"+MANAGE_API_VERSION + "/pts/";
    if(force){
        force = 1;
    }else{
        force = 0;
    }
    var body = {
        resourceId: resourceId,
        fops: fops,
        force: force
    };
    if(notifyURL){
        body.notifyURL = encodeURI(notifyURL);
    }
    body = querystring.stringify(body);

    var headers = this.getHeader(path, '', body);
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    headers["Content-Length"] = Buffer.byteLength(body);

    var options = {
        host: manageUri,
        path: path,
        headers: headers,
        method: "POST"
    };

    utils.request(options, callback, body);
};

Manage.prototype.getPts = function (persistentId,callback) {
    var path = "/"+MANAGE_API_VERSION + "/pts/" + persistentId;

    var headers = this.getHeader(path, '', '');
    headers["Content-Type"] = "text/html";

    var options = {
        host: manageUri,
        path: path,
        headers: headers,
        method: "GET"
    };

    utils.request(options, callback);
};

module.exports = exports.Manage = Manage;