(function () {
//#import doT.min.js
//#import pigeon.js
//#import Util.js

    var merchantId = $.params["m"];

    var interfaceRecordList = [];
    var jInterface;

    jInterface = {idIndex: '1', name: '自动审核订单', url: '/confirm_order/pages/ConditionList.jsx?m='+merchantId};
    interfaceRecordList.push(jInterface);

    var pageData = {
        merchantId: merchantId,
        interfaceRecordList: interfaceRecordList
    };

    response.sendRedirect("ConditionList.jsx?m="+merchantId);

    var template = $.getProgram(appMd5, "pages/home.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();

