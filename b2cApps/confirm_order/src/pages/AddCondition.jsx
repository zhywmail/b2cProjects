//#import doT.min.js
//#import pigeon.js
//#import Util.js

(function(){
    var merchantId = $.params['m'];
    if(!merchantId){
        merchantId="m_100";
    }

    var searchResult = "";
    var template = $.getProgram(appMd5, "pages/AddCondition.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(searchResult));
})();