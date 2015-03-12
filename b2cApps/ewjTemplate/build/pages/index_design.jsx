//#import Util.js
//#import pageService.js
//#import app.js
//#import doT.min.js

;
(function () {
//    var m = $.params.m;
//    var pageId = $.params.pageId;
//    var templateId = $.params.templateId;
//    var pageData = pageService.getMerchantPageData(m, appId, pageId);
//    var dependsOn = pageData["_dependsOn"];
//    if(dependsOn){
//        dependsOn.map(function(p){
//            var pdata = pageService.getMerchantPageData(m, appId, p);
//            pageData[p] = pdata;
//        });
//    }
//    var template =  $.getProgram(appMd5,"pages/index_design.html");
//    var fn = doT.template(template);
//    out.print(fn(pageData));
    out.print(request.getRequestURI());
})();
