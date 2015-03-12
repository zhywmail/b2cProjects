//#import Util.js
//#import $BalanceAccount:services/BalanceAccountService.jsx

(function () {

    var date = $.params["date"].replace(/-/gm,'');
    var bankName = $.params["bankName"];

        var diffCount = BalanceAccountService.getDiffListSize(bankName + "_" + date);

    out.print(diffCount.toString());

})()