$(this).ready(function () {
    $.get("/components/header.html", function (data) {
        $("body").prepend(data);
        $(".book-upload").css("display", "none");
        $(".logo").click(function () {
            location.href = "MainPage";
        });
    });

    $.get("/components/footer.html", function (data) {
        $("body").append(data);
    });

    $(".list-image").css("height", $(".preview-image").height());

    $(".demo").click(function () {
        $(".preview-image").css(
            "background-image",
            $("." + this.classList[1]).css("background-image")
        );
    });

    //demo image function
    $(".product-image").ready(function () {
        var n = $(".demo-image .demo").length;
        for (let i = 1; i <= n; i++) {
            var url = 'url("/assets/images/book-1-' + i + '.png")';
            var select = ".demo-image .demo-" + i;
            $(select).css("background-image", url);
        }
        $(".show-image").css(
            "background-image",
            $(".demo-image .demo-1").css("background-image")
        );
        $(".demo-image .demo").click(function () {
            $(".show-image").css("background-image", $(this).css("background-image"));
        });
    });
    //quantity increase and reduce function
    $("#increase").click(function () {
        $("#quantity").val(Number($("#quantity").val()) + 1);
    });
    $("#reduce").click(function () {
        $("#quantity").val(function () {
            if (Number($("#quantity").val()) < 2) return 1;
            else return Number($("#quantity").val()) - 1;
        });
    });

    $(".view-seller-page").click(function (e) {
        e.preventDefault();
        location.href = "SellerInfoBuyer";
    });

    $(".show-fb").click(function (e) {
        e.preventDefault();
        $(".full-feedback").toggle();
    });

    $(".disabled > .wrapper").hide();
    $("button.buy_product-button").click(function () {
        $(".disabled").css("display", "flex");
        $(".buy-product").show();
        $("body").css("overflow", "hidden");
    });
    $(".buy-product #buy-cancel").click(function () {
        $(".disabled > .wrapper").hide();
        $(".disabled").css("display", "none");
        $("body").css("overflow", "scroll");
    });
    $(".buy-product #buy-confirm").click(function () {
        $(".buy-product").hide();
        $(".cash").show();
    });
    $(".cash #buy-cancel").click(function () {
        $(".disabled > .wrapper").hide();
        $(".disabled").css("display", "none");
        $("body").css("overflow", "scroll");
    });
    $(".cash #buy-confirm").click(function () {
        $(".disabled > .wrapper").hide();
        $(".success").show();
    });
    $(".success #buy-done").click(function () {
        $(".disabled > .wrapper").hide();
        $(".disabled").css("display", "none");
        $("body").css("overflow", "scroll");
    });
    $(".cash form").css("opacity", "0");
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            checkboxes.forEach(function (c) {
                if (c !== checkbox) c.checked = false;
            });
            if ($(".cash .left").has(this).length) {
                $(".cash .left form").css("opacity", "1");
                $(".cash .right form").css("opacity", "0");
            } else {
                $(".cash .left form").css("opacity", "0");
                $(".cash .right form").css("opacity", "1");
            }
        });
    });

    function displayStar() {
        const starInputs = document.querySelectorAll('i[name="star"]');

        $.get(
            "Product/DisplayRating", { "productID": 300000001 },
            function (response) {
                for (let i = response.numberOfStars - 1;
                    i < starInputs.length; i++) {
                    starInputs[i].className = "fa fa-star-o";
                }

                for (let i = response.numberOfStars - 1;
                    i >= 0; i--) {
                    starInputs[i].className = "fa fa-star";
                }
            }
        )
    }

    displayStar();

    /*var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    alert(id);

    //$(".show-image").attr("src")

    $(".show-image").css("background-image", "url(" +
        '/assets/images/book-3.png' + ")");*/
});
