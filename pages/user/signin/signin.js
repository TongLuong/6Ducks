$(this).ready(function () {
  $.get("/components/header.html", function (data) {
    $("body").prepend(data);
  });

  $.get("/components/footer.html", function (data) {
    $("body").append(data);
  });

  $("#pwd ~ .show-pwd").click(function (e) {
    e.preventDefault();
    $(this).css("display", "none");
    $("#pwd ~ .hide-pwd").css("display", "block");
    $("#pwd")[0].type = "text";
  });

  $("#pwd ~ .hide-pwd").click(function (e) {
    e.preventDefault();
    $(this).css("display", "none");
    $("#pwd ~ .show-pwd").css("display", "block");
    $("#pwd")[0].type = "password";
  });

  $("#re-pwd ~ .show-pwd").click(function (e) {
    e.preventDefault();
    $(this).css("display", "none");
    $("#re-pwd ~ .hide-pwd").css("display", "block");
    $("#re-pwd")[0].type = "text";
  });

  $("#re-pwd ~ .hide-pwd").click(function (e) {
    e.preventDefault();
    $(this).css("display", "none");
    $("#re-pwd ~ .show-pwd").css("display", "block");
    $("#re-pwd")[0].type = "password";
  });

  $(".login-btn span").click(function (e) {
    e.preventDefault();
    location.href = "../login/";
  });
});
