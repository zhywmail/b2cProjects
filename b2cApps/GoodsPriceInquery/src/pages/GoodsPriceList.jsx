(function () {
//#import doT.min.js
//#import Util.js

    var merchantId = $.params["m"];

    var pageData = {
        merchantId:merchantId
    };

    var template = $.getProgram(appMd5, "pages/GoodsPriceInquery.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();
