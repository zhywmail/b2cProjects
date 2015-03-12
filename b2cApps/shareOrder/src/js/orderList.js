$(document).ready(function () {
    var initconfig = {
        bsV: "3",
        ajaxUrl: "load_shareOrder.jsx?m="+merchantId,
        data_container: ".record_list",
        pagination_container: ".pagination",
        pagination_params: ".pagination_params"
    };

    var pagination = new $.IsoneAjaxPagination(initconfig);
    pagination.load({});

    $("#auditList").bind("click", function () {
        var auditArgs = {};
        auditArgs.auditList="auditList";
        pagination.load(auditArgs);
    });
    $("#allList").bind("click", function () {
        var allListArgs = {};
        allListArgs.allList="allList";
        pagination.load(allListArgs);
    });

    $("#search").bind("click", function () {
        var keyword = $.trim($("#keyword").val());
        var searchArgs = {};
        searchArgs.isSearch = true;
        searchArgs.keyword = "";

        if (keyword != "") {
            searchArgs.keyword = keyword;
            pagination.load(searchArgs);
        }
    });
    $("#keyword").bind("keypress", function (event) {
        if(event.keyCode == "13")
        {
            var keyword = $.trim($("#keyword").val());
            var searchArgs = {};
            searchArgs.isSearch = true;
            searchArgs.keyword = "";

            if (keyword != "") {
                searchArgs.keyword = keyword;
                pagination.load(searchArgs);
            }
        }
    });

    $("#modifyScore").bind("click", function () {
        var score = $.trim($("#score").val());
        if(score==""){score=preScore}
        if(score==preScore ? alert("修改数值不能与原值相同") : confirm("确定修改为 "+score+" 积分/单？")){

            $.get("ModifyScore.jsx",{s:score},function(data){
                if (data == "ok") {
                    $("#scoreDesc").html("当前通过审核的晒单赠送 "+score+" 积分/单");
                    $("#score").html(score);
                    alert("修改成功！");
                }else{
                    alert(data.msg);
                }
            });
        }

    });

});
