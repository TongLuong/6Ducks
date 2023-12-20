$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    /*var userID = urlParams.get('user');
    var type = 0; // 0: buyer, 1: seller, (2: admin)
    if (userID == null) {
        userID = urlParams.get('seller'); // ideal condition
        type = 1;
    }*/
    $(".delete-side").hide();
    $(".overlay-cart .success").css("display", "none");
    
    $(".overlay-cart .cash").css("display", "none");
    $(".overlay-cart #confirm-buy").css("display", "none");
    $(".cash .left form").css("opacity", "0");
    $(".cash .right form").css("opacity", "0");
    $("#next").click(function () {
        $(".overlay-cart .buy").css("display", "none");
        $(".overlay-cart .cash").css("display", "");

        $(".overlay-cart #confirm-buy").css("display", "");
        $(".overlay-cart #next").css("display", "none");

        let checkboxes = document.querySelectorAll('.overlay-cart input[type="checkbox"]');
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener("change", function () {
                checkboxes.forEach(function (c) {
                    if (c !== checkbox) c.checked = false;
                });
                if ($(".cash .left").has(this).length) {
                    if (this.checked)
                        $(".cash .left form").css("opacity", "1");
                    else
                        $(".cash .left form").css("opacity", "0");
                    $(".cash .right form").css("opacity", "0");
                } else {
                    $(".cash .left form").css("opacity", "0");
                    if (this.checked)
                        $(".cash .right form").css("opacity", "1");
                    else
                        $(".cash .right form").css("opacity", "0");
                }
            });
        });
    });
    
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
                deleteCartItems(i, temp.productID);
            }
        }
    });

    function deleteCartItems(index, productID) {
        $(".cart-item-" + index + " .delete-cart-item").click(function () {
            $(".delete-side").show();
            
            var item = $(this);

            $(".delete-popup button").click(function (e) {
                if (e.target === $("#confirm-delete")[0]) {
                    item.closest(".cart-item").replaceWith("");
                    $(".delete-side").hide();

                    $.ajax({
                        url: "Cart/DeleteCartItems",
                        data: {
                            "buyerID": "",
                            "productID": productID
                        }
                    });
                } else if (e.target === $("#cancel-delete")[0]) {
                    $(".delete-side").hide();
                };
            });
        });
    }
    
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
        if ($('.cart-list input[type="checkbox"]').prop("checked") &&
            $(this).text() == "Hủy chọn tất cả") {
            $(this).text("Chọn tất cả");
            $('.cart-list input[type="checkbox"]').prop("checked", false);
            $(".total-price span").text("0");
        } else {
            $(this).text("Hủy chọn tất cả");
            $('.cart-list input[type="checkbox"]').prop("checked", true);

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

    $.get(
        "Product/LoadPaymentMethods",
        {},
        function (response) {
            $("#cod-method").attr("id", response.data[0].value.pmethodID);
            $("#banking-method").attr("id", response.data[1].value.pmethodID);
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
            var payment = $('input[name="cod-method"], ' +
                'input[name="banking-method"] input:checked');

            //var totalPrice = $(".total").val();
            var address = $("#address").val();
            var pmethodID = payment.prop("id");
            var smethodID = $("#method").val();

            var sellerBillPair = {}; // sellerID: billID

            for (var i = 0; i < itemsChose.length; i++) {
                if (!(itemsChoseSellerID[i] in sellerBillPair)) {
                    $.ajax({
                        url: "Product/CreateBill",
                        data: {
                            "buyerID": "", // ignore
                            "sellerID": itemsChoseSellerID[i],
                            "billStatus": "", // ignore
                            "totalPrice": 0, // ignore?
                            "address": address,
                            "pmethodID": pmethodID,
                            "smethodID": smethodID,
                            "discountVoucher": null,
                            "freeshipVoucher": null
                        },
                        async: false,
                        success: function (response) {
                            sellerBillPair[itemsChoseSellerID[i]] =
                                response.billID;
                        }
                    });
                }
                
                $.ajax({
                    url: "Product/AddBillItems",
                    data: {
                        "billID": sellerBillPair[itemsChoseSellerID[i]],
                        "sellerID": itemsChoseSellerID[i],
                        "productID": itemsChoseID[i],
                        "quantity": itemsChoseQuant[i],
                        "price": itemsChoseTotalPrice[i]
                    },
                    async: false
                });
            }

            for (var i = 0; i < itemsChose.length; i++) {
                $(".cart-item-" + itemsChose[i]).replaceWith("");

                $.ajax({
                    url: "Cart/DeleteCartItems",
                    data: {
                        "buyerID": "",
                        "productID": itemsChoseID[i]
                    },
                    async: false
                });
            }

            $(".overlay-cart .wrapper").css("display", "none");
            $(".overlay-cart .success").css("display", "");
        });

        $(".overlay-cart").show();
        $("#cancel").click(function () {
            $(".overlay-cart").hide();
            $(".overlay-cart input").val("");

            $(".overlay-cart .buy").css("display", "");
            $(".overlay-cart .cash").css("display", "none");

            $(".overlay-cart #confirm-buy").css("display", "none");
            $(".overlay-cart #next").css("display", "");
        });
    });

    $("#buy-done").click(function () {
        $(".overlay-cart .success").css("display", "none");
        location.reload(true);
    });
});
