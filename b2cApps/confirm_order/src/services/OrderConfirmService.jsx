//#import pigeon.js

var OrderConfirmService = (function (pigeon) {
    var objPrefix = "OrderConfirm";
    var listPrefix = "OrderConfirm";

    var f = {
        addCondition : function(jCondition){
            //out.print("Function addSku start...<br>")
            var id = objPrefix + "_OrderConfirm";
            jCondition.id=id;
            f.saveCondition(jCondition);
            return id;
        },
        saveCondition : function(jSku) {
            pigeon.saveObject(jSku.id, jSku);
        },
        getCondition : function(id){
            return pigeon.getObject(id);
        },
        getConditionList: function () {
            var id = objPrefix + "_OrderConfirm";
            return pigeon.getObject(id);
        },
        clearCondition:function (){
            var id = objPrefix + "_OrderConfirm";
            pigeon.saveObject(id, null);
        },
        addLog:function(orderId, logType, oldValue, newValue, desc){
            var log = {};
            log.ip = "系统IP";//可以写死
            log.userId = "u_sys";//修改人ID,系统
            log.realName = "系统";//修改人名称
            log.time = new Date().getTime() + "";//修改时间
            log.description = desc;//描述
            log.oldValue = oldValue;//旧状态名称
            log.newValue = newValue;//新状态名称
            OrderLogService.addOrderLog(orderId,log,logType);//OLT107 代表状态改变日志
        }
    };
    return f;
})($S);