//#import pigeon.js
//#import account.js
//#import PaymentUtil.js
//#import payment.js
//#import DateUtil.js
//#import realPayRec.js


var BalanceAlgorithm = (function (pigeon) {

    var f = {

        //获取商城日结账目
        getB2cAccount : function(jBank,jDate,from,number) {
            var payInterfaceId = f.getPayIdByBankName(jBank);
            var dateStr_yyMMdd = jDate;
            var isExist = f.doGetB2cAccount(payInterfaceId,dateStr_yyMMdd,from,number);
            if(isExist.length>0){
                return isExist;
            }else{
                return false;
            }
        },
        //执行商城日结账目获取
        doGetB2cAccount : function(payInterfaceId,dateStr_yyMMdd,from,number){
            try {
                var B2cAccount = RealPayRecordService.getPaidRecs(payInterfaceId, dateStr_yyMMdd, from, number);
            }catch (e){
                B2cAccount = [];
            }
            return B2cAccount;
        },
        //获取商城日结账目数量
        getB2cAccountCount : function(jBank,jDate) {
            var payInterfaceId = f.getPayIdByBankName(jBank);
            var dateStr_yyMMdd = jDate;
            //$.log("\n=============================================payInterfaceId="+payInterfaceId+"\n");
            //$.log("\n=============================================dateStr_yyMMdd="+dateStr_yyMMdd+"\n");
            try {
                var B2cAccountCount = RealPayRecordService.getPaidRecsCount(payInterfaceId, dateStr_yyMMdd);
            }catch (e){
                B2cAccountCount = 0;
            }
            return B2cAccountCount;
        },
        //通过银行名称获取商城id
        getPayIdByBankName : function(jBank){
            var payInterfaceId;
            if("CNUPay"==jBank){
                payInterfaceId="payi_103";
            }else if("Crbank"==jBank){
                payInterfaceId="payi_138";
            }else if("WecPay"==jBank){
                payInterfaceId="payi_103";
            }else if("Alipay"==jBank){
                payInterfaceId="payi_103";
            }else if("Tenpay"==jBank){
                payInterfaceId="payi_103";
            }else{
                payInterfaceId= null;
            }
            return payInterfaceId;
        },
        //获取银行机构日结账目
        getBankAccount : function(jBank,jDate){
            var result={};
            var content=[];
            var head={};
            var array=[];
            var i = 0;
            if("CNUPay"==jBank){
                try {
                    var CNUcontent = f.doGetBankAccount('payi_103', jDate, '', 'head_merchant', '');
                }catch (e){
                    CNUcontent=[];
                }
                if (CNUcontent.length>0) {
                    array = CNUcontent[0].split("|");
                    head.PurCnt=array[2];
                    head.PurAmt= f.formatNumber(array[3]);
                    head.FeeAmt= f.formatNumber(array[4]);
                    head.RefCnt= array[5];
                    head.RefAmt= f.formatNumber(array[6]);
                    head.RefCancelCnt= array[7];
                    head.RefCancelAmt= f.formatNumber(array[8]);
                    head.LiqAmt= f.formatNumber(array[9]);
                    for ( i = 1; i < CNUcontent.length; i++) {
                        var CNUcont={};
                        array = CNUcontent[i].split("|");
                        CNUcont.outerId=array[12];
                        CNUcont.accountMoney= f.formatNumber((array[4]/100-array[11]));
                        CNUcont.paidTime=array[9];
                        CNUcont.paidFee= f.formatNumber(array[11]);
                        CNUcont.isDiff=2;
                        content.push(CNUcont);
                    }
                }
            }else if("Crbank"==jBank){
                try {
                    var Crbcontent = f.doGetBankAccount('payi_138', jDate, '', 'm_100', 'GBK');
                }catch (e){
                    Crbcontent=[]
                }
                if (Crbcontent.length>0) {
                    array = Crbcontent[0].split(",");
                    head.totalMoney=array[0];
                    head.successAccount=array[1];
                    head.failAccount=array[2];
                    head.processAccount=array[3];
                    for ( i = 1; i < Crbcontent.length; i++) {
                        var Crbcont={};
                        array = Crbcontent[i].split(",");
                        Crbcont.outerId=array[0];
                        Crbcont.accountMoney= f.formatNumber(array[8]-array[9]);
                        Crbcont.paidTime=array[4];
                        Crbcont.paidFee= f.formatNumber(array[9]);
                        Crbcont.isDiff=2;
                        content.push(Crbcont);
                    }
                }
            }else if("WecPay"==jBank){
                var Weccontent = f.doGetBankAccount('payi_133',jDate, '', 'head_merchant', '');
            }else if("Alipay"==jBank){
                var Alicontent = f.doGetBankAccount('payi_100',jDate, '', 'head_merchant', '');
            }else if("Tenpay"==jBank){
                var Tencontent = f.doGetBankAccount('payi_103',jDate, '', 'head_merchant', '');
            }else{

            }
            //$.log("...................="+JSON.stringify(content));
            result.content=content;
            result.head=head;
            if(content.length>0 && head){
                return result;
            }else{
                return false;
            }
        },
        doGetBankAccount : function(payID,date,fileType,merchantID,codeType){
            //传支付方式ID,对账日期,对账文件类型,商家ID,文件编码
            return PaymentUtilService.getAccountFileContent(payID,date,fileType,merchantID,codeType);
        },
        //生成差异表
        doAnalyse : function (jBank,jDate) {
            var balanceList = [];
            var payInterfaceId = f.getPayIdByBankName(jBank);
            var payInterface = PaymentService.getPayInterface(payInterfaceId);
            var lowerLimit = PaymentService.getPaymentLowerLimit(payInterface)||"0";
            var expenseRation = PaymentService.getExpenseRation(payInterface)||"0";
            //$.log("\n ..........payInterfaceId:"+payInterfaceId);
            //$.log("\n ..........lowerLimit:"+lowerLimit);
            //$.log("\n ..........expenseRation:"+expenseRation);
            //if(true)return;
            var b2cAccountCount= f.getB2cAccountCount(jBank,jDate);
            var b2cAccount = f.getB2cAccount(jBank,jDate,0,b2cAccountCount);
            var result = f.getBankAccount(jBank,jDate);
            var bankAccount = result.content;
            if(bankAccount && b2cAccount) {
                for (var i = 0; i < b2cAccountCount; i++) {
                    var diff = {};
                    diff.isDiff = 1;
                    diff.b2cOuterID = b2cAccount[i].outerId;
                    diff.b2cOrderIds = b2cAccount[i].orderAliasCodes;
                    diff.b2cPaidTime = DateUtil.getShortDate(b2cAccount[i].paidTime).replace(/-/gm,'');
                    diff.b2cPayID = f.getPayIdName(b2cAccount[i].payInterfaceId);
                    diff.b2cPaidMoneyAmount = f.formatNumber(b2cAccount[i].paidMoneyAmount / 100);
                    //$.log("\n ..........b2cPaidMoneyAmount:"+diff.b2cPaidMoneyAmount);
                    var payFee = f.formatNumber(diff.b2cPaidMoneyAmount * expenseRation / 100);
                    //return;
                    if (parseInt(payFee * 100) >= parseInt(lowerLimit)) {
                        diff.b2cPaidFee = payFee;
                    } else {
                        diff.b2cPaidFee = f.formatNumber(lowerLimit / 100);
                    }
                    diff.b2cAccountMoney = f.formatNumber(diff.b2cPaidMoneyAmount - diff.b2cPaidFee);

                    for (var j = 1; j < bankAccount.length; j++) {
                        if (diff.b2cOuterID == bankAccount[j].outerId) {
                            bankAccount[j].isDiff = 0;
                            diff.bankOuterID = bankAccount[j].outerId;
                            diff.bankPaidTime = bankAccount[j].paidTime;
                            diff.bankAccountMoney = bankAccount[j].accountMoney;
                            diff.bankPaidFee = bankAccount[j].paidFee;
                            if (diff.b2cAccountMoney == diff.bankAccountMoney) {
                                diff.isDiff = 0;
                            } else {
                                diff.isDiff = 3;
                            }
                        }
                    }

                    balanceList.push(diff);
                }
                for (var k = 1; k < bankAccount.length; k++) {
                    var diffb = {};
                    if (2 == bankAccount[k].isDiff) {
                        diffb.isDiff = 2;
                        diffb.b2cOuterID = "-";
                        diffb.b2cOrderIds = "-";
                        diffb.b2cPaidTime = "-";
                        diffb.b2cPayID = "-";
                        diffb.b2cPaidMoneyAmount = "-";
                        diffb.b2cPaidFee = "-";
                        diffb.b2cAccountMoney = "-";
                        diffb.bankOuterID = bankAccount[k].outerId;
                        diffb.bankPaidTime = bankAccount[k].paidTime;
                        diffb.bankAccountMoney = bankAccount[k].accountMoney;
                        diffb.bankPaidFee = bankAccount[k].paidFee;
                        balanceList.push(diffb);
                    }
                }
            }
            for ( i=0 ;i < balanceList.length ;i++) {
                $.log(".......=" + JSON.stringify(balanceList[i])+"\n");
            }
            $.log(".......=" + JSON.stringify(result.head)+"\n");
            //return false;
            result.content=balanceList;
            if(balanceList.length>0){
                return result;
            }else{
                return false;
            }
        },
        formatNumber : function(number){
            return parseFloat(number).toFixed(2);
        },
        getPayIdName : function(payID){
            switch (payID){
                case "payi_103": return "中国电子银联支付";break;
                case "payi_138": return "华润E支付";break;
                default : return "-";
            }

        }

    }

    return f;

})($S);