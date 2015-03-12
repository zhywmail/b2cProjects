//#import Util.js
//#import merchantAccounts.js
//#import login.js
//#import doT.min.js
//#import merchant.js
//#import merchantDomain.js
(function(){
    var uid = LoginService.getBackEndLoginUserId();
    var merchants = null;
    if(uid=='u_0'){
        $.log("before search。\n");
        var result = MerchantService.search(0,5000,null,"col_merchant_all",null,null,null,null,null,null,null,null);
        $.log("after search。\n");
        merchants = result.merchants;
    }
    else{
        merchants = MerchantAccountService.getMerchantsOfAdmin(uid);
    }
    var m = $.params.m;
    if(!m){
        m = $.getDefaultMerchantId();
    }
    var merchants = merchants.map(function(merchant){
        var domains =MerchantDomainService.getDomains(merchant.objId);
        if(!domains){
            domains = "";
        }
        return {
            id:merchant.objId,
            name_cn:merchant.name_cn,
            domains:domains
        }
    });
    $.log("merchants......\n");
    var template = $.getProgram(appMd5,"home.jsxp");
    var pageData = {merchants:merchants,m:m};
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();

