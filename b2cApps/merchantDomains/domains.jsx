//#import Util.js
//#import merchantAccounts.js
//#import login.js
//#import doT.min.js
//#import merchant.js
//#import merchantDomain.js
(function(){
    var uid = LoginService.getBackEndLoginUserId();
    var merchants = null;
    var merId = $.params.merId; //需要操作的商家Id,比如说我是平台，但我要操作某个商户的数据

    var m = $.params.m;
    if(!m){
        m = $.getDefaultMerchantId();
    }

    var merchant = MerchantService.getMerchant(merId);

    var domains =MerchantDomainService.getDomains(merId);

    var template = $.getProgram(appMd5,"domains.jsxp");
    var pageData = {merId:merId,name:merchant.name_cn,m:m,domains:domains};
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();

