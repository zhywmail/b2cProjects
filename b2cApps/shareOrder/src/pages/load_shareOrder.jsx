(function () {
//#import doT.min.js
//#import pigeon.js
//#import Util.js
//#import DateUtil.js
//#import search.js
//#import $ShareOrder:services/ShareOrderService.jsx


    var merchantId = $.params["m"];
    var isSearch = $.params["isSearch"];
    var keyword = $.params["keyword"];
    var auditList = $.params["auditList"];
    var allList = $.params["allList"];
    var currentPage = $.params["page"];
    if (!currentPage) {
        currentPage = 1;
    }

    //分页参数 begin
    var recordType = "晒单";
    var pageLimit = 5;
    var displayNum = 6;
    var totalRecords = 0;
    var start = (currentPage - 1) * pageLimit;
    var shareOrderList = [];
    if (isSearch) {
        //进入搜索
        if(keyword == ""){
            totalRecords = 0;
        }else{
            totalRecords = 1;
            shareOrderList.push(ShareOrderService.getSOrder(keyword));
        }

    } else if("auditList"==auditList){
        totalRecords = ShareOrderService.getShareOrderListSize("noAudit");
        shareOrderList = ShareOrderService.getShareOrderList("noAudit", start, pageLimit);
    }else if("allList"==allList){
        totalRecords = ShareOrderService.getShareOrderListSize("all");
        shareOrderList = ShareOrderService.getShareOrderList("all", start, pageLimit);
    }else{
        totalRecords = ShareOrderService.getShareOrderListSize("all");
        shareOrderList = ShareOrderService.getShareOrderList("all", start, pageLimit);
    }

    //日期格式化
    for (var k = 0; k < shareOrderList.length; k++) {
        var jLog = shareOrderList[k];
        jLog.formatCreateTime = DateUtil.getLongDate(jLog.createTime);
    }


    var totalPages = (totalRecords + pageLimit - 1) / pageLimit;
    var pageParams = {
        recordType: recordType,
        pageLimit: pageLimit,
        displayNum: displayNum,
        totalRecords: totalRecords,
        totalPages: totalPages,
        currentPage: currentPage
    };


    var pageData = {
        merchantId: merchantId,
        pageParams: pageParams,
        shareOrderList: shareOrderList
    };

    var template = $.getProgram(appMd5, "pages/load_shareOrder.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();

