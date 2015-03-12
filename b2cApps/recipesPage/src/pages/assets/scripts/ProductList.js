$(function () {
    // side Menu
    function sideMenu(){
        $('.nav_list .title2').click(function (){
            $(this).next('.list').toggleClass('active').siblings('.list').removeClass('active');
            $(this).toggleClass('active').siblings('.title2').removeClass('active');
        });
    }
    sideMenu();

    // conditional filter
    function conditionalFilter(){
        // multi select switch
        $('.multiSelect').click(function (){
            // clear status
            $(this).parents('.filter-row').siblings('.filter-row')
                .find('*').removeClass('active');

            $('.filter-row .all').addClass('active');

            $(this).toggleClass('active').parents('.filter-conditional')
                .find('.condition-wrap').toggleClass('active');
        });

        // brand select cancel
        $('.cancelBtn').click(function (){
            $('.filter-row *').removeClass('active');
            $('.filter-row .all').addClass('active');
        });

        // bind condition item
        var parent = $('.filter-conditional');

        parent.find('.condition-list li').click(function (){
            var that = $(this);

            if (that.index() == 0){
                // if  checked 'all'
                that.addClass('active')
                    .siblings().removeClass('active');
            } else {

                // check multi select status
                // multi select model
                if (that.parents('.condition-list').siblings('.multiSelect').hasClass('active')){
                    // is selectAll now
                    if (that.siblings('.all').hasClass('active')) {
                        that.siblings('.all').removeClass('active');
                        that.toggleClass('active');
                    } else {
                        that.toggleClass('active');

                        // if only self has active
                        if (that.parents('.condition-wrap').find('li.active').length == 0) {
                            that.siblings('.all').addClass('active');
                        } else {
                        }
                    }
                } else {
                    // single select model
                    that.toggleClass('active')
                        .siblings().removeClass('active');

                    // if only self has active
                    if (that.parents('.condition-list').find('li.active').length == 0) {
                        that.siblings('.all').addClass('active');
                    } else {
                    }
                }

            }
        });

        // slide more filter
        $('.filter-more').click(function (){
            $('.filterMod .filter-row:gt(4)').toggleClass('hide');
            $(this).toggleClass('active');
        });
    }
    conditionalFilter();


    // product filter
    function productFilter(){
        $('.filter_nav .item').click(function (){
            $('.filter_nav .item').removeClass('active');
            $(this).addClass('active').toggleClass('toggle')
                .siblings('.item').removeClass('toggle');
        });
    }
    productFilter();
    
});