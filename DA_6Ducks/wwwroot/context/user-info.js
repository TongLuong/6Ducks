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

  $.get("UserInfo", function (data) {
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
  $(".rating").click(function (e) {
    e.preventDefault();
    $("html, body").css("overflow", "none");
    $(".user_rating").css("display", "flex");
    $(".rating_wrapper").css("display", "flex");
  });
});
