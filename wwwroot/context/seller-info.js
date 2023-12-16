$(this).ready(function () {
    $(".product-item").click(function (e) {
        e.preventDefault();
        location.href = "Product";
    });

    $(".seller-contact").click(function (e) {
        e.preventDefault();
        location.href = "/Chat";
    });
    //pagination function
    $(".pagination p:not(.arrow)").click(function () {
        $(".pagination > .active").toggleClass("active");
        $(this).toggleClass("active");

        $(".product > .active").toggleClass("active");
        var x = Number($(this).text()[1]);
        var y = ".product .page-" + x;
        $(y).toggleClass("active");
    });
    //pagination forward
    $(".pagination p.arrow.forward").click(function () {
        if ($(".pagination > .active").next()[0] !== $(this)[0]) {
            var x = $(".pagination > .active");
            $(".pagination > .active").next().toggleClass("active");
            x.toggleClass("active");

            var y = $(".product > .active");
            $(".product > .active").next().toggleClass("active");
            y.toggleClass("active");
        }
    });
    //pagination back
    $(".pagination p.arrow.back").click(function () {
        if ($(".pagination > .active").prev()[0] !== $(this)[0]) {
            var x = $(".pagination .active");
            $(".pagination .active").prev().toggleClass("active");
            x.toggleClass("active");

            var y = $(".product > .active");
            $(".product > .active").prev().toggleClass("active");
            y.toggleClass("active");
        }
    });

    $(".about img").click(function (e) {
        e.preventDefault();
        location.href = "SellerInfoBuyer";
    });
});
