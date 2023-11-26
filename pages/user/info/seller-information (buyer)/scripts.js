$(document).ready(function () {
    $.get("/components/header.html", function (data) {
        $(".book-upload").css("display", "none");    
        $(".logo").click(function() {
          location.href = '/pages/user/user-mainpage/index.html'
      });
    });
});