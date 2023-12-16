$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var userID = urlParams.get('user');
    var type = 0; // 0: buyer, 1: seller, (2: admin)
    if (userID == null) {
        userID = urlParams.get('seller'); // ideal condition
        type = 1;
    }

    $.get("/components/header.html", function (data) {
        $("body").prepend(data);
        $(".book-upload").css("display", "none");
        $(".logo").click(function () {
            location.href = 'MainPage'
        });
    });

    $.get("/components/footer.html", function (data) {
        $("body").append(data);
    });
    $(".overlay-cart").hide();
    $("#make-buy").click(function () {
        $(".overlay-cart").show();
        $("#cancel").click(function () {
            $(".overlay-cart").hide();
            $(".overlay-cart input").val("");
        });
    });
    $("#mark-all").click(function () {
        if ($('input[type="checkbox"]').prop("checked")) {
            $(this).text("Chọn tất cả");
            $('input[type="checkbox"]').prop("checked", false);
            $(".total-price span").text("0");
        } else {
            $(this).text("Hủy chọn tất cả");
            $('input[type="checkbox"]').prop("checked", true);
            var totalPrice = 0;
            var itemList = $(".cart-item");
            itemList.each(function () {
                var priceText = $(this)
                    .find(".item-total-price span")
                    .text()
                    .split(".");
                var priceNum = 0;
                for (let i = 0; i < priceText.length; i++) {
                    var x = priceText.length - i - 1;
                    var element = priceText[i];
                    priceNum += Number(element) * Math.pow(1000, x);
                }
                totalPrice += priceNum;
            });
            $(".total-price span").text(totalPrice);
        }
    });

    $.ajax({
        url: "Cart/LoadCartItems",
        data: { },
        success: function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var temp = response.data[i].value;

                var cartItem =
                    '<div class="cart-item cart-item-' + i + '">' +
                    '<img src = "" alt = ""/>' +
                    '<div class="detail">' +
                '<span class="book-name">Điều kì diệu của tiệm tạp hóa Namiya</span>' +
                    '<span class="quantity">Số lượng: <span>1</span></span>' +
                    '<span class="item-price">Đơn giá: <span>86000</span>đ</span>' +
                    '</div>' +
                '<span class="item-total-price">Tổng: <span>86000</span>đ</span>' +
                    '<input type = "checkbox" name = "item-choose"/>' +
                    '</div>';

                $(".cart-list").append(cartItem);

                $(".cart-item-" + i + " .book-name").text(temp.name);
                $(".cart-item-" + i + " .quantity span").text(temp.quantity);
                $(".cart-item-" + i + " .item-price span").text(temp.price);
                $(".cart-item-" + i + " img").attr("src", temp.imgLink[0]);
            }
        }
    });
});
