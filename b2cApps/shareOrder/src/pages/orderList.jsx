(function () {
//#import doT.min.js
//#import Util.js
//#import $ShareOrder:services/ShareOrderService.jsx

    var merchantId = $.params["m"];

    var noAuditNum=ShareOrderService.getShareOrderListSize("noAudit");
    var paramScore=ShareOrderService.getShareOrderParamScore("ShareOrder_parameter");

    var pageData = {
        merchantId:merchantId,
        noAuditNum:noAuditNum,
        paramScore:paramScore
    };

    var template = $.getProgram(appMd5, "pages/orderList.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();

