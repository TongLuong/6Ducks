$(document).ready(function () {
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
});
