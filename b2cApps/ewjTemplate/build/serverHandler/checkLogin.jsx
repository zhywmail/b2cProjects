//#import Util.js
//#import login.js

;(function(){
    try{
        var user = LoginService.getFrontendUser();
        var alreadyLogin = false,loggedUserName = "";
        if(user!=null){
            alreadyLogin = true;
            if(user.realName){
                loggedUserName = user.realName;
            }else if(user.loginId){
                loggedUserName = user.loginId;
            }else{
                loggedUserName = user.id;
            }
        }

        var ret = {
            state:true,
            alreadyLogin:alreadyLogin,
            loggedUserName:loggedUserName + ""
        }
        out.print(JSON.stringify(ret));
    }catch(e){
        var ret = {
            state:false,
            alreadyLogin:false
        }
        out.print(JSON.stringify(ret));
    }
})();