$(this).ready(function () {
  // $.get("/components/header.html", function (data) {
  //   $("body").prepend(data);
  // });

  // $.get("/components/footer.html", function (data) {
  //   $("body").append(data);
  // });

  $(".signin").click(function (e) {
    e.preventDefault();
    location.href = "../signin/";
  });

  $(".login-btn").click(function (e) { 
    e.preventDefault();
    location.href = "MainPage";
  });

  $(".show-pwd").click(function (e) {
    e.preventDefault();
    $(this).css("display", "none");
    $(".hide-pwd").css("display", "block");
    $("#pwd")[0].type = "text";
  });

  $(".hide-pwd").click(function (e) {
    e.preventDefault();
    $(this).css("display", "none");
    $(".show-pwd").css("display", "block");
    $("#pwd")[0].type = "password";
  });
});
