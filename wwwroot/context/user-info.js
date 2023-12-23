$(this).ready(function () {
  $.get("/components/header.html", function (data) {
    $("body").prepend(data);
    $(".book-upload").css("display", "none");
    $(".logo").click(function() {
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

  $("#change-btn").click(function() {
    $(".change-info-side").css("display", "flex")
  });

  $("#cancel-change").click(function() {
    $(".change-info-side input").val("");
    $(".change-info-side").css("display", "none");
  });

    function display_bill(billID, status, time, totalPrice,productID) {
        const html =
            ' <div class="row" id="bill">' +
            ' <div class="cell" data-title="MÃ VẬN ĐƠN" >' + billID + '</div>' +
            '<div class="cell" data-title="TRẠNG THÁI" id="status">' + status + '</div>' +
            '<div class="cell" data-title="THỜI GIAN">' + time + '</div>' +
            '<div class="cell" data-title="THANH TOÁN">' + totalPrice + '</div>' +
            '<div class="cell' + ((status == "Đã nhận") ? ' rating' : '') + '" data-title="ĐÁNH GIÁ">' + ((status == "Đã nhận") ? 'Đánh giá' : '') + '</div>' +
            '</div > ';
        $('.table').append(html);

        var item = $(".table #bill:last-child()");

        item.find('.rating').click(function (e) {
            e.preventDefault();
            $("html, body").css("overflow", "none");
            $(".user_rating").css("display", "flex");
            $(".rating_wrapper").css("display", "flex");

            display_user_rating(productID);
        });
    }

    function display_all_bill() {
        $.ajax({
            url: "UserInfo/DisplayBills",
            success: function (response) {
                $('.table #bill').remove();

                for (let i = 0; i < response.num; i++) {
                    display_bill(response.billID[i], response.status[i], response.time[i], response.totalPrice[i], response.productID[i]);
                }
            },
            error: function () {
                alert("error");
            }
        });
    }

    display_all_bill();

    function display_user_rating(productID) {
        $.ajax({
            url: "UserInfo/DisplayProductWhenRating",
            data: { "productID": productID },
            success: function (response) {
                $('.user_rating .name').text(response.name[0]);
                $('.user_rating .img').attr('src',response.imgLink[0]);
                $('.user_rating .img').text(response.price[0] + 'đ');

                $('#submit').click(function () {
                    alert('get fb');
                    var nostar = $('.user_rating .stars input:checked').prop('id').split('-')[1];
                    var fb = $('#comment').val();
                    alert('get done');

                    $.ajax({
                        url: "UserInfo/Rate",
                        type: 'post',
                        data: { 'productID': productID, 'nostar': nostar, 'feedback': fb },
                        success: function () {
                            alert("Feedback successfully");
                        },
                        error: function () {
                            alert("error");
                        }
                    });
                });
            },
            error: function () {
                alert("error");
            }
        });
    }
});
