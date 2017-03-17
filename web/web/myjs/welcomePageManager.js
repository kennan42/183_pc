/**
 * 姓名：恺垣
 * 日期：2015/6/24
 * Email：kaiyuan.chen@3g2win.com
 * 用途：
 */
// 共享packages
var PACKAGES = null;

// 临时图片数组
var TEMP_IMAGES = new Array();
// 临时缩略图
var TEMP_THUMBNAILS = new Array();

jQuery(function ($) {
    bindTimeDate();
    loadPackageList($("#pageSize").val(), 1);
    bindSkip();
});

// 绑定跳过事件
function bindSkip() {
    $(".skip").change(function () {
        // 图片数量
        var imgNum = $(".parentFileBox").children("div").length;
        var select = $(this).val();
        $("#enterType").attr("disabled", false);
        if (imgNum == 1) {
            if (select == 0) {
                $("#duration").parent().hide();
            } else if (select == 1) {
                $("#duration").parent().show();
                $("#enterType").val(1).attr("disabled", true);
            }
        }
    });
}
//初始化单张图片-用户跳过只有允许选项
function ImgNumJump(Num){

}

// 绑定生效日期时间控件和失效日期时间控件
function bindTimeDate() {
    // 生效日期控件
    $('#beginDate').datepicker({
        autoclose: true,
        todayHighlight: true
    });
    // 失效日期控件
    $('#endDate').datepicker({
        autoclose: true,
        todayHighlight: true
    });

    // 生效时间控件
    $('#beginTime').timepicker({
        minuteStep: 1,
        showMeridian: false
    }).next().on(ace.click_event, function () {
        $(this).prev().focus();
    });
    // 失效时间控件
    $('#endTime').timepicker({
        minuteStep: 1,
        showMeridian: false
    }).next().on(ace.click_event, function () {
        $(this).prev().focus();
    });

    // 时间日期空间消失时动作
    $('#beginDate').datepicker().on('hide', function (e) {
        checkDateAndTime();
    });
    $('#endDate').datepicker().on('hide', function (e) {
        checkDateAndTime();
    });
    $('#beginTime').timepicker().on('hide.timepicker', function (e) {
        checkDateAndTime();
    });
    $('#endTime').timepicker().on('hide.timepicker', function (e) {
        checkDateAndTime();
    });
}

//保证日期时间组件出现在最上层
function textFoucus(event) {
    setTimeout(function () {
        $(".dropdown-menu").css("z-index", "10000");
    }, 100);
}

//检查时间和日期，保证结束时间不晚于开始时间
function checkDateAndTime() {
    var beginDate = $("#beginDate").val();
    var endDate = $("#endDate").val();
    var beginTime = $("#beginTime").val();
    var endTime = $("#endTime").val();
    if (beginDate != "" && beginTime != "" && endDate != "" && endTime != "") {
        var begin = changeTimeToUnix(beginDate + " " + beginTime);
        var end = changeTimeToUnix(endDate + " " + endTime);
        if (end < begin) {
            $("#endDate").val(beginDate);
            $("#endTime").val(beginTime);
        }
    }

}

/**
 * 将yyyy-mm-dd hh:mm:ss格式化成Unix时间戳，ms为单位
 * @param string yyyy-mm-dd hh:mm:ss格式的字符串
 * @returns {number}
 */
function changeTimeToUnix(string) {
    var f = string.split(' ', 2);
    var d = (f[0] ? f[0] : '').split('-', 3);
    var t = (f[1] ? f[1] : '').split(':', 3);
    return (new Date(
        parseInt(d[0], 10) || null,
        (parseInt(d[1], 10) || 1) - 1,
        parseInt(d[2], 10) || null,
        parseInt(t[0], 10) || null,
        parseInt(t[1], 10) || null,
        parseInt(t[2], 10) || null
    )).getTime();
}

