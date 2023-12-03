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
});