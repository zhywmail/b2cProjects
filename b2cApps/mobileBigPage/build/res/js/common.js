/**
 * Created by Administrator on 2015/1/13 0013.
 */
$(function(){
    var font;
    var win_W = $(window).width();

    if(win_W>=364 && win_W<=375){
        font=23;
    }else{

        if(win_W==360 || win_W==361){

            font=22;

        }else{

            if(win_W>540){
                font=34;
            }else{
                font = Math.round(win_W / 16);
            }

        }
    }
    var HTML=document.getElementById('html');
    HTML.style.fontSize = font + 'px';

})

