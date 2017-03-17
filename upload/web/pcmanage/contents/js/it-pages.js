
//container 容器，count 总页数 pageindex 当前页数
function setPage(container, count, pageindex) {
    var container = container;
    var count = count;
    var pageindex = pageindex;
    var a = [];
    //总页数少于10 全部显示,大于10 显示前3 后3 中间3 其余....
    if (pageindex == 1) {
        a[a.length] = "<li class=\"paginate_button previous disabled\" aria-controls=\"sample-table-2\" tabindex=\"0\" id=\"sample-table-2_previous\"><a href=\"#\">首页</a></li>";
    } else {
        a[a.length] = "<li class=\"paginate_button previous \" aria-controls=\"sample-table-2\" tabindex=\"0\" id=\"sample-table-2_previous\"><a class='pageIndex' href=\"#\">前一页</a></li>";
    }
    function setPageList() {
        if (pageindex == i) {
            a[a.length] = "<li class=\"paginate_button active\" aria-controls=\"sample-table-2\" tabindex=\"0\"><a class='pageIndex' href=\"#\">"+i+"</a></li>";
        } else {
            a[a.length] = "<li class=\"paginate_button\" aria-controls=\"sample-table-2\" tabindex=\"0\"><a class='pageIndex' href=\"#\">"+i+"</a></li>";
        }
    }
    //总页数小于10
    if (count <= 10) {
        for (var i = 1; i <= count; i++) {
            setPageList();
        }
    }
    //总页数大于10页
    else {
        if (pageindex <= 4) {
            for (var i = 1; i <= 5; i++) {
                setPageList();
            }
            a[a.length] = "<li class=\"paginate_button\" aria-controls=\"sample-table-2\" tabindex=\"0\"><a href=\"#\">...</a></li><li class=\"paginate_button\" aria-controls=\"sample-table-2\" tabindex=\"0\"><a  class='pageIndex' href=\"#\">"+count+"</a></li>";
        } else if (pageindex >= count - 3) {
            a[a.length] = "<li class=\"paginate_button\" aria-controls=\"sample-table-2\" tabindex=\"0\"><a class='pageIndex' href=\"#\">1</a></li><li class=\"paginate_button\" aria-controls=\"sample-table-2\" tabindex=\"0\"><a href=\"#\">...</a></li>";
            for (var i = count - 4; i <= count; i++) {
                setPageList();
            }
        }
        else { //当前页在中间部分
            a[a.length] = "<li class=\"paginate_button\" aria-controls=\"sample-table-2\" tabindex=\"0\"><a class='pageIndex' href=\"#\">1</a></li><li class=\"paginate_button\" aria-controls=\"sample-table-2\" tabindex=\"0\"><a href=\"#\">...</a></li>";
            for (var i = pageindex - 2; i <= pageindex + 2; i++) {
                setPageList();
            }
            a[a.length] = "<li class=\"paginate_button\" aria-controls=\"sample-table-2\" tabindex=\"0\"><a class='pageIndex' href=\"#\">"+count+"</a></li>";
        }
    }
    if (pageindex == count) {
        a[a.length] = "<li class=\"paginate_button next disabled\" aria-controls=\"sample-table-2\" tabindex=\"0\" id=\"sample-table-2_next\"><a  href=\"#\">尾页</a></li>";
    } else {
        a[a.length] = "<li class=\"paginate_button next\" aria-controls=\"sample-table-2\" tabindex=\"0\" id=\"sample-table-2_next\"><a href=\"#\" class='pageIndex'>后一页</a></li>";
    }
    container.innerHTML = a.join("");
    //事件点击
    var pageClick = function() {
        var oAlink = container.getElementsByTagName("a");
        var inx = pageindex; //初始的页码
        oAlink[0].onclick = function() { //点击上一页
            if (inx == 1) {
                return false;
            }
            inx--;
            $("#currentpage").val(inx);
            setPage(container, count, inx);
            return false;
        }
        for (var i = 1; i < oAlink.length - 1; i++) { //点击页码
            oAlink[i].onclick = function() {
                inx = parseInt(this.innerHTML);
                $("#currentpage").val(inx);
                setPage(container, count, inx);
                return false;
            }
        }
        oAlink[oAlink.length - 1].onclick = function() { //点击下一页
            if (inx == count) {
                return false;
            }
            inx++;
            $("#currentpage").val(inx);
            setPage(container, count, inx);
            return false;
        }
    } ()
}

