$(document).ready(function () {
    var loading = undefined;
    var d=new Date(),str='';
    str +=d.getFullYear()+'-';
    if (d.getMonth()<9){str +='0'}
    str +=d.getMonth()+1+'-';
    if (d.getDate()<9){str +='0'}
    str +=d.getDate()-1;
    var bankName=$.trim($("#bankNameEN").html());

    $.get("../services/inquireDiff.jsx",{date:$.trim($("#datetime").val()),bankName:bankName},function(count){
        if (count) {
            $("#badge").html(count+" 项");
        }else{
            $("#badge").html("0 项");
        }
    });

    var initconfig = {
        bsV: "3",
        ajaxUrl: "loadBalanceList.jsx",
        data_container: ".record_list",
        pagination_container: ".pagination",
        pagination_params: ".pagination_params"
    };
    var pagination = new $.IsoneAjaxPagination(initconfig);
    var accountArgs={};
    accountArgs.date=str;
    accountArgs.bankName=bankName;
    accountArgs.table="diffRecords";
    accountArgs.inquireDiff=0;
    pagination.load(accountArgs);

    //搜索按钮点击响应
    $("#checkButton").bind("click", function () {
        $("#differenceTable").attr("class","active");
        $("#bankRecordsTable").attr("class","");
        $("#B2cRecordsTable").attr("class","");

        var accountArgs={};
        accountArgs.date=$.trim($("#datetime").val());
        accountArgs.bankName=$.trim($("#bankNameEN").html());
        accountArgs.table="diffRecords";
        accountArgs.inquireDiff=0;
        $.get("../services/inquireDiff.jsx",{date:accountArgs.date,bankName:accountArgs.bankName},function(count){
            if (count) {
                $("#badge").html(count+" 项");
            }else{
                $("#badge").html("0 项");
            }
        });
        pagination.load(accountArgs);
    });
    //只看差异按键
    $("#diffList").bind("click", function () {
        $("#differenceTable").attr("class","active");
        $("#bankRecordsTable").attr("class","");
        $("#B2cRecordsTable").attr("class","");

        if($("#badge").val()=="0 项")return;
        var accountArgs={};
        accountArgs.date=$.trim($("#datetime").val());
        accountArgs.bankName=$.trim($("#bankNameEN").html());
        accountArgs.table="diffRecords";
        accountArgs.inquireDiff=1;
        $.get("../services/inquireDiff.jsx",{date:accountArgs.date,bankName:accountArgs.bankName},function(count){
            if (count) {
                $("#badge").html(count+" 项");
            }else{
                $("#badge").html("0 项");
            }
        });
        pagination.load(accountArgs);
    });
    //对账差异标签页点击响应
    //$("#differenceTable").bind("click", function () {
    //    $("#differenceTable").attr("class","active");
    //    $("#bankRecordsTable").attr("class","");
    //    $("#B2cRecordsTable").attr("class","");
    //
    //    var accountArgs={};
    //    accountArgs.date=$.trim($("#datetime").val());
    //    accountArgs.bankName=$.trim($("#bankNameEN").html());
    //    accountArgs.table="diffRecords";
    //    pagination.load(accountArgs);
    //});
    //银行机构支付记录标签页点击响应
    $("#bankRecordsTable").bind("click", function () {
        $("#differenceTable").attr("class","");
        $("#bankRecordsTable").attr("class","active");
        $("#B2cRecordsTable").attr("class","");

        var accountArgs={};
        accountArgs.date=$.trim($("#datetime").val());
        accountArgs.bankName=$.trim($("#bankNameEN").html());
        accountArgs.table="bankRecords";
        pagination.load(accountArgs);
    });
    //商城支付记录标签页点击响应
    $("#B2cRecordsTable").bind("click", function () {
        $("#differenceTable").attr("class","");
        $("#bankRecordsTable").attr("class","");
        $("#B2cRecordsTable").attr("class","active");

        var accountArgs={};
        accountArgs.date=$.trim($("#datetime").val());
        accountArgs.bankName=$.trim($("#bankNameEN").html());
        accountArgs.table="b2cRecords";
        pagination.load(accountArgs);
    });
    //日期选择框
    $("#datetime").val(str).datetimepicker({
        format:"yyyy-mm-dd",
        language: 'zh-CN',
        autoclose: true,
        minView: "month",
        endDate:str,
        todayHighlight:true
    });
    //银行机构选择项
    $("#Crbank").bind("click", function () {
        $("#bankNameCN").html($(this).text());
        $("#bankNameEN").html($(this).attr("id"));
    });
    $("#CNUPay").bind("click", function () {
        $("#bankNameCN").html($(this).text());
        $("#bankNameEN").html($(this).attr("id"));
    });
    $("#Alipay").bind("click", function () {
        $("#bankNameCN").html($(this).text());
        $("#bankNameEN").html($(this).attr("id"));
    });
    $("#WecPay").bind("click", function () {
        $("#bankNameCN").html($(this).text());
        $("#bankNameEN").html($(this).attr("id"));
    });
    $("#Tenpay").bind("click", function () {
        $("#bankNameCN").html($(this).text());
        $("#bankNameEN").html($(this).attr("id"));
    });

    $("#upload_file_smt").bind("click", function () {
        //$(this).button('loading');
        var postData = {
            export_bankNameCN: $("#bankNameCN").text() || '',
            export_bankNameEN: $("#bankNameEN").text() || '',
            datetime: $("#datetime").val() || '',
            export_fileName: $("#export_fileName").val() || '',
            m: $("#mId").val() || ''
        };
        loading = layer.load('loading...');

        var appId = $("#appId").val();
        $.ajaxSettings['contentType'] = "application/x-www-form-urlencoded; charset=utf-8";
        $.post("/BalanceAccount/pages/exportExcel/doExport_handler.jsx", postData, function (data) {
            layer.close(loading);
            if (data.state == "ok") {
                alert(data.msg + "　您可以在【生成报表记录】中查看并下载。");
            } else {
                alert(data.msg);
            }
            //$('#upload_file_smt').button('reset');
        }, "json");
    });

    $("#excelListHistory").bind("click", function () {
        var m = $("#mId").val();
        var appId = $("#appId").val();
        $.ajax({
                url: "/BalanceAccount/pages/exportExcel/load_exportHistories_handler.jsx",
                data: {t: "DifferList_record", m: m},
                type: "post",
                dataType: 'html',
                success: function (data) {
                    var divShow = $("#excelListHistoryDiv");
                    divShow.html("");
                    divShow.append(data);
                }
            }
        );
    });

    $("#exportButton").bind("click", function () {
        var listname= $("#bankNameEN").text() +"_"+$("#datetime").val();
        $("#export_fileName").val(listname);
    });
});
