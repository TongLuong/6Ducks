$(this).ready(function () {
  $.get("/components/header.html", function (data) {
    $("body").prepend(data);
    $(".logo").click(function () {
      location.href = "/pages/user/seller-mainpage/index.html";
    });
    $(".book-upload").click(function () {
      $(".mainpage-upload-comic-form").css("display", "flex");
      $("body, html").css("overflow", "hidden");
    });
  });

  $.get("/components/footer.html", function (data) {
    $("body").append(data);
  });

  $(".product-item").click(function (e) {
    e.preventDefault();
    location.href = "/pages/product/info/";
  });

  $(".seller-contact").click(function (e) {
    e.preventDefault();
    location.href = "/pages/user/chat/";
  });
  //pagination function
  $(".pagination p:not(.arrow)").click(function () {
    $(".pagination > .active").toggleClass("active");
    $(this).toggleClass("active");

    $(".product > .active").toggleClass("active");
    var x = Number($(this).text()[1]);
    var y = ".product .page-" + x;
    $(y).toggleClass("active");
  });
  //pagination forward
  $(".pagination p.arrow.forward").click(function () {
    if ($(".pagination > .active").next()[0] !== $(this)[0]) {
      var x = $(".pagination > .active");
      $(".pagination > .active").next().toggleClass("active");
      x.toggleClass("active");

      var y = $(".product > .active");
      $(".product > .active").next().toggleClass("active");
      y.toggleClass("active");
    }
  });
  //pagination back
  $(".pagination p.arrow.back").click(function () {
    if ($(".pagination > .active").prev()[0] !== $(this)[0]) {
      var x = $(".pagination .active");
      $(".pagination .active").prev().toggleClass("active");
      x.toggleClass("active");

      var y = $(".product > .active");
      $(".product > .active").prev().toggleClass("active");
      y.toggleClass("active");
    }
  });

  $(".about img").click(function (e) {
    e.preventDefault();
    location.href = "/pages/user/info/seller-information (buyer)";
  });
});
