//#import pigeon.js
//#import Util.js
//#import excel.js
//#import DateUtil.js
//#import $BalanceAccount:services/BalanceAccountService.jsx

(function () {
    var m = $.params["m"];
    var fileName = $.params["export_fileName"];
    var bankNameCN = $.params["export_bankNameCN"];
    var bankNameEN = $.params["export_bankNameEN"];
    var date = $.params["startdatetime"];
    var datetime =date.replace(/-/gm,"");
    var titles = [
        {"index":  "0", "columnWidth": "17", "field": "b2cOuterID", "title": "支付单号"},
        {"index":  "1", "columnWidth": "10", "field": "b2cPaidTime", "title": "支付时间"},
        {"index":  "2", "columnWidth": "18", "field": "b2cPayID", "title": "支付方式"},
        {"index":  "3", "columnWidth": "15", "field": "b2cPaidMoneyAmount", "title": "应收"+bankNameCN+"金额"},
        {"index":  "4", "columnWidth": "16", "field": "b2cPaidFee", "title": "应付"+bankNameCN+"手续费"},
        {"index":  "5", "columnWidth": "15", "field": "b2cAccountMoney", "title": bankNameCN+"到账金额"},
        {"index":  "6", "columnWidth": "20", "field": "bankOuterID", "title": "支付单号"},
        {"index":  "7", "columnWidth": "10", "field": "bankPaidTime", "title": "划账日期"},
        {"index":  "8", "columnWidth": "15", "field": "bankAccountMoney", "title": "应付万家"},
        {"index":  "9", "columnWidth": "15", "field": "bankPaidFee", "title": "留存的手续费"},
        {"index": "10", "columnWidth": "20", "field": "isDiff", "title": "差异"}
    ];

    var result = {};

    try {
        if (fileName=="") {
            fileName= bankNameEN+"_"+date;
        }
        //return;
        var totalRecords = BalanceAccountService.getBalanceListSize(bankNameEN+"_"+datetime);
        var exportList = BalanceAccountService.getBalanceList(bankNameEN+"_"+datetime, 0, totalRecords);
        if (exportList.length == 0) {
            result.state = "error";
            result.msg = "没相应数据导出！";
            out.print(JSON.stringify(result));
            return;
        }

        for(var i=0; i<exportList.length; i++){
            var diff= exportList[i].isDiff;
            exportList[i].isDiff=(!diff?"无误":(diff==2?"商城无记录":(diff==3?"金额错误":"账单无记录")))
        }
        //for(var i=0; i<exportList.length; i++){
        //    $.log("==="+JSON.stringify(exportList[i])+"\n");
        //}
        //$.log("=======================fileName="+fileName+"\n");
        //return;
        var export_file_type = "DifferList_record";
        var s = Excel.createExcelList(m, fileName, export_file_type, titles, exportList);
        if (s == "ok") {
            result.state = "ok";
            result.msg = "生成成功！";
        } else {
            result.state = "error";
            result.msg = "生成失败！";
        }
        out.print(JSON.stringify(result));
    } catch (e) {
        result.state = "error";
        result.msg = "异常:" + e;
        out.print(JSON.stringify(result));
    }
}());