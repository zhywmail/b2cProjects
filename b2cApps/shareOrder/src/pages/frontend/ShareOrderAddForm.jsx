(function () {
//#import doT.min.js
//#import Util.js

    var merchantId = $.params["m"];
    var productId = $.params["productId"];

    var pageData = {
        merchantId: merchantId,
        productId: productId
    };

    var template = $.getProgram(appMd5, "pages/frontend/ShareOrderAddForm.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();