/**
 * 将Unix时间戳格式化成 yyyy年mm月dd日<br>hh:mm
 * @param time Unix时间戳，单位ms
 * @returns {string} yyyy年mm月dd日<br>hh:mm
 */
function formatUnix(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = (date.getMonth() + 101 + '').substr(1);
    var day = (date.getDate() + 100 + '').substr(1);
    var hour = (date.getHours() + 100 + '').substr(1);
    var minute = (date.getMinutes() + 100 + '').substr(1);
    var html = year + '年' + month + '月' + day + '日<br>' + hour + ':' + minute;
    return html;
}
/**
 * 将Unix时间戳格式化成 yyyy年mm月dd日<br>hh:mm
 * @param time Unix时间戳，单位ms
 * @returns {*[]} [yyyy-mm-dd,hh:mm]
 */
function formatUnix1(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = (date.getMonth() + 101 + '').substr(1);
    var day = (date.getDate() + 100 + '').substr(1);
    var hour = date.getHours();
    var minute = (date.getMinutes() + 100 + '').substr(1);
    var dateStr = year + '-' + month + '-' + day;
    var timeStr = hour + ':' + minute;
    return [dateStr, timeStr];
}

// 限制优先级为1-9
function limitPriority() {
    var priority = $("#priority").val();
    var regExp = new RegExp("[1-9]");
    if (!regExp.test(priority)) {
        $("#priority").val(1);
    }
}

// 上传图片
function upload() {
    var file = document.getElementById("file");
    var myForm = document.getElementById("myForm");
    var imgPath = $("#file").val();
    var startIndex = imgPath.lastIndexOf("\\");
    var imgName = imgPath.substring(startIndex + 1, imgPath.length);
    if (imgPath == "") {
        $.gritter.add({
            title: '错误信息提示',
            text: '请选择上传图片！',
            class_name: 'gritter-error'
        });
        return;
    }
    //判断上传文件的后缀名
    var strExtension = imgPath.substr(imgPath.lastIndexOf('.') + 1);
    if (strExtension.toLowerCase() != 'jpg' && strExtension.toLowerCase() != 'gif'
        && strExtension.toLowerCase() != 'png' && strExtension.toLowerCase() != 'bmp') {
        $.gritter.add({
            title: '错误信息提示',
            text: '请选择图片文件',
            class_name: 'gritter-error'
        });
        return;
    }
    myForm.appendChild(file);

    var layerIndexNum = layer.load('上传中...');
    var options = {
        url: '/base/uploadWelcomeImages',
        data: {
            userId: localStorage["pernrBase"],
            fileName: imgPath,
            meetRoomId: '54dc003177f34cd80f187a47'
        },
        dataType: "json",
        contentType: "charset=UTF-8",
        timeout: 100000,
        beforeSubmit: function () {
        },
        success: function (result) {
            if (result.status == 0) {
                var image = result.data.image;
                var thumbnail = result.data.thumbnail;
                TEMP_IMAGES.push(image);
                TEMP_THUMBNAILS.push(thumbnail);
                addImages(TEMP_THUMBNAILS);

            } else if (result.status == -1) {
                layer.msg("没有权限", {time: 1000});
            }
        },
        error: function (result) {
            if (undefined != aa) {
                layer.close(aa);
            }
            layer.msg("上传失败", {time: 1000});
        },
        complete: function (jqXHR, textStatus) {
            layer.close(layerIndexNum);
        }
    };
    $(myForm).ajaxSubmit(options);
    return !1;
}


