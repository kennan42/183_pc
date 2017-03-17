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
    getInterfase(1, parseInt($("#pageSize").val(), 10));
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
 * @param description
 * @param name
 */
function editClick(_id, description, name) {
    setModal(_id, description, name);
    openModal();
}

/**
 * 弹窗保存按钮响应
 */
function saveClick() {
    var value = getModal();
    if (value._id == null || value._id == '') {
        addJurisdiction(value.description, value.name, function () {
            closeModal();
            getInterfase(parseInt($("#current-page").val(), 10), parseInt($("#pageSize").val(), 10));
        });
    } else {
        updateJurisdiction(value._id, value.description, value.name, function () {
            closeModal();
            getInterfase(parseInt($("#current-page").val(), 10), parseInt($("#pageSize").val(), 10));
        });
    }
}

/**
 * 删除按钮响应
 * @param _id
 */
function deleteClick(_id) {
    layer.confirm('确认删除本接口？', {
        btn: ['确认', '取消']
    }, function () {
        if ($("#tbody").find("tr").length == 1) {
            deleteJurisdiction(_id, function () {
                var pageCount = parseInt($("#page-count").html(), 10) - 1;
                if (pageCount < 1) {
                    pageCount = 1
                }
                getInterfase(pageCount, parseInt($("#pageSize").val(), 10));
            });
        } else {
            deleteJurisdiction(_id, function () {
                getInterfase(parseInt($("#current-page").val(), 10), parseInt($("#pageSize").val(), 10));
            });
        }
    }, function () {

    });

}

/**
 * 增加接口
 * @param description
 * @param name
 * @param cb
 */
function addJurisdiction(description, name, cb) {
    var option = {
        data: {
            op: "add",
            description: description,
            name: name
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
 * 修改接口
 * @param _id
 * @param description
 * @param name
 * @param cb
 */
function updateJurisdiction(_id, description, name, cb) {
    var option = {
        data: {
            op: "update",
            _id: _id,
            description: description,
            name: name
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
 * 删除接口
 * @param _id
 * @param cb
 */
function deleteJurisdiction(_id, cb) {
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
 * 分页获取接口
 * @param pageNum
 * @param pageSize
 * @param cb
 */
function getInterfase(pageNum, pageSize, cb) {
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
                    getInterfase(totalPageNum, pageSize, cb);
                    return;
                }

                $("#current-page").val(pageNum);
                $("#page-count").html(totalPageNum);
                var html = '';
                for (var i = 0; i < result.length; i++) {
                    var tempStr = '\
                        <tr>\
                            <td>:_id</td>\
                            <td>:description</td>\
                            <td>:name</td>\
                            <td>\
                                <button class="btn btn-sm btn-primary" onclick="editClick(\':_id\',\':description\',\':name\');">\
                                    <i class="ace-icon fa fa-pencil-square-o white"></i>编辑\
                                </button>\
                                <button class="btn btn-sm btn-danger" onclick="deleteClick(\':_id\');">\
                                    <i class="ace-icon fa fa-trash-o white"></i>删除\
                                </button>\
                            </td>\
                        </tr>';

                    tempStr = tempStr.replace(/:_id/g, result[i]._id)
                        .replace(/:description/g, result[i].description)
                        .replace(/:name/g, result[i].name);

                    html += tempStr;
                }
                $("#tbody").html(html);

                checkIfAble();

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
        url: "/base/downtimeInterface",
        type: "POST",
        contentType: "application/json",
        data: {
            userId: localStorage["pernrBase"]
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
    $("#description").val("");
    $("#name").val("")
        .attr("disabled", false)
        .attr("readonly", false);
}

/**
 * 设置弹窗
 * @param _id
 * @param description
 * @param name
 */
function setModal(_id, description, name) {
    $("#_id").val(_id);
    $("#description").val(description);
    $("#name").val(name)
        .attr("disabled", true)
        .attr("readonly", true);
}

/**
 * 获取 modal 值
 * @returns {Array}
 */
function getModal() {
    if ($("#description").val() == '') {
        layer.msg('请填写借口描述');
        return;
    }

    if ($("#name").val() == '') {
        layer.msg('请填写接口名称');
        return;
    }

    return {
        _id: $("#_id").val(),
        description: $("#description").val(),
        name: $("#name").val()
    };
}

/**
 * 第一页
 */
function firstPage() {
    if (parseInt($("#current-page").val(), 10) <= 1) {
        return;
    }
    getInterfase(1, parseInt($("#pageSize").val(), 10));
}

/**
 * 前一页
 */
function prevPage() {
    if (parseInt($("#current-page").val(), 10) - 1 < 1) {
        return;
    }
    getInterfase(parseInt($("#current-page").val(), 10) - 1, parseInt($("#pageSize").val(), 10));
}

/**
 * 修改页面
 */
function changePage() {
    var pageNum = parseInt($("#current-page").val(), 10);
    if (isNaN(pageNum)) {
        pageNum = 1;
    }
    getInterfase(pageNum, parseInt($("#pageSize").val(), 10));
}

/**
 * 后一页
 */
function nextPage() {
    if (parseInt($("#current-page").val(), 10) + 1 > parseInt($("#page-count").html(), 10)) {
        return;
    }
    getInterfase(parseInt($("#current-page").val(), 10) + 1, parseInt($("#pageSize").val(), 10));
}

/**
 * 最后一页
 */
function lastPage() {
    if (parseInt($("#current-page").val(), 10) >= parseInt($("#page-count").html(), 10)) {
        return;
    }
    getInterfase(parseInt($("#page-count").html(), 10), parseInt($("#pageSize").val(), 10));
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
    getInterfase(1, parseInt($("#pageSize").val(), 10));
}