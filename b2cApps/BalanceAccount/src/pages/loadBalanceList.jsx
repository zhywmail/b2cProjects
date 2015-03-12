(function () {
//#import doT.min.js
//#import pigeon.js
//#import Util.js
//#import DateUtil.js
//#import search.js
//#import $BalanceAccount:services/BalanceAccountService.jsx

    var datetime = $.params["date"];
    var bankNameEN = $.params["bankName"];
    var table = $.params["table"];
    var inquireDiff = $.params["inquireDiff"];
    var currentPage = $.params["page"];
    var diffList = $.params["diffList"];
    if (!currentPage) {
        currentPage = 1;
    }
    var date = datetime.replace(/-/gm,'');
    //分页参数 begin
    var recordType = "记录";
    var pageLimit = 20;
    var displayNum = 6;
    var totalRecords = 0;
    var start = (currentPage - 1) * pageLimit;
    var showList = [];
    var head=[];
    var recordsName="";

    if(bankNameEN && datetime) {

        if(table=="diffRecords"){
            recordsName=bankNameEN+"_"+date;
            //recordsName="all";
        }else if(table=="b2cRecords"){
            recordsName="b2cRec";
        }else if(table=="bankRecords"){
            recordsName=bankNameEN;
        }
    }else{
        totalRecords = 0;
    }

    $.log("\n=============================================date="+date+"\n");
    var isExist = BalanceAccountService.getBalanceListSize(bankNameEN+"_"+date);
    $.log("\n=============================================isExist="+isExist+"\n");
    //return;
    if(0==isExist){
    //if(true){
        BalanceAccountService.createBalanceAccount(bankNameEN,date);
    }
    $.log("\n=============================================inquireDiff="+inquireDiff+"\n");
    //return;
    if(inquireDiff==1) {
        totalRecords = BalanceAccountService.getDiffListSize(bankNameEN + "_" + date);
        showList = BalanceAccountService.getDiffList(bankNameEN + "_" + date, start, pageLimit);
        head = BalanceAccountService.getHeadList(bankNameEN + "_" + date);
    }else{
        totalRecords = BalanceAccountService.getBalanceListSize(bankNameEN + "_" + date);
        showList = BalanceAccountService.getBalanceList(bankNameEN + "_" + date, start, pageLimit);
        head = BalanceAccountService.getHeadList(bankNameEN + "_" + date);
    }
    $.log("\n=============================================head="+head+"\n");
    $.log("\n=============================================showList="+showList+"\n");
    $.log("\n=============================================totalRecords="+totalRecords+"\n");
    //return;
    if(!showList){
        showList=[];
    }

    //日期格式化
    for (var k = 0; k < showList.length; k++) {
        var jLog = showList[k];
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
        datetime: datetime,
        head: head,
        showList: showList
    };

    var loadUrl="pages/loadRecords/";

    if(bankNameEN && datetime) {
        if(table=="diffRecords"){
            loadUrl+="load"+bankNameEN+"BalanceList.jsxp";
        }else if(table=="b2cRecords"){
            loadUrl+="loadB2cRecords.jsxp";
        }else if(table=="bankRecords") {
            loadUrl+="load"+bankNameEN+"Records.jsxp";
        }
    }else{
        loadUrl+="loadNoRecord.jsxp";
    }
    if(totalRecords==0){
        loadUrl="pages/loadRecords/loadNoRecord.jsxp";
    }

    $.log(".......=" + JSON.stringify(head)+"\n");

    var template;
    var pageFn;
    template = $.getProgram(appMd5, loadUrl);
    pageFn = doT.template(template);
    out.print(pageFn(pageData));

})();