function addImages(images) {
    var scrollLeft = $(".fileBox").scrollLeft();
    $(".parentFileBox").html("");
    // 增加上层容器宽度
    $(".parentFileBox").width(images.length * 160);
    for (var i = 0, l = images.length; i < l; i++) {
        var html = '\
            <div style="float: left;margin-right: -22px;">\
              <img src="' + images[i] + '">\
              <div class="diyCancel" onclick="deleteImage(this)"></div>\
              <div style="margin-left: -35px;margin-top: 5px;">第 ' + (i + 1) + ' 张</div>\
            </div>';
        $(".parentFileBox").append(html);
    }
    $(".fileBox").scrollLeft(scrollLeft);
    // 保证最多上传5张图片
    var imgNum = $(".parentFileBox").children("div").length;
    if (imgNum > 4) {
        $("#file").prop("disabled", true);
    } else {
        $("#file").prop("disabled", false);
    }

    // 单张时显示展示时长隐藏用户跳过
    if (imgNum == 1) {
        $("#skip1").hide();
        $($("input[name=skip]")[0]).prop("checked", true);
    } else {
        $("#skip1").show();
        $("#duration").val(2);
        $("#duration").parent().hide();
    }
}

// 删除图片
function deleteImage(obj) {
    var url = $(obj).prev().attr("src");

    for (var i = 0, l = TEMP_IMAGES.length; i < l; i++) {
        if (TEMP_IMAGES[i] == url) {
            for (var j = i; j < l - 1; j++) {
                TEMP_IMAGES[j] = TEMP_IMAGES[j + 1];
                TEMP_THUMBNAILS[j] = TEMP_THUMBNAILS[j + 1];
            }
            TEMP_IMAGES.pop();
            TEMP_THUMBNAILS.pop();
            break;
        }
    }

    addImages(TEMP_THUMBNAILS);
}

// 读取列表
function loadPackageList(pageSize, pageNum) {
    var layerIndexNum = layer.load();
    $.ajax({
        type: "post",
        url: "/base/getWelcomePackagesInfo",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            userId: localStorage["pernrBase"],
            pageSize: pageSize,
            pageNum: pageNum
        }),
        success: function (data) {
            if (data.status == 0) {
                var total = data.data.count;
                var pageSize = $("#pageSize").val();
                var pages = parseInt(total / pageSize);
                if (total % pageSize != 0) {
                    pages++;
                }
                $("#page-count").html(pages);
                $("#current-page").val(pageNum);
                checkDisable();
                if (pageNum > pages) {
                    loadPackageList(pageSize, pages);
                } else {
                    $("#tbody").html("");
                    PACKAGES = data.data.packages;
                    for (var i = 0, l = PACKAGES.length; i < l; i++) {
                        var obj = PACKAGES[i];
                        var id = obj.id;
                        var images = obj.images;
                        var thumbnails = obj.thumbnails;
                        var description = obj.description;
                        var status = parseInt(obj.status);
                        var beginTime = obj.beginTime;
                        var endTime = obj.endTime;
                        var priority = obj.priority;
                        var skip = parseInt(obj.skip);
                        var duration = obj.duration;
                        var changeStatusButton = "";

                        if (id == 100000) {
                            status = '<span class="label label-success arrowed arrowed-right">启用</span>';
                            changeStatusButton = '\
                                <button class="btn btn-sm btn-danger" disabled>\
                                  <i class="ace-icon fa fa-times white"></i>\
                                  停用\
                                </button>';
                        } else if (status == 0) {
                            status = '<span class="label label-success arrowed arrowed-right">启用</span>';
                            changeStatusButton = '\
                                <button class="btn btn-sm btn-danger" onclick="disablePackage(\'' + id + '\')">\
                                  <i class="ace-icon fa fa-times white"></i>\
                                  停用\
                                </button>';
                        } else if (status == 1) {
                            status = '<span class="label label-danger arrowed-in arrowed-in-right">停用</span>';
                            changeStatusButton = '\
                                <button class="btn btn-sm btn-success" onclick="enablePackage(\'' + id + '\')">\
                                  <i class="ace-icon fa fa-times white"></i>\
                                  启用\
                                </button>';
                        } else {
                            status = 'error';
                            changeStatusButton = 'error';
                        }
                        if (skip == 0) {
                            skip = '允许';
                        } else if (skip == 1) {
                            skip = '不允许';
                        } else {
                            skip = 'error';
                        }

                        beginTime = formatUnix(beginTime);
                        endTime = formatUnix(endTime);
                        var html = '\
                          <tr id="option">\
                            <td valign="middle">' + id + '</td>\
                              <td><img src="' + thumbnails[0] + '"></td>\
                              <td>' + description + '</td>\
                              <td>' + status + '</td>\
                            <td>' + beginTime + '</td>\
                            <td>' + endTime + '</td>\
                            <td>' + priority + '</td>\
                            <td>' + skip + '</td>\
                            <td>\
                            <h4 class="pink">\
                              <button class="btn btn-sm btn-primary" onclick="editPackage(\'' + id + '\');">\
                              <i class="ace-icon fa fa-upload white"></i>\
                              编辑\
                              </button>\
                              ' + changeStatusButton + '\
                              </h4>\
                            </td>\
                          </tr>';
                        $("#tbody").append(html);
                    }
                }
            } else if (data.status == -1) {
                layer.msg("没有权限", {time: 1000});
            }
        },
        complete: function (jqXHR, textStatus) {
            layer.close(layerIndexNum);
        }
    });
}

