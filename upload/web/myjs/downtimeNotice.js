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
    getNotice(1, parseInt($("#pageSize").val(), 10));
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
 */
function editClick(_id) {
    setModal(_id);
    openModal();
}

/**
 * 弹窗保存按钮响应
 */
function saveClick() {
    var value = getModal();
    if (value._id == null || value._id == '') {
        addDowntimeNotice(value, function () {
            closeModal();
            getNotice(parseInt($("#current-page").val(), 10), parseInt($("#pageSize").val(), 10));
        });
    } else {
        updateDowntimeNotice(value, function () {
            closeModal();
            getNotice(parseInt($("#current-page").val(), 10), parseInt($("#pageSize").val(), 10));
        });
    }
}

/**
 * 删除按钮响应
 * @param _id
 */
function deleteClick(_id) {
    layer.confirm('确认删除本条停机公告？', {
        btn: ['确认', '取消']
    }, function () {
        if ($("#tbody").find("tr").length == 1) {
            deleteJurisdictionUser(_id, function () {
                var pageCount = parseInt($("#page-count").html(), 10) - 1;
                if (pageCount < 1) {
                    pageCount = 1
                }
                getNotice(pageCount, parseInt($("#pageSize").val(), 10));
            });
        } else {
            deleteJurisdictionUser(_id, function () {
                getNotice(parseInt($("#current-page").val(), 10), parseInt($("#pageSize").val(), 10));
            });
        }
    }, function () {

    });
}

/**
 * 增加停机公告
 *
 * @param value
 * @param cb
 */
