//#import Util.js
//#import login.js
//#import sysArgument.js

(function(processor){
    processor.on("all",function(pageData,dataIds,elems){
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
        setPageDataProperty(pageData,"alreadyLogin",alreadyLogin);
        setPageDataProperty(pageData,"loggedUserName",loggedUserName + "");

        var includeCommonCss = true,requestURI = request.getRequestURI() + "";
        if(requestURI == "/" || requestURI == "/index.jsp" || requestURI == "/product_list.jsp" || requestURI == "/product.jsp" || $.params['templateId'] == "pages/index_design.html" || requestURI.indexOf("viewPage") > -1){
            includeCommonCss = false;
        }

        var isEdit = false;
        if(requestURI == "/appEditor/handlers/getPageData.jsx"){
            isEdit = true;
        }

        var pageType = $.params.ptype;
        if(!pageType){
            pageType = "general";
        }
        var step = $.params.step;
        if(!step){
            step = "1";
        }

        var searchKeyword = $.params.keyword;
        if(!searchKeyword){
            searchKeyword = "";
        }

        var normalWebSite = SysArgumentService.getSysArgumentStringValue("head_merchant","col_sysargument","webUrl");
        var sslWebSite = SysArgumentService.getSysArgumentStringValue("head_merchant","col_sysargument","webUrlHttps");

        var isHttps = false;
        if(requestURI.indexOf("/lost_password.jsp") > -1){
            isHttps = true;
        }

        setPageDataProperty(pageData,"includeCommonCss",includeCommonCss);
        setPageDataProperty(pageData,"isEdit",isEdit);
        setPageDataProperty(pageData,"pageType", pageType);//general,login,shopping
        setPageDataProperty(pageData,"step",step);
        setPageDataProperty(pageData,"searchKeyword",searchKeyword);
        setPageDataProperty(pageData,"normalWebSite",normalWebSite);
        setPageDataProperty(pageData,"sslWebSite",sslWebSite);
        setPageDataProperty(pageData,"isHttps",isHttps);
    });
})(dataProcessor);