/**
 * 停用图片包
 * @param id 图片包ID
 */
function disablePackage(id) {
    changePackageStatus(id, 1);
}

/**
 * 启用图片包
 * @param id 图片包ID
 */
function enablePackage(id) {
    changePackageStatus(id, 0);
}
/**
 * 变更包状态
 * @param id 图片包ID
 * @param status 图片包状态 0表示启用1表示停用
 * @param successMsg 成功提示
 * @param errorMsg 失败提示
 */
function changePackageStatus(id, status) {
    //scroll(0,0);
    status = parseInt(status);
    if (isNaN(status) || (status != 0 && status != 1)) {
        layer.msg("设置错误", {time: 1000});
        return false;
    }

    // 成功消息
    var successMsg = "";
    // 失败消息
    var errorMsg = "";
    // 确认窗消息
    var confirmMsg = "";

    if (status == 0) {
        successMsg = "启用成功";
        errorMsg = "启用成功";
        confirmMsg = "是否启用该图片包？";
    } else if (status == 1) {
        successMsg = "停用成功";
        errorMsg = "停用失败";
        confirmMsg = "是否停用该图片包？";
    }

    layer.confirm(confirmMsg, {
        btn: ['是', '否'], //按钮
        shade: false  // 不显示遮罩
    }, function () {
        var layerIndexNum = layer.load();
        $.ajax({
            type: "post",
            url: "/base/changeWelcomePackageInfo",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                userId: localStorage["pernrBase"],
                packageId: id,
                status: status
            }),
            success: function (data) {
                if (data.status == 0) {
                    if (data.data.status == 0) {
                        layer.msg(successMsg, {time: 1000});
                    } else {
                        layer.msg(errorMsg, {time: 1000});
                    }
                    loadPackageList($("#pageSize").val(), $("#current-page").val());
                } else if (data.status == -1) {
                    layer.msg("没有权限", {time: 1000});
                }
            },
            complete: function (jqXHR, textStatus) {
                layer.close(layerIndexNum);
            }
        });
    }, function () {
        layer.close();
    });
}

// 打开弹窗
function openModal() {
    document.documentElement.style.overflow = 'hidden';
    $("#modal-form").css("display", "block");
    $(".modal-backdrop").css("display", "block");
}

// 关闭弹窗
function closeModal() {
    document.documentElement.style.overflow = 'scroll';
    $("#modal-form").css("display", "none");
    $(".modal-backdrop").css("display", "none");
}