function addDowntimeNotice(value, cb) {
    var option = {
        data: {
            op: "add",
            title: value.title,
            content: value.content,
            interfaceArr: value.interfaceArr,
            beginTime: value.beginTime,
            endTime: value.endTime,
            contactArr: value.contactArr
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
 * 修改停机公告
 * @param value
 * @param cb
 */
function updateDowntimeNotice(value, cb) {
    var option = {
        data: {
            op: "update",
            _id: value._id,
            title: value.title,
            content: value.content,
            interfaceArr: value.interfaceArr,
            beginTime: value.beginTime,
            endTime: value.endTime,
            contactArr: value.contactArr
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
 * 删除停机公告
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
 * 分页获取停机公告
 * @param pageNum
 * @param pageSize
 * @param cb
 */
function getNotice(pageNum, pageSize, cb) {
    var option = {
        data: {
            op: "getByPage",
            pageNum: pageNum,
            pageSize: pageSize
        },
        successCb: function (data) {
            if (data.status == 0) {
                var result = data.data.result;
                window.sessionStorage.setItem('noticeList', JSON.stringify(result));

                var totalPageNum = Math.ceil(data.data.count / pageSize);

                // 如果出现当前页大于所有页数的情况，就请求新的数据
                if (pageNum > totalPageNum && totalPageNum > 0) {
                    getNotice(totalPageNum, pageSize, cb);
                    return;
                }

                $("#current-page").val(pageNum);
                $("#page-count").html(totalPageNum);
                var html = '';
                for (var i = 0; i < result.length; i++) {
                    var tempStr = '\
                        <tr>\
                            <td>:title</td>\
                            <td>:content</td>\
                            <td>:interfaceArr</td>\
                            <td>:beginTime</td>\
                            <td>:endTime</td>\
                            <td>:contactArr</td>\
                            <td>\
                                <button class="btn btn-sm btn-primary"\
                                    onclick="editClick(\':_id\');">\
                                    <i class="ace-icon fa fa-pencil-square-o white"></i>编辑\
                                </button>\
                                <button class="btn btn-sm btn-danger" onclick="deleteClick(\':_id\');">\
                                    <i class="ace-icon fa fa-trash-o white"></i>删除\
                                </button>\
                            </td>\
                        </tr>';

                    var interfaceArr = result[i].interfaceArr;
                    var interfaceHtml = '';
                    for (var j in interfaceArr) {
                        interfaceHtml += interfaceArr[j].description + " (" + interfaceArr[j].name + ")<br>";
                    }

                    var contactArr = result[i].contactArr || [];
                    var contactHtml = '';
                    for (var j in contactArr) {
                        j = parseInt(j, 10);
                        contactHtml += '\
                            联系人' + (j + 1) + ' : ' + contactArr[j].name + '<br>\
                            联系方式' + (j + 1) + ' : ' + contactArr[j].phone + '<br>\
                        ';
                    }

                    tempStr = tempStr.replace(/:_id/g, result[i]._id)
                        .replace(/:title/g, result[i].title)
                        .replace(/:content/g, result[i].content)
                        .replace(/:interfaceArr/g, interfaceHtml)
                        .replace(/:beginTime/g, unixTimeToString(result[i].beginTime))
                        .replace(/:endTime/g, unixTimeToString(result[i].endTime))
                        .replace(/:contactArr/g, contactHtml);

                    html += tempStr;
                }
                $("#tbody").html(html);

                checkIfAble();

                var allInterfaceArr = data.data.interfaceArray;
                var allInterfaceHtml = '';
                for (var j in allInterfaceArr) {
                    var temp = '\
                        <div>\
                            <input type="checkbox" value=":id" name="ifList" \
                            data-description=":description" data-name=":name"> :description (:name)\
                        </div>';

                    temp = temp.replace(/:id/g, allInterfaceArr[j]._id)
                        .replace(/:description/g, allInterfaceArr[j].description)
                        .replace(/:name/g, allInterfaceArr[j].name);

                    allInterfaceHtml += temp;
                }
                $("#ifList").html(allInterfaceHtml);
                $("#beginTime").val(unixTimeToString(new Date().getTime()));
                $("#endTime").val(unixTimeToString(new Date().getTime() + 24 * 3600 * 1000));
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
        url: "/base/downtimeNotice",
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
                //console.error(jqXHR, textStatus, errorThrown);
                layer.msg('接口请求出错，请检查网络');
            }
        },
        success: function (data, textStatus, jqXHR) {
            if (typeof option.successCb == 'function') {
                option.successCb(data, textStatus, jqXHR);
            } else {
                //console.info(data, textStatus, jqXHR);
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
    $("#title").val("");
    $("#content").val("");
    $("#beginTime").val(unixTimeToString(new Date().getTime()));
    $("#endTime").val(unixTimeToString(new Date().getTime() + 24 * 3600 * 1000));
    $("#contact-name1").val("");
    $("#contact-phone1").val("");
    $("#contact-name2").val("");
    $("#contact-phone2").val("");
    $("input[name=ifList]").each(function (index, item) {
        $(item).prop('checked', false);
    });
}

/**
 * 设置弹窗
 * @param _id
 */
function setModal(_id) {
    var noticeList = window.sessionStorage.getItem('noticeList');
    noticeList = JSON.parse(noticeList);

    for (var i in noticeList) {
        if (noticeList[i]._id == _id) {
            $("#_id").val(_id);
            $("#title").val(noticeList[i].title);
            $("#content").val(noticeList[i].content);
            $("#beginTime").val(unixTimeToString(noticeList[i].beginTime));
            $("#endTime").val(unixTimeToString(noticeList[i].endTime));

            for (var j in noticeList[i].contactArr) {
                j = parseInt(j, 10);
                if (noticeList[i].contactArr[j]) {
                    $("#contact-name" + (j + 1)).val(noticeList[i].contactArr[j].name);
                    $("#contact-phone" + (j + 1)).val(noticeList[i].contactArr[j].phone);
                }
            }

            for (var j in noticeList[i].interfaceArr) {
                $('input[value=' + noticeList[i].interfaceArr[j]._id + ']').prop('checked', true);
            }

            break;
        }
    }
}

/**
 * 获取 modal 值
 * @returns {Array}
 */
function getModal() {
    var interfaceArr = [];
    $("input[name=ifList]").each(function (index, item) {
        if ($(item).prop('checked') == true) {
            interfaceArr.push({
                _id: $(item).val(),
                description: $(item).data('description'),
                name: $(item).data('name')
            })
        }
    });
    if (interfaceArr.length == 0) {
        layer.msg('请选择接口');
        return;
    }

    var beginTime = new Date($("#beginTime").val().replace(/-/g,"/"));
    if (beginTime == 'Invalid Date') {
        layer.msg('请填写正确的开始时间');
        return;
    }
    beginTime = beginTime.getTime();

    var endTime = new Date($("#endTime").val().replace(/-/g,"/"));
    if (beginTime == 'Invalid Date') {
        layer.msg('请填写正确的结束时间');
        return;
    }
    endTime = endTime.getTime();

    if(endTime < beginTime) {
        layer.msg('结束时间必须大于开始时间');
        return;
    }

    var contactArr = [];
    for (var i = 1; $("#contact-name" + i).length > 0; i++) {
        var name = $("#contact-name" + i).val();
        var phone = $("#contact-phone" + i).val();
        if (name.trim().length && phone.trim().length) {
            contactArr.push({
                name: name,
                phone: phone
            });
        }
    }

    return {
        _id: $("#_id").val(),
        title: $("#title").val(),
        content: $("#content").val(),
        interfaceArr: interfaceArr,
        beginTime: beginTime,
        endTime: endTime,
        contactArr: contactArr
    };
}

/**
 * 第一页
 */
function firstPage() {
    if (parseInt($("#current-page").val(), 10) <= 1) {
        return;
    }
    getNotice(1, parseInt($("#pageSize").val(), 10));
}

/**
 * 前一页
 */
function prevPage() {
    if (parseInt($("#current-page").val(), 10) - 1 < 1) {
        return;
    }
    getNotice(parseInt($("#current-page").val(), 10) - 1, parseInt($("#pageSize").val(), 10));
}

/**
 * 修改页面
 */
function changePage() {
    var pageNum = parseInt($("#current-page").val(), 10);
    if (isNaN(pageNum)) {
        pageNum = 1;
    }
    getNotice(pageNum, parseInt($("#pageSize").val(), 10));
}

/**
 * 后一页
 */
function nextPage() {
    if (parseInt($("#current-page").val(), 10) + 1 > parseInt($("#page-count").html(), 10)) {
        return;
    }
    getNotice(parseInt($("#current-page").val(), 10) + 1, parseInt($("#pageSize").val(), 10));
}

/**
 * 最后一页
 */
function lastPage() {
    if (parseInt($("#current-page").val(), 10) >= parseInt($("#page-count").html(), 10)) {
        return;
    }
    getNotice(parseInt($("#page-count").html(), 10), parseInt($("#pageSize").val(), 10));
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
    getNotice(1, parseInt($("#pageSize").val(), 10));
}

/**
 * Unix时间戳转换成 yyyy-MM-dd HH:mm
 *
 * @param time
 * @returns {string}
 */
function unixTimeToString(time) {
    var date = new Date(time);
    var str = date.getFullYear() + "-" +
        (date.getMonth() + 101 + '').substr(1) + "-" +
        (date.getDate() + 100 + "").substr(1) + " " +
        (date.getHours() + 100 + "").substr(1) + ":" +
        (date.getMinutes() + 100 + "").substr(1);
    return str;
}