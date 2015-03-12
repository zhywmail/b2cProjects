//#import Util.js
//#import merchantAccounts.js
//#import login.js
//#import doT.min.js
//#import merchant.js

var template = $.getProgram(appMd5,"pages/home.jsxp");
var pageFn = doT.template(template);
out.print(pageFn({}));