// 设置弹窗中的数据
function setModal(obj) {
    //console.log(obj);
    var id = obj.id;
    var images = obj.images;
    var thumbnails = obj.thumbnails;
    var description = obj.description;
    var beginTime = obj.beginTime;
    var endTime = obj.endTime;
    var priority = obj.priority;
    var skip = parseInt(obj.skip);
    var duration = obj.duration;
    var enterType = obj.enterType;
    //console.log(images.length);
    if( images.length == 1 ){
        skip = 0;
        $("#skip1").hide();
    }else{
        $("#skip1").show();
    }
    $("#packageId").val(id);
    $("#description").val(description);
    $("#priority").val(priority);
    $("#duration").val(duration);
    $("#enterType").val(enterType)
        .attr("disabled", false);
    $(".parentFileBox").html("");

    $("#duration").parent().hide();
    $("#file").prop("disabled", false);
    addImages(thumbnails);
    if (skip == 0) {
        $($("input[name=skip]")[0]).prop("checked", true);
        $("#duration").parent().hide();
    } else if (skip == 1) {
        $($("input[name=skip]")[1]).prop("checked", true);
        if ($(".parentFileBox").children("div").length == 1) {
            $("#duration").parent().show();
        }
        //
        $("#enterType").val(1).attr("disabled", true);
    }
    if (beginTime == "") {
        beginTime = ["", ""];
    } else {
        beginTime = formatUnix1(beginTime);
    }

    if (endTime == "") {
        endTime = ["", ""];
    } else {
        endTime = formatUnix1(endTime);
    }

    $("#beginDate").val(beginTime[0]);
    $("#beginTime").val(beginTime[1]);
    $("#endDate").val(endTime[0]);
    $("#endTime").val(endTime[1]);

    TEMP_IMAGES = images.slice();
    TEMP_THUMBNAILS = thumbnails.slice();

    if (id == 100000) {
        $("#priority").prop("disabled", true);
        $("#beginDate").prop("disabled", true);
        $("#beginTime").prop("disabled", true);
        $("#endDate").prop("disabled", true);
        $("#endTime").prop("disabled", true);
    } else {
        $("#priority").prop("disabled", false);
        $("#beginDate").prop("disabled", false);
        $("#beginTime").prop("disabled", false);
        $("#endDate").prop("disabled", false);
        $("#endTime").prop("disabled", false);
    }
}

/**
 * 编辑图片包
 * @param id 图片包ID
 */
function editPackage(id) {
    for (var i = 0, l = PACKAGES.length; i < l; i++) {
        var obj = PACKAGES[i];
        if (obj.id == id) {
            setModal(obj);
            openModal();
            break;
        }
    }
}

// 新建图片包
function createPackage() {
    var obj = new Object();
    obj.id = '';
    obj.images = [];
    obj.thumbnails = [];
    obj.description = '';
    obj.beginTime = new Date().getTime();
    obj.endTime = new Date().getTime();
    obj.priority = 1;
    obj.skip = 0;
    obj.duration = 2;
    obj.enterType = 0;
    setModal(obj);
    openModal();
}

// 编辑后保存
function savePackage() {
    var userId = localStorage["pernrBase"];
    var id = $("#packageId").val();
    var images = TEMP_IMAGES;
    var thumbnails = TEMP_THUMBNAILS;
    var description = $("#description").val();
    var priority = $("#priority").val();
    var skip = $("input[name=skip]:checked").val();
    var duration = $("#duration").val();
    var enterType = $("#enterType").val();
    var beginDate = $("#beginDate").val();
    var beginTime = $("#beginTime").val();
    var endDate = $("#endDate").val();
    var endTime = $("#endTime").val();

    var descriptionTemp = description.replace(/ /g, "");
    if (descriptionTemp == "") {
        layer.msg("请输入图片包描述", {time: 1000});
        return;
    }
    if (beginDate == "") {
        layer.msg("请选择生效日期", {time: 1000});
        return;
    }
    if (beginTime == "") {
        layer.msg("请选择生效时间", {time: 1000});
        return;
    }
    if (endDate == "") {
        layer.msg("请选择失效日期", {time: 1000});
        return;
    }
    if (endTime == "") {
        layer.msg("请选择失效时间", {time: 1000});
        return;
    }
    if (endDate == beginDate && endTime == beginTime) {
        layer.msg("请选择输入正确的失效时间", {time: 1000});
        return;
    }
    if (priority == "") {
        layer.msg("请输入优先级", {time: 1000});
        return;
    }
    var regExp = new RegExp("[1-9]");
    if (id != 100000 && !regExp.test(priority)) {
        layer.msg("请输入正确的优先级", {time: 1000});
        return;
    } else if (id == 100000) {
        priority = 0;
    }
    if (duration == null) {
        layer.msg("请选择展示时长", {time: 1000});
        return;
    }
    regExp = new RegExp("^[1-9]\d*|0$|-1");
    if (duration != null && !regExp.test(duration)) {
        layer.msg("请正确选择的展示时长", {time: 1000});
        return;
    }
    if (enterType == null) {
        layer.msg("请选择进入方式", {time: 1000});
        return;
    }
    if (TEMP_IMAGES.length <= 0 || TEMP_THUMBNAILS.length <= 0) {
        layer.msg("请输入上传图片", {time: 1000});
        return;
    }
    beginTime = changeTimeToUnix(beginDate + " " + beginTime);
    endTime = changeTimeToUnix(endDate + " " + endTime);
    if (endTime < beginTime) {
        layer.msg("请选择正确的失效日期和时间", {time: 1000});
        return;
    }
    var jsonParam = {
        userId: userId,
        packageId: id,
        images: images,
        thumbnails: thumbnails,
        description: description,
        beginTime: beginTime,
        endTime: endTime,
        priority: priority,
        skip: skip,
        duration: duration,
        enterType: enterType
    };
    var url = "";
    if (id == "") {
        url = "/base/createWelcomePackage";
    } else {
        url = "/base/editWelcomePackage";
    }
    var layerIndexNum = layer.load();
    $.ajax({
        type: "post",
        url: url,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(jsonParam),
        success: function (data) {
            if (data.status == 0) {
                if (data.data.status == 0) {
                    layer.msg("保存成功", {time: 1000});
                    loadPackageList($("#pageSize").val(), 1);
                    closeModal();
                } else {
                    layer.msg("保存失败", {time: 1000});
                }
            } else if (data.status == -1) {
                layer.msg("没有权限", {time: 1000});
            }
        },
        complete: function (jqXHR, textStatus) {
            layer.close(layerIndexNum);
        }
    });
}

// 第一页
function firstPage() {
    loadPackageList($("#pageSize").val(), 1);
}
// 最后一页
function lastPage() {
    loadPackageList($("#pageSize").val(), parseInt($("#page-count").html()));
}
// 前一页
function prevPage() {
    var pageNum = parseInt($("#current-page").val()) - 1;
    if (pageNum >= 1) {
        loadPackageList($("#pageSize").val(), pageNum);
    }
}
// 后一页
function nextPage() {
    var pageNum = parseInt($("#current-page").val()) + 1;
    var pageCount = parseInt($("#page-count").html());
    if (pageNum <= pageCount) {
        loadPackageList($("#pageSize").val(), pageNum);
    }
}
// 修改每页显示条数
function changePageSize() {
    loadPackageList($("#pageSize").val(), $("#current-page").val());
}
// 跳转到指定页
function changePage() {
    loadPackageList($("#pageSize").val(), $("#current-page").val());
}
// 检查 首页尾页上一页下一页是否可用
function checkDisable() {
    var pageNum = $("#current-page").val();
    var totalpages = $("#page-count").html();

    $("#first-pager").removeClass("ui-state-disabled");
    $("#prev-pager").removeClass("ui-state-disabled");
    $("#next-pager").removeClass("ui-state-disabled");
    $("#last-pager").removeClass("ui-state-disabled");
    if (pageNum <= 1) {
        $("#first-pager").addClass("ui-state-disabled");
        $("#prev-pager").addClass("ui-state-disabled");
    }
    if (pageNum == totalpages) {
        $("#next-pager").addClass("ui-state-disabled");
        $("#last-pager").addClass("ui-state-disabled");
    }
}

