$(this).ready(function () {
  $.get("/components/header.html", function (data) {
    $("body").prepend(data);
    $(".book-upload").css("display", "none");
  });

  $.get("/components/footer.html", function (data) {
    $("body").append(data);
  });

  $(".container_seller img").click(function (e) {
    e.preventDefault();
    location.href = "/pages/user/info/seller-information (buyer)";
  });
});
