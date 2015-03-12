(function () {
//#import doT.min.js
//#import pigeon.js
//#import Util.js
//#import DateUtil.js
//#import search.js

    var currentPage = $.params["page"];
    var GoodsList=[];
    if (!currentPage) {
        currentPage = 1;
    }
    //分页参数 begin
    var recordType = "记录";
    var pageLimit = 20;
    var displayNum = 6;
    var totalRecords = 0;
    var start = (currentPage - 1) * pageLimit;

    GoodsList = [];

    $.log("\n=============================================totalRecords="+totalRecords+"\n");
    if(!GoodsList){
        GoodsList=[];
    }

    //日期格式化
    for (var k = 0; k < GoodsList.length; k++) {
        var jLog = GoodsList[k];
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
        pageParams: pageParams,
        GoodsList: GoodsList
    };

    var loadUrl="pages/loadGoodsPriceList.jsxp";

    var template;
    var pageFn;
    template = $.getProgram(appMd5, loadUrl);
    pageFn = doT.template(template);
    out.print(pageFn(pageData));

})();

