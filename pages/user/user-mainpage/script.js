$(this).ready(function () {
    $.get("/components/header.html", function (data) {
      $("body").prepend(data);
      $(".book-upload").css("display", "none");
      $(".user").click(function() {
        location.href = '/pages/user/info/user-information/index.html'
    });
    });
  
    $.get("/components/footer.html", function (data) {
      $("body").append(data);
    });
});  