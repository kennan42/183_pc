/*------------------------------------------------------------
 // Copyright (C) 2015 正益无线（北京）科技有限公司  版权所有。
 // 文件名：
 // 文件功能描述：
 //
 // 创 建 人：陈恺垣
 // 创建日期：15/9/22
 //
 // 修 改 人：
 // 修改日期：
 // 修改描述：
 //-----------------------------------------------------------*/

jQuery(function ($) {
    getJurisdictionUser(1, parseInt($("#pageSize").val(), 10));

});

/**
 * 新建按钮响应
 */
function addClick() {
    openModal();
}

/**
 * 编辑按钮响应
 * @param _id
 * @param userId
 * @param jurisdictionId
 * @param fullName
 * @param abbreviation
 */
function editClick(_id, userId, jurisdictionId, fullName, abbreviation) {
    setModal(_id, userId, fullName);
    openModal();
}

/**
 * 弹窗保存按钮响应
 */
function saveClick() {
    var value = getModal();
    if (value._id == null || value._id == '') {
        addJurisdictionUser(value.userId, value.jurisdictionId, value.fullName, value.abbreviation, function () {
            closeModal();
            getJurisdictionUser(parseInt($("#current-page").val(), 10), parseInt($("#pageSize").val(), 10));
        });
    } else {
        updateJurisdictionUser(value._id, value.userId, value.jurisdictionId, value.fullName, value.abbreviation,
            function () {
                closeModal();
                getJurisdictionUser(parseInt($("#current-page").val(), 10), parseInt($("#pageSize").val(), 10));
            }
        );
    }
}

/**
 * 删除按钮响应
 * @param _id
 */
function deleteClick(_id) {
    layer.confirm('确认删除本权限？', {
        btn: ['确认','取消']
    }, function(){
        if ($("#tbody").find("tr").length == 1) {
            deleteJurisdictionUser(_id, function () {
                getJurisdictionUser(parseInt($("#page-count").html(), 10) - 1, parseInt($("#pageSize").val(), 10));
            });
        } else {
            deleteJurisdictionUser(_id, function () {
                getJurisdictionUser(parseInt($("#current-page").val(), 10), parseInt($("#pageSize").val(), 10));
            });
        }
    }, function(){

    });
}

/**
 * 增加权限
 * @param userId
 * @param jurisdictionId
 * @param fullName
 * @param abbreviation
 * @param cb
 */
function addJurisdictionUser(userId, jurisdictionId, fullName, abbreviation, cb) {
    var option = {
        data: {
            op: "add",
            userId: userId,
            jurisdictionId: jurisdictionId,
            fullName: fullName,
            abbreviation: abbreviation
        },
        successCb: function (data) {
            if (data.status == 0) {
                layer.msg('新建成功');
            } else if (data.status == -1) {
                layer.msg('没有权限');
            } else {
                layer.msg("新建失败")
            }
        },
        completeCb: function () {
            if (typeof cb == 'function') {
                cb();
            }
        }
    };
    request(option);
}

/**
 * 修改权限
 * @param _id
 * @param userId
 * @param jurisdictionId
 * @param fullName
 * @param abbreviation
 * @param cb
 */
function updateJurisdictionUser(_id, userId, jurisdictionId, fullName, abbreviation, cb) {
    var option = {
        data: {
            op: "update",
            _id: _id,
            userId: userId,
            jurisdictionId: jurisdictionId,
            fullName: fullName,
            abbreviation: abbreviation
        },
        successCb: function (data) {
            if (data.status == 0) {
                layer.msg('修改成功');
            } else if (data.status == -1) {
                layer.msg('没有权限');
            } else {
                layer.msg("修改失败");
            }
        },
        completeCb: function () {
            if (typeof cb == 'function') {
                cb();
            }
        }
    };
    request(option);

}

/**
 * 删除权限
 * @param _id
 * @param cb
 */
function deleteJurisdictionUser(_id, cb) {
    var option = {
        data: {
            op: "delete",
            _id: _id
        },
        successCb: function (data) {
            if (data.status == 0) {
                layer.msg('删除成功');
            } else if (data.status == -1) {
                layer.msg('没有权限');
            } else {
                layer.msg('删除失败');
            }
        },
        completeCb: function () {
            if (typeof cb == 'function') {
                cb();
            }
        }
    };
    request(option);
}

/**
 * 分页获取权限
 * @param pageNum
 * @param pageSize
 * @param cb
 */
function getJurisdictionUser(pageNum, pageSize, cb) {
    var option = {
        data: {
            op: "getByPage",
            pageNum: pageNum,
            pageSize: pageSize
        },
        successCb: function (data) {
            if (data.status == 0) {
                var result = data.data.result;
                var totalPageNum = Math.ceil(data.data.count / pageSize);

                // 如果出现当前页大于所有页数的情况，就请求新的数据
                if (pageNum > totalPageNum && totalPageNum > 0) {
                    getJurisdictionUser(totalPageNum, pageSize, cb);
                    return;
                }

                $("#current-page").val(pageNum);
                $("#page-count").html(totalPageNum);
                var html = '';
                for (var i = 0; i < result.length; i++) {
                    var tempStr = '\
                        <tr>\
                            <td>:_id</td>\
                            <td>:userId</td>\
                            <td>:fullName</td>\
                            <td>\
                                <button class="btn btn-sm btn-primary" :disabled\
                                    onclick="editClick(\':_id\',\':userId\',\':jurisdictionId\',\':fullName\',\':abbreviation\');">\
                                    <i class="ace-icon fa fa-pencil-square-o white"></i>编辑\
                                </button>\
                                <button class="btn btn-sm btn-danger" onclick="deleteClick(\':_id\');" :disabled>\
                                    <i class="ace-icon fa fa-trash-o white"></i>删除\
                                </button>\
                            </td>\
                        </tr>';

                    tempStr = tempStr.replace(/:_id/g, result[i]._id)
                        .replace(/:userId/g, result[i].userId)
                        .replace(/:fullName/g, result[i].fullName)
                        .replace(/:abbreviation/g, result[i].abbreviation)
                        .replace(/:jurisdictionId/g, result[i].jurisdictionId);
                    if (result[i].level == 0 && result[i].userId == localStorage["pernrBase"]) {
                        tempStr = tempStr.replace(/:disabled/g, "disabled");
                    } else {
                        tempStr = tempStr.replace(/:disabled/g, "");
                    }

                    html += tempStr;
                }
                $("#tbody").html(html);

                checkIfAble();

                var jurisdictions = data.data.jurisdictions;
                html = "";
                for (var i = 0; i < jurisdictions.length; i++) {
                    tempStr = '\
                        <option value=":fullName" data-id=":_id" data-abbreviation=":abbreviation">:fullName</option>';

                    tempStr = tempStr.replace(/:_id/g, jurisdictions[i]._id)
                        .replace(/:fullName/g, jurisdictions[i].fullName)
                        .replace(/:abbreviation/g, jurisdictions[i].abbreviation);

                    html += tempStr;
                }
                $("#jurisdictions").html(html);
                $("#abbreviation").val($("#jurisdictions option:selected").data("abbreviation"));
            } else if (data.status == -1) {
                layer.msg('没有权限');
            } else {
                layer.msg('查询失败');
            }
        },
        completeCb: function () {
            if (typeof cb == 'function') {
                cb();
            }
        }
    };
    request(option);
}

/**
 * 统一请求
 * @param option
 */
function request(option) {
    var layerIndexNum = layer.load();
    var defaultOption = {
        url: "/base/jurisdictionUser",
        type: "POST",
        contentType: "application/json",
        data: {
            opUserId: localStorage["pernrBase"]
        },
        dataTpye: "json",
        timeout: 2000,
        error: function (jqXHR, textStatus, errorThrown) {
            if (typeof option.errorCb == 'function') {
                option.errorCb(jqXHR, textStatus, errorThrown);
            } else {
                console.error(jqXHR, textStatus, errorThrown);
                layer.msg('接口请求出错，请检查网络');
            }
        },
        success: function (data, textStatus, jqXHR) {
            if (typeof option.successCb == 'function') {
                option.successCb(data, textStatus, jqXHR);
            } else {
                console.info(data, textStatus, jqXHR);
            }
        },
        complete: function (jqXHR, textStatus) {
            if (typeof option.completeCb == 'function') {
                option.completeCb(jqXHR, textStatus);
            } else {
                //console.log(jqXHR, textStatus);
            }
            layer.close(layerIndexNum);
        }
    };
    option.data = JSON.stringify($.extend({}, defaultOption.data, option.data));
    option = $.extend({}, defaultOption, option);

    $.ajax(option);
}

/**
 * 打开弹窗
 */
function openModal() {
    document.documentElement.style.overflow = 'hidden';
    $("#modal-form").css("display", "block");
    $(".modal-backdrop").css("display", "block");
}

/**
 * 关闭弹窗
 */
function closeModal() {
    document.documentElement.style.overflow = 'scroll';
    $("#modal-form").css("display", "none");
    $(".modal-backdrop").css("display", "none");
    cleanModal();
}

/**
 * 清理弹窗
 */
function cleanModal() {
    $("#_id").val("");
    $("#userId").val("");
    $("#jurisdictions").val($("#jurisdictions option:first").val());
    $("#abbreviation").val($("#jurisdictions option:selected").data("abbreviation"));
}

/**
 * 设置弹窗
 * @param _id
 * @param userId
 * @param fullName
 */
function setModal(_id, userId, fullName) {
    $("#_id").val(_id);
    $("#userId").val(userId);
    $("#jurisdictions").val(fullName);
    $("#abbreviation").val($("#jurisdictions option:selected").data("abbreviation"));
}

/**
 * 获取 modal 值
 * @returns {Array}
 */
function getModal() {
    if ($("#userId").val() == '') {
        layer.msg('请填写用户 ID');
        return;
    }
    return {
        _id: $("#_id").val(),
        userId: $("#userId").val(),
        jurisdictionId: $("#jurisdictions option:selected").data("id"),
        fullName: $("#jurisdictions").val(),
        abbreviation: $("#abbreviation").val()

    };
}

/**
 * 第一页
 */
function firstPage() {
    getJurisdictionUser(1, parseInt($("#pageSize").val(), 10));
}

/**
 * 前一页
 */
function prevPage() {
    getJurisdictionUser(parseInt($("#current-page").val(), 10) - 1, parseInt($("#pageSize").val(), 10));
}

/**
 * 修改页面
 */
function changePage() {
    var pageNum = parseInt($("#current-page").val(), 10);
    if (isNaN(pageNum)) {
        pageNum = 1;
    }
    getJurisdictionUser(pageNum, parseInt($("#pageSize").val(), 10));
}

/**
 * 后一页
 */
function nextPage() {
    getJurisdictionUser(parseInt($("#current-page").val(), 10) + 1, parseInt($("#pageSize").val(), 10));
}

/**
 * 最后一页
 */
function lastPage() {
    getJurisdictionUser(parseInt($("#page-count").html(), 10), parseInt($("#pageSize").val(), 10));
}

/**
 * 检查分页按钮是否可用
 */
function checkIfAble() {
    var pageNum = $("#current-page").val();
    var totalPageNum = $("#page-count").html();

    $("#first-pager").removeClass("ui-state-disabled");
    $("#prev-pager").removeClass("ui-state-disabled");
    $("#next-pager").removeClass("ui-state-disabled");
    $("#last-pager").removeClass("ui-state-disabled");
    if (pageNum <= 1) {
        $("#first-pager").addClass("ui-state-disabled");
        $("#prev-pager").addClass("ui-state-disabled");
    }
    if (pageNum >= totalPageNum) {
        $("#next-pager").addClass("ui-state-disabled");
        $("#last-pager").addClass("ui-state-disabled");
    }
}

/**
 * 修改页面记录条数
 */
function changePageSize() {
    getJurisdictionUser(1, parseInt($("#pageSize").val(), 10));
}

/**
 * 权限选择下拉框选择后设置权限缩写
 */
function changeJurisdictions() {
    $("#abbreviation").val($("#jurisdictions option:selected").data("abbreviation"));
}