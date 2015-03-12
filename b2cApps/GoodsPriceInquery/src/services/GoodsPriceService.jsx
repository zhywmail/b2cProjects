//#import pigeon.js
//#import account.js

var GoodsPriceService = (function (pigeon) {

    var listPrefix="GPIList";
    var objPrefix="GPid";

    var f = {

        //保存生成的差异表
        saveGoodsPriceList : function(skuid,sku){
            var listName = listPrefix +"_"+ skuid;
            var count = balanceList.length;
            for (var i=0 ; i < count; i++){
                f.saveDiffToBalanceList(balanceList[i],listName);
            }
        },
        //差异对象存入差异表单List
        saveDiffToBalanceList : function(jDiff,lisName) {

            var id = lisName + "_" + pigeon.getId(lisName);  //生成一个差异id
            var createTime = (new Date()).getTime();

            jDiff.id = id;
            jDiff.createTime = createTime;

            var listName = f.getListName(lisName);

            f.saveDiff(jDiff);

            if(jDiff.isDiff!=0){
                f.add2List(listName+"_"+listSuffix, jDiff);
            }
            f.add2List(listName, jDiff);
        },
        saveDiff: function (jDiff) {
            pigeon.saveObject(jDiff.id, jDiff);
        },

        //返回差异list全名
        getListName: function (objId) {
            return listPrefix + "_" + objId;
        },
        //获得差异list数组
        getBalanceList: function (listName, start, limit) {
            var listId = f.getListName(listName);
            //$.log(".......... listId"+listId);
            var listObjects = pigeon.getListObjects(listId, start, limit);
            if(listObjects){
                return listObjects;
            }else{
                return 0;
            }
        },
        //获得差异list数量
        getBalanceListSize: function (listName) {
            var listId = f.getListName(listName);
            var listSize = pigeon.getListSize(listId);
            if(listSize){
                return listSize;
            }else{
                return 0;
            }
        },
        //将差异加入差异list
        add2List: function (listName, jDiffer) {
            var id = jDiffer.id;
            var createTime = jDiffer.createTime;
            var key = pigeon.getRevertComparableString(createTime / 1000, 11);
            pigeon.addToList(listName, key, id);
        },

        getDiffList : function(listName, start, limit){
            return f.getBalanceList(listName+"_"+listSuffix, start, limit);
        },
        getDiffListSize : function(listName){
            return f.getBalanceListSize(listName+"_"+listSuffix);
        }
    }


    return f;

})($S);