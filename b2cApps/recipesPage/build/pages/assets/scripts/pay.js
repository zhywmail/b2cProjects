$(function (){
    // toggle order detail
    var timer = null;

    $('.toggleDetail').mouseover(function (){
        clearTimeout(timer);
        $('.orderDetail').show();
    });

    $('.toggleDetail').mouseout(function (){
        clearTimeout(timer);
        timer = setTimeout(function (){
            $('.orderDetail').hide();
        }, 200);
    });

    $('.orderDetail').mouseover(function (){
        clearTimeout(timer);
        $('.orderDetail').show();
    });

    $('.orderDetail').mouseout(function (){
        timer = setTimeout(function (){
            $('.orderDetail').hide();
        }, 200);
    });

    // init default bank;
    $('.bankChooseValue').val('huarun');

    $('.formRadio').click(function (){
        $('.bankChooseValue').val($(this).attr('data-bank'));
        $(this).parents('.payWayItem').addClass('active')
            .siblings().removeClass('active');
    });
});