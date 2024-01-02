$(this).ready(function () {
    $(".change-info-side .success").css("display", "none");

    $.get("/components/header.html", function (data) {
        $("body").prepend(data);
        $(".book-upload").css("display", "none");
        $(".logo").click(function () {
            location.href = "/MainPage";
        });
    });

    $.get("/components/footer.html", function (data) {
        $("body").append(data);
    });

    $.get("UserInfo/IndexPopup", function (data) {
        $(".rating_wrapper").prepend(data);
        $(".user_rating").css("display", "none");
        $(".success_popup").css("display", "none");

        /*$(".submit").click(function (e) {
            e.preventDefault();
            $(".user_rating").css("display", "none");
            $(".success_popup").css("display", "flex");
        });*/

        $(".cancel").click(function (e) {
            e.preventDefault();
            $(".rating_wrapper").css("display", "none");
            $(".user_rating").css("display", "none");
            $("html, body").css("overflow", "scroll");
        });

        $(".done").click(function (e) {
            e.preventDefault();
            $(".rating_wrapper").css("display", "none");
            $(".success_popup").css("display", "none");
            $("html, body").css("overflow", "scroll");
        });
    });
    // Rating popup

    $("#change-btn").click(function () {
        $(".change-info-side").css("display", "flex");
    });

    $("#cancel-change").click(function () {
        $(".change-info-side .success").css("display", "none");
        $(".change-info-side .change-info-popup").css("display", "");

        $(".change-info-side input").val("");
        $(".change-info-side").css("display", "none");
    });

    function display_bill(
        billID,
        status,
        time,
        price,
        totalPrice,
        productID,
        page
    ) {
        const html =
            '<tr class="row" id="bill' + billID + productID + '">'
            + '<td>' + billID + '</td>'
            + '<td>' + productID + '</td>'
            + '<td id="status">' + status + '</td>'
            + '<td>' + time + '</td>'
            + '<td>' + price + '</td>'
            + '<td>' + totalPrice + '</td>'
            + '<td class=' + (status == "Đã nhận" ? '"rating-trigger"' : '""') + '>' + (status == "Đã nhận" ? 'Đánh giá' : '') + '</td>' +
            '</tr >';
        $(".table-" + page + " tbody").append(html);

        var item = $(".table-" + page + " #bill" + billID + productID);

        item.find(".rating-trigger").click(function (e) {
            e.preventDefault();
            $("html, body").css("overflow", "none");
            $(".user_rating").css("display", "flex");
            $(".rating_wrapper").css("display", "flex");

            display_user_rating(productID, billID);
        });
    }

    function display_all_bill() {
        $.ajax({
            url: "UserInfo/DisplayBills",
            success: function (response) {
                $(".pagination .current-page span:nth-child(2)").text(response.page[response.num - 1]);
                for (let j = 1; j <= response.page[response.num - 1]; j++) {
                    var x =
                        `<table class="table table-` +
                        j +
                        `">
              <thead>
                <tr class="row header">
                    <td class="cell">Mã vận đơn</td>
                    <td class="cell">Mã sản phẩm</td>
                    <td class="cell">Trạng thái</td>
                    <td class="cell">Thời gian</td>
                    <td class="cell">Giá sản phẩm</td>
                    <td class="cell">Thanh toán</td>
                    <td class="cell"></td>
                </tr>
              </thead>
              <tbody></tbody>
            </table>`;
                    $(".table-right").append(x);

                    if (j == 1) {
                        $(".right_section").find(".table").addClass("active");
                    }
                }

                for (let i = 0; i < response.num; i++) {
                    display_bill(
                        response.billID[i],
                        response.status[i],
                        response.time[i],
                        response.price[i],
                        response.totalPrice[i],
                        response.productID[i],
                        response.page[i]
                    );
                }

                $("#all-bill .num").text(response.num);
                $("#confirm-bill .num").text(response.confirm);
                $("#done-bill .num").text(response.done);
            },
        });
    }

    display_all_bill();

    function submitRate(productID, billID) {
        var nostar = $(".user_rating .stars input:checked")
            .prop("id")
            .split("-")[1];
        var fb = $("#comment").val();

        $.ajax({
            url: "UserInfo/Rate",
            type: "post",
            data: {
                productID: productID, nostar: nostar, feedback: fb,
                billID: billID
            },
        });
    }
    

    function display_user_rating(productID, billID) {
        $.ajax({
            url: "UserInfo/DisplayProductWhenRating",
            data: { productID: productID, billID: billID },
            success: function (response) {
                $(".user_rating .name").text(response.name);
                $(".user_rating .img").attr("src", response.imgLink[0]);
                $('.user_rating #comment').val(response.detail);
                $(".user_rating .stars input:checked").attr('checked', false);
                if (response.ratingStar > 0)
                    $('.user_rating .stars #star-' + response.ratingStar).attr('checked', true);

                const formatter = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "vnd",
                });
                $(".user_rating .price").text(
                    formatter.format(response.price).replace(/₫/g, "") + "đ"
                );

                $("#submit").off('click');
                $("#submit").on('click', function (e) {
                    submitRate(productID, billID);

                    e.preventDefault();
                    $(".user_rating").css("display", "none");
                    $(".success_popup").css("display", "flex");
                });
            }
        });
    }

    $("#change-btn").click(function () {
        $.ajax({
            url: "UserInfo/DisplayUserInfo",
            success: function (response) {
                $("#change-pwd").val(response.pass);
                $("#change-email").val(response.email);
                $("#change-dob").val(response.dob);
                $("#change-add").val(response.address);
                $("#change-phone").val(response.phoneNumber);
            },
        });
    });

    $(".change-info-side .success #change-info-done").click(function () {
        $("#cancel-change").click();
    });

    $("#confirm-change").click(function () {
        var pass = $("#change-pwd").val();
        var email = $("#change-email").val();
        var dob = $("#change-dob").val();
        var address = $("#change-add").val();
        var phoneNumber = $("#change-phone").val();

        $.ajax({
            url: "UserInfo/UpdateUserInfo",
            type: "post",
            data: {
                pass: pass,
                email: email,
                dob: dob,
                address: address,
                phoneNumber: phoneNumber,
            },
        });

        display_profile();

        $(".change-info-side .success").css("display", "");
        $(".change-info-side .change-info-popup").css("display", "none");
    });

    function display_profile() {
        $.ajax({
            url: "UserInfo/ProfileInfo",
            success: function (response) {
                $(".profile_info .name").text(response.name);
                $(".profile_info .address").text(response.address);
                $(".contact .email").text(response.email);
                $(".contact .phone").text(response.phoneNumber);
            },
        });
    }

    display_profile();

    $(".pagination p.arrow.forward").click(function () {
        var maxPage = $(".table").length;
        var currPageNo = $(".table.active")
            .prop("class")
            .split(" ")[1]
            .split("-")[1];

        if (currPageNo != maxPage) {
            $(".pagination .current-page span:first-child()").text(Number($(".pagination .current-page span:first-child()").text()) + 1);
            $(".table.active").toggleClass("active");
            $(".table.table-" + ++currPageNo).addClass("active");
        }
    });
    //pagination back
    $(".pagination p.arrow.back").click(function () {
        var maxPage = $(".table").length;
        var currPageNo = $(".table.active")
            .prop("class")
            .split(" ")[1]
            .split("-")[1];

        if (currPageNo != 1) {
            $(".pagination .current-page span:first-child()").text(Number($(".pagination .current-page span:first-child()").text()) - 1);
            $(".table.active").toggleClass("active");
            $(".table.table-" + --currPageNo).addClass("active");
        }
    });
});
