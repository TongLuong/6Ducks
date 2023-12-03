function discountPrice() {
  $(".discount .price").each(function() {
    var price =  parseFloat($(this).text().replace(/[.]/g, ''));
    var badge = parseFloat($(".discount .product-item").has($(this)).find(".badge").text()) / 100;
    var discount = ((1 + badge) * price).toLocaleString() + "đ";
    $(this).html($("<span>").text($(this).text()));
    $(this).append($("<span>").text(discount));
  });
  $(".price span:nth-child(2)").css({
    "text-decoration": "none",
    "margin-left": "10px"
  })
  $(".price span:first-child").css("text-decoration", "line-through");
};


$(this).ready(function () {
  $.get("/components/header.html", function (data) {
    $("body").prepend(data);
    $(".user").click(function() {
        location.href = "SellerInfoSeller"
    });
    $(".logo").click(function() {
      location.href = "SellerMainPage"
  });
  });

  $.get("/components/footer.html", function (data) {
    $("body").append(data);
  });

  discountPrice();
});