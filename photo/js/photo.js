$(window).load(function() {
    $('#loader').fadeOut("slow");

    var container = document.querySelector('#container');
    var pckry = new Packery(container, {
        // options
        "gutter": ".gutter-sizer",
        "itemSelector": ".item",
        "columnWidth": ".grid-sizer"
    });

    $('.swipebox').swipebox();

    if ($(window).height() < $('#poster').height()) {
        $('#scroll').show();
        $(window).scroll(function() {
            if ($(window).scrollTop() / $(window).width() > 0.1) {
                $('#scroll').hide();
            }
        });
    }
});
