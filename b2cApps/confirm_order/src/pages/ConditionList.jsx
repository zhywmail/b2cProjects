//#import doT.min.js
//#import pigeon.js
//#import $OrderConfirm:services/OrderConfirmService.jsx
//#import Util.js
//#import order.js

(function(){
    var merchantId = $.params['m'];
    if(!merchantId){
        merchantId="m_100";
    }

    var results = OrderConfirmService.getConditionList();

    var pageData={
        results:results,
        merchantId:merchantId
    }

    var template = $.getProgram(appMd5, "pages/ConditionList.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();