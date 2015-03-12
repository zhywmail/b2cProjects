//#import pigeon.js
//#import account.js
//#import $BalanceAccount:services/BalanceAlgorithm.jsx

var BalanceAccountService = (function (pigeon) {

    var listPrefix="DiffList30";
    var listSuffix="Diff";
    var listHead="DiffHead3";

    var f = {

        //生成差异表
        createBalanceAccount : function (jBank,jDate) {
            $.log("\n=============================================bank="+jBank+"\n");
            var result = BalanceAlgorithm.doAnalyse(jBank,jDate);
            if(!result){
                $.log("\n=============================================NO DATA="+"\n");
                return;
            }
            var balanceList = result.content;
            $.log("\n=============================================jDate="+jDate+"\n");
            //return;
            if(balanceList){
                $.log("\n=============================================SAVE DATA="+"\n");
                //return;
                //f.saveBalanceList(balanceList,jBank,"20150104");
                f.saveBalanceList(balanceList,jBank,jDate);
                f.saveDiffHead(result.head,jBank,jDate);
            }
        },
        //保存生成的差异表
        saveBalanceList : function(balanceList,jBank,jDate){
            var listName = jBank +"_"+ jDate;
            var count = balanceList.length;
            for (var i=0 ; i < count; i++){
                f.saveDiffToBalanceList(balanceList[i],listName);
            }
        },
        saveDiffHead : function(head,jBank,jDate){
            var listName = listHead+"_"+jBank+"_"+jDate;
            head.id=listName;
            head.createTime=(new Date()).getTime();

            $.log("\n=============================================listName="+listName+"\n");
            $.log(".......=" + JSON.stringify(head)+"\n");
            pigeon.saveObject(head.id, head);
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
            $.log("\n=============================================listName="+listId+"\n");
            //$.log(".......... listId"+listId);
            var listObjects = pigeon.getListObjects(listId, start, limit);
            if(listObjects){
                $.log("\n=============================================listObjects="+listObjects+"\n");
                return listObjects;
            }else{
                return 0;
            }
        },
        getHeadList: function (listName) {
            var id=listHead+"_"+listName;
            return pigeon.getObject(id);
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