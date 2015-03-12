(function () {
//#import doT.min.js
//#import Util.js


    var merchantId = $.params["m"];
    var diffList=0;

    var pageData = {
        diffList:diffList,
        merchantId:merchantId
    };


    var template = $.getProgram(appMd5, "pages/balanceList.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();
