//#import doT.min.js
//#import pigeon.js
//#import $OrderConfirm:services/OrderConfirmService.jsx
//#import Util.js

(function(){
    var merchantId = $.params['m'];
    if(!merchantId){
        merchantId="m_100";
    }
    var id= $.params['id'];

    var searchResult = OrderConfirmService.getCondition(id);
    var pageData={
        results:searchResult,
        merchantId:merchantId
    }
    var template = $.getProgram(appMd5, "pages/EditCondition.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();