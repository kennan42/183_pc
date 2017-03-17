'use strict';

var utils = require('./utils.js');
var fs = require('fs');
var querystring = require('querystring');

var uploadUri = "upload.media.aliyun.com",
    singleUploadUri = "/api/proxy/upload",
    blockInitUri = "/api/proxy/blockInit",
    blockUploadUri = "/api/proxy/blockUpload",
    blockCompleteUri = "/api/proxy/blockComplete",
    blockCancelUri = "/api/proxy/blockCancel";

var MAXSIZE = 20 * 1024 * 1024,
    CHUNKSIZE = 4 * 1024 * 1024;

function Upload(AK, SK, TYPE) {
    this.AK = AK;
    this.SK = SK;
    this.TYPE = TYPE;
}

Upload.prototype.getHeader = function (uploadPolicy) {
    return {
        Authorization: "UPLOAD_AK_TOP " + utils.uploadAuth(uploadPolicy, this.AK, this.SK),
        "User-Agent": utils.getUserAgent(this.TYPE)
    };
};

Upload.prototype.uploadCheck = function (uploadPolicy, filePath) {
    if (!uploadPolicy.namespace) {
        return "namespace is empty";
    }
    if (!uploadPolicy.expiration) {
        return "expiration is empty";
    }
    if (uploadPolicy.insertOnly == undefined) {
        uploadPolicy.insertOnly = 0;
    }
    if(filePath&&!fs.existsSync(filePath)){
        return "file not exist";
    }
    return false;
};

//文件上传支持路径和文件
Upload.prototype.singleUpload = function (uploadPolicy, filePath, dir, meta, _var, callback) {

    var str = this.uploadCheck(uploadPolicy, filePath);
    if (str) {
        throw new Error(str);
        return;
    }

    var fileSize = fs.statSync(filePath).size,
        fileName = filePath.split('/').pop();

    if (fileSize > MAXSIZE) {
        throw new Error("file is too large, use multi part upload please");
        return;
    }


    var headers = this.getHeader(uploadPolicy);
    var options = {
        host: uploadUri,
        path: singleUploadUri,
        headers: headers,
        method: "POST"
    };

    var body = {
        size: fileSize
    };
    if (fileName) {
        body.name = fileName;
    }
    if (dir) {
        body.dir = dir;
    }
    if (meta) {
        body.meta = meta;
    }
    if (_var) {
        body.var = _var;
    }

    body.content = [filePath];
    utils.request(options, callback, body, true);
};


Upload.prototype.multiUpload = function (uploadPolicy, filePath, dir, meta, _var, chunkSize, callback) {
    var self = this;
    var str = this.uploadCheck(uploadPolicy, filePath);
    if (str) {
        throw new Error(str);
        return;
    }
    //计算每个分片的开始位置和块大小
    var chunkSize = chunkSize || CHUNKSIZE,
        chunkSizes = [],
        blobStarts = [],
        tags = [],
        offset = 0;
    var tmp = 0, size, fileSize = fs.statSync(filePath).size;
    while (tmp < fileSize) {
        size = Math.min(chunkSize, fileSize - tmp);
        chunkSizes.push(size);
        blobStarts.push(tmp);
        tmp += size;
    }

    self.multiUploadInit(uploadPolicy, filePath, dir, meta, _var, chunkSizes[0], function (err, res) {
        callback(err, res);
        if (err) {
            return;
        }
        if (res.statusCode == 200) {
            var result = JSON.parse(res.data),
                uploadId,
                id;
            tags[0] = result.eTag;
            offset += chunkSizes[0];
            id = result.id;
            uploadId = result.uploadId;
            if (offset >= fileSize) {
                self.multiUploadComplete(uploadPolicy, id, uploadId, tags, callback);
            }
            for (var i = 1; i < blobStarts.length; i++) {
                self.multiUploadBlock(uploadPolicy, filePath, id, uploadId, i+1, blobStarts[i], chunkSizes[i], function (err, res) {
                    callback(err, res);
                    if (err) {
                        return;
                    }
                    if (res.statusCode == 200) {
                        var result = JSON.parse(res.data),
                            partNumber = parseInt(result.partNumber)-1;
                        tags[partNumber] = result.eTag;
                        offset += chunkSizes[partNumber];
                        if (offset >= fileSize) {
                            self.multiUploadComplete(uploadPolicy, id, uploadId, tags, callback);
                        }
                    }
                })
            }
        }
    });
};

Upload.prototype.multiUploadInit = function (uploadPolicy, filePath, dir, meta, _var, chunkSize, callback) {
    var str = this.uploadCheck(uploadPolicy, filePath);
    if (str) {
        throw new Error(str);
        return;
    }
    var headers = this.getHeader(uploadPolicy);
    var options = {
        host: uploadUri,
        path: blockInitUri,
        headers: headers,
        method: "POST"
    };
    var body = {
        size: chunkSize,
        name: filePath.split('/').pop()
    };
    if (dir) {
        body.dir = dir;
    }
    if (meta) {
        body.meta = meta;
    }
    if (_var) {
        body.var = _var;
    }
    body.content = [filePath, 0, chunkSize];

    utils.request(options, callback, body, true);
};

Upload.prototype.multiUploadBlock = function (uploadPolicy, filePath, id, uploadId, partNumber, chunkStart, chunkSize, callback) {
    var headers = this.getHeader(uploadPolicy);
    var options = {
        host: uploadUri,
        path: blockUploadUri,
        headers: headers,
        method: "POST"
    };
    var body = {
        size: chunkSize,
        partNumber: partNumber,
        uploadId: uploadId,
        id: id,
        content: [filePath, chunkStart, chunkSize]
    };
    utils.request(options, callback, body, true);
};

Upload.prototype.multiUploadComplete = function (uploadPolicy, id, uploadId, eTags, callback) {
    var headers = this.getHeader(uploadPolicy);
    var parts = [];
    for (var i = 0; i < eTags.length; i++) {
        parts[i] = {
            "partNumber": i + 1,
            "eTag": eTags[i]
        }
    }
    parts = utils.base64(JSON.stringify(parts));

    var options = {
        host: uploadUri,
        path: blockCompleteUri,
        headers: headers,
        method: "POST"
    };
    var body = {
        id: id,
        uploadId: uploadId,
        parts: parts
    };
    utils.request(options, callback, body, true);
};

Upload.prototype.cancelMultiUpload = function (uploadPolicy, id, uploadId, callback) {
    var headers = this.getHeader(uploadPolicy);
    var options = {
        host: uploadUri,
        path: blockCancelUri,
        headers: headers,
        method: "POST"
    };
    var body = {
        id: id,
        uploadId: uploadId
    };
    utils.request(options, callback, body, true);
};


module.exports = exports.Upload = Upload;




