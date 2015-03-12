/* Created by Qianglong Mo 2015 */

var vipCard = {
    applyVipCard: function (){
        var stepCanGo = false;
        var btnValidationAbleFlag = true;


        $('#getValidationCode').click(function (){
            var time = 45;

            if (btnValidationAbleFlag == true){
                // TODO: ajax get validation code here;

                btnValidationAbleFlag = false;
                $(this).addClass('disabled');
                $('#getValidationCode').text('再次获取验证码(' + (time--) +')');

                var timer = setInterval(function (){
                    if (time == -1){
                        clearInterval(timer);
                        $('#getValidationCode').text('获取验证码').removeClass('disabled');
                        btnValidationAbleFlag = true;
                    } else {
                        $('#getValidationCode').text('再次获取验证码(' + (time--) +')');
                    }
                }, 1000);
            } else {
            }
        });

        // go step2
        $('.btnStepTo2').click(function (){
            // TODO: form validation;

            // validation
            if (true) {
                stepCanGo = true;

                if (stepCanGo === true) {
                    $('.vipCardApplyStep01').hide();
                    $('.vipCardApplyStep02').fadeIn();
                    stepCanGo = false;
                }
            } else {
                return false;
            }
        });

        // go step3
        $('.btnStepTo3').click(function (){

            // validation
            if (true) {
                stepCanGo = true;

                if (stepCanGo === true) {
                    $('.vipCardApplyStep02').hide();
                    $('.vipCardApplyStep03').fadeIn();
                    stepCanGo = false;
                }
            } else {
                return false;
            }
        });




        // bind radio group
        $('.vipCardApplyStep .formRadioGroup .formRadioWrap').click(function (){
            $(this).addClass('active')
                .siblings('.formRadioWrap').removeClass('active')
                .siblings('input[type="hidden"]').val($(this).find('.formRadio').attr('data-value'));

        });
    },
    bindVipCard: function (){
        $('.btnStepTo2').click(function (){
            // Todo: ajax validation

            if (true) {
                $('.vipCardBindStep01').hide();
                $('.vipCardBindStep03').fadeIn();
            } else {

            }
        });
    }
};

var authorize = {
    authorizePhone: function (){
        $('.bindAuthorize01 .btnStepTo2').click(function (){
            // Todo: ajax validation

            if (true) {
                $(this).parents('.bindAuthorize01').hide();
                $('.bindAuthorize02').fadeIn();
            } else {

            }
        });
    }
};

$(function (){
    // vip card page
    vipCard.applyVipCard();
    vipCard.bindVipCard();

    // authorize page
    authorize.authorizePhone();
});