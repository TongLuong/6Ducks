$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    /*var userID = urlParams.get('user');
    var type = 0; // 0: buyer, 1: seller, (2: admin)
    if (userID == null) {
        userID = urlParams.get('seller'); // ideal condition
        type = 1;
    }*/
    $(".delete-side").hide();

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

    $.ajax({
        url: "Cart/LoadCartItems",
        data: {},
        async: false,
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
                    '<div class="delete-cart-item"><i class="fa fa-times" aria-hidden="true"></i></div>' +
                    '</div>';

                $(".waiting-cart-list").append(cartItem);

                $(".cart-item-" + i + " .book-name").text(temp.name);
                $(".cart-item-" + i + " .quantity span").text(temp.quantity);
                $(".cart-item-" + i + " img").attr("src", temp.imgLink[0]);
                $(".cart-item-" + i + ' input[type="checkbox"]').attr(
                    "id", temp.productID + "-" + temp.sellerID);
                $(".cart-item-" + i + " .item-price span").text(temp.price);

                var totalPrice = Number(temp.quantity) * Number(temp.price);
                $(".cart-item-" + i + " .item-total-price span").text(totalPrice);

                //Delete cart-item 
                $(".delete-cart-item").click(function () {
                    $(".delete-side").show();

                    var item = $(this);

                    $(".delete-popup button").click(function (e) {
                        if (e.target === $("#confirm-delete")[0]) {
                            item.closest(".cart-item").replaceWith("");
                            $(".delete-side").hide();
                            //Load lại cart list
                            ///...............
                        } else if (e.target === $("#cancel-delete")[0]) {
                            $(".delete-side").hide();
                        };
                    }); 
                });
            }
        }
    });

    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            var totalPrice = 0;
            var itemList = $(".cart-item");
            itemList.each(function () {
                if ($(this).find('input[type="checkbox"]').prop("checked")) {
                    var priceText = $(this)
                        .find(".item-total-price span")
                        .text();
                    totalPrice += Number(priceText);
                }
            });
            $(".total-price span").text(totalPrice);
        });
    });

    $("#mark-all").click(function () {
        if ($('input[type="checkbox"]').prop("checked") &&
            $(this).text() == "Hủy chọn tất cả") {
            $(this).text("Chọn tất cả");
            $('input[type="checkbox"]').prop("checked", false);
            $(".total-price span").text("0");
        } else {
            $(this).text("Hủy chọn tất cả");
            $('input[type="checkbox"]').prop("checked", true);

            var totalPrice = 0;
            var itemList = $(".cart-item");
            itemList.each(function () {
                if ($(this).find('input[type="checkbox"]').prop("checked")) {
                    var priceText = $(this)
                        .find(".item-total-price span")
                        .text();
                    totalPrice += Number(priceText);
                }
            });
            $(".total-price span").text(totalPrice);
        }
    });

    $.get(
        "Product/LoadShippingMethods",
        {},
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var temp = response.data[i].value;

                var op = `<option value="` + temp.smethodID + `">`
                    + temp.name + `</option>`;

                $("#method").append(op);
            }
        }
    );

    $("#make-buy").click(function () {
        var itemsChose = [];
        var itemsChoseID = [];
        var itemsChoseSellerID = [];
        var itemsChoseQuant = [];
        var itemsChoseTotalPrice = [];
        var allCheckbox = $('.cart-item input[type="checkbox"');

        allCheckbox.each(function (i) {
            if (this.checked) {
                itemsChose.push(i);

                var id = $(this).attr("id").split("-");
                itemsChoseID.push(id[0]);
                itemsChoseSellerID.push(id[1]);
            }
        });
        $(".buy-cart-list .cart-item").remove();

        for (var i = 0; i < itemsChose.length; i++) {
            var buyItem = `<div class="cart-item buy-cart-item-` + itemsChose[i] + `">
                            <img src="/assets/images/DieuKyDieuCuaTiemTapHoaNamiya/book-1-1.png" alt="" />
                            <span class="detail">Điều kì diệu ở tiệm tạp hóa Namiya</span>
                            <span class="item-total-price"><span>86.000</span>đ</span>
                        </div>`;
            $(".buy-cart-list").append(buyItem);

            var itemChose = $(".cart-item-" + itemsChose[i]);
            $(".buy-cart-item-" + itemsChose[i] + " img").attr("src",
                itemChose.find("img").attr("src"));
            $(".buy-cart-item-" + itemsChose[i] + " .detail").text(
                itemChose.find(".book-name").text());
            $(".buy-cart-item-" + itemsChose[i] + " .item-total-price span").text(
                itemChose.find(".item-total-price span").text());

            itemsChoseQuant.push(itemChose.find(".quantity span").text());
            itemsChoseTotalPrice.push(
                itemChose.find(".item-total-price span").text());
        }

        $(".total").val($(".total-price span").text());

        $("#confirm-buy").click(function () {
            var totalPrice = $(".total").val();
            var address = $("#address").val();
            var pmethodID = "";
            var smethodID = $("#method").val();
            var billID;
            $.ajax({
                url: "Product/CreateBill",
                data: {
                    "buyerID": "",
                    "billStatus": "",
                    "totalPrice": totalPrice,
                    "address": address,
                    "pmethodID": pmethodID,
                    "smethodID": smethodID,
                    "discountVoucher": null,
                    "freeshipVoucher": null
                },
                async: false,
                success: function (response) {
                    billID = response.billID;
                }
            });

            for (var i = 0; i < itemChose.length; i++) {
                $.ajax({
                    url: "Product/AddBillItems",
                    data: {
                        "billID": billID,
                        "selleruserID": itemsChoseSellerID[i],
                        "productID": itemsChoseID[i],
                        "quantity": itemsChoseQuant[i],
                        "price": itemsChoseTotalPrice[i]
                    },
                    async: false
                });
            }
        });

        $(".overlay-cart").show();
        $("#cancel").click(function () {
            $(".overlay-cart").hide();
            $(".overlay-cart input").val("");
        });
    });
});
