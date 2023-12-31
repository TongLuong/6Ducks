$(this).ready(function () {
    
    $(".change-info-side .success").css("display", "none");
    
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

    $.get("UserInfo/IndexPopup", function (data) {
        $(".rating_wrapper").prepend(data);
        $(".user_rating").css("display", "none");
        $(".success_popup").css("display", "none");

        $(".submit").click(function (e) {
            e.preventDefault();
            $(".user_rating").css("display", "none");
            $(".success_popup").css("display", "flex");
        });

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
        $(".change-info-side").css("display", "flex")
    });

    $("#cancel-change").click(function () {
        $(".change-info-side .success").css("display", "none");
        $(".change-info-side .change-info-popup").css("display", "");

        $(".change-info-side input").val("");
        $(".change-info-side").css("display", "none");
    });
    
    function display_bill(billID, status, time, totalPrice, productID /*, rateCheck*/) {
        const html =
            ' <div class="row" id="bill' + billID + '">' +
            ' <div class="cell" data-title="MÃ VẬN ĐƠN" >' + billID + '</div>' +
            '<div class="cell" data-title="TRẠNG THÁI" id="status">' + status + '</div>' +
            '<div class="cell" data-title="THỜI GIAN">' + time + '</div>' +
            '<div class="cell" data-title="THANH TOÁN">' + totalPrice + '</div>' +
            '<div class="cell' + ((status == "Đã nhận") ? ' rating' : '') + '" data-title="ĐÁNH GIÁ">' + ((status == "Đã nhận") ? 'Đánh giá' : '') + '</div>' +
            '</div > ';
        $('.table').append(html);
        
        var item = $('.table #bill' + billID);
        //const rating = item.find('.rating');
        /*if (rateCheck) {
            item.find('.rating').hide();
        }*/
        item.find('.rating').click(function (e) {
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
                //$('.table #bill').remove();
                
                for (let i = 0; i < response.num; i++) {
                    display_bill(response.billID[i], response.status[i], response.time[i], response.totalPrice[i], response.productID[i]);
                }

                $('#all-bill .num').text(response.num);
                $('#confirm-bill .num').text(response.confirm);
                $('#done-bill .num').text(response.done);
            }
        });
    }

    display_all_bill();

    function display_user_rating(productID, billID) {
        $.ajax({
            url: "UserInfo/DisplayProductWhenRating",
            data: { "productID": productID },
            success: function (response) {
                $('.user_rating .name').text(response.name[0]);
                $('.user_rating .img').attr('src', response.imgLink[0]);

                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'vnd',
                });
                $('.user_rating .price').text(formatter.format(
                    response.price[0]).replace(/₫/g, "") + "đ");

                $('#submit').click(function () {

                    var nostar = $('.user_rating .stars input:checked').prop('id').split('-')[1];
                    var fb = $('#comment').val();
                    
                    $.ajax({
                        url: "UserInfo/Rate",
                        type: 'post',
                        data: { 'productID': productID, 'nostar': nostar, 'feedback': fb }
                    });
                });
            }
        });
    }

    $('#change-btn').click(function () {
        $.ajax({
            url: "UserInfo/DisplayUserInfo",
            success: function (response) {
                $('#change-pwd').val(response.pass);
                $('#change-email').val(response.email);
                $('#change-dob').val(response.dob);
                $('#change-add').val(response.address);
                $('#change-phone').val(response.phoneNumber);
            }
        });
    });

    $(".change-info-side .success #change-info-done").click(function () {
        $("#cancel-change").click();
    });

    $('#confirm-change').click(function () {
        var pass = $('#change-pwd').val();
        var email = $('#change-email').val();
        var dob = $('#change-dob').val();
        var address = $('#change-add').val();
        var phoneNumber = $('#change-phone').val();

        $.ajax({
            url: "UserInfo/UpdateUserInfo",
            type: 'post',
            data: { 'pass': pass, 'email': email, 'dob': dob, 'address': address, 'phoneNumber': phoneNumber }
        });

        display_profile();

        $(".change-info-side .success").css("display", "");
        $(".change-info-side .change-info-popup").css("display", "none");
    });

    function display_profile() {
        $.ajax({
            url: "UserInfo/ProfileInfo",
            success: function (response) {
                $('.profile_info .name').text(response.name);
                $('.profile_info .address').text(response.address);
                $('.contact .email').text(response.email);
                $('.contact .phone').text(response.phoneNumber);
            }
        });
    }

    display_profile();
});
