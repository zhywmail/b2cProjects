//#import Util.js
//#import merchantAccounts.js
//#import login.js
//#import doT.min.js
//#import merchant.js
//#import merchantDomain.js

var m = $.params.m;
var merId = $.params.merId;
var domains = $.params.domains;

var msg = "修改成功！"
try{
    MerchantDomainService.setDomains(merId,domains);
}
catch(e){
    msg = "修改失败!";
}
var merchant = MerchantService.getMerchant(merId);

var template = $.getProgram(appMd5,"setDomains.jsxp");
var pageData = {merId:merId,name:merchant.name_cn,m:m,msg:msg};
var pageFn = doT.template(template);
out.print(pageFn(pageData));