//#import Util.js
//#import login.js
//#import $EsbControlCenter:services/EsbLogService.jsx

(function () {
    var userId = LoginService.getBackEndLoginUserId();
    if (!userId || userId.trim() != "u_0") {
        out.print("noprivilege");
        return;
    }

    var type = $.params["type"];
    if (!type) {
        out.print("type is null");
        return;
    }

    //重建索引
    var logList = EsbLogService.getLogs(type, 0, -1);

    var total = 0;
    for (var j = 0; j < logList.length; j++) {
        var jLog = logList[j];

        if (jLog) {
            EsbLogService.buildIndex(jLog.id);
            total++;
        }

    }

    out.print("ok...total=" + total);


})();