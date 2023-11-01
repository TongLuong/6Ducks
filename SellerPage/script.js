const imgCount = 0;
$(this).ready(function () {
  $.get("modules/header.html", function (data) {
    $("body").prepend(data);
    $(".book-upload").click(function() {
      $(".mainpage-upload-comic-form").css("display", "flex");
    });
  });

  $.get("modules/footer.html", function (data) {
    $("body").append(data);
  });

  $.get("upload/uploadPopUp.html", function (data) {
    $(".mainpage-upload-comic-form").append(data);
    $(".cancel-upload").click(function() {
      $(".mainpage-upload-comic-form").css("display", "none");
      $(".img-view").css("display", "none");
    });
    $(".submit-upload").click(function() {
      $(".mainpage-upload-comic-form").css("display", "none");
      $(".mainpage-upload_success_notification").css("display", "flex");
    });
    $(".upload-icon").click(function (){
      $(".file-input").click();
    })
    $(".file-input").change(function(e) {
      for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
  
        var file = e.originalEvent.srcElement.files[i];

        var img = document.createElement("img");
        
        var reader = new FileReader();
        reader.onloadend = function() {
              img.src = reader.result;
              img.classList.add("img-view")
              img.alt = "";
              $(".img-view").click(function (){
                $(".preview-img").attr("src", this.src);
                $(".preview-side").css("display", "flex");
              });
              $(".preview-side:not(img)").click(function (){
                $(".preview-side").css("display", "none");
              });
        }
        reader.readAsDataURL(file);
        $(".file-input").after(img);
      }
    });
  });

  $.get("upload/successPopUp.html", function (data) {
    $(".mainpage-upload_success_notification").append(data);
    $(".return-btn").click(function () {
      $(".mainpage-upload_success_notification").css("display", "none");
    });
  });
});