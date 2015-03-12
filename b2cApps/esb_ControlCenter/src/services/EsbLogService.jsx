//#import Util.js
//#import pigeon.js
//#import jobs.js

var EsbLogService = (function (pigeon) {
    var prefix = "esbLog";

    var f = {
        addLog: function (type, objId, serviceId, serialNumber, logContent) {
            var logNum = pigeon.getId("crcEsbLog");
            var logId = prefix + "_Log_" + logNum;
            var curTime = (new Date()).getTime();
            $.log("@@@@@@@@@@@@@2 objId:" + objId);
            var log = {
                id: logId,
                type: type,
                objId: objId,
                serviceId: serviceId,
                serialNumber: serialNumber,
                content: logContent,
                createTime: curTime
            };

            pigeon.saveObject(logId, log);
            var listId = prefix + "_" + type + "_logs";
            var key = pigeon.getRevertComparableString(logNum, 10);
            pigeon.addToList(listId, key, logId);

            f.buildIndex(logId);
        },
        getLog: function (logId) {
            return pigeon.getObject(logId);
        },
        getLogs: function (type, start, limit) {
            var listId = prefix + "_" + type + "_logs";
            return pigeon.getListObjects(listId, start, limit);
        },
        getLogsListSize: function (type) {
            var listId = prefix + "_" + type + "_logs";
            return pigeon.getListSize(listId);
        },
        buildIndex: function (id) {
            var jobPageId = "services/EsbLogBuildIndex.jsx";
            JobsService.runNow("esb_ControlCenter", jobPageId, {ids: id});
        }

    };
    return f;
})($S);