const imgCount = 0;
$(document).ready(function () {
    $(".book-upload").click(function () {
        $(".mainpage-upload-comic-form").css("display", "flex");
        $("body, html").css("overflow", "hidden");
    });

    $.get("components/uploadPopUp.html", function (data) {
        $("body").append(data);
        $(".cancel-upload").click(function () {
            $(".mainpage-upload-comic-form").css("display", "none");
            $(".img-view").remove();
            $("#file, #name, #quantity, #price").val("");
            $("body, html").css("overflow", "scroll");
        });
        $(".submit-upload").click(function () {
            $(".mainpage-upload-comic-form").css("display", "none");
            $(".mainpage-upload_success_notification").css("display", "flex");
            $(".img-view").remove();
            $("#file, #name, #quantity, #price").val("");

            var urlParams = new URLSearchParams(window.location.search);
            var seller_id = urlParams.get('seller');
            var img_path = $("#upload-icon").attr('src');
            var book_name = $("#name").val();
            var quantity = $("#quantity").val();
            var genre = $("#category").text;
            var price = $("#quantity").val();
            var category = $("#type").text;
            //var author = $("#quantity").val();
            //var publisher = $("#quantity").val();

            $.ajax({
                url: "SellerMainPage/Upload",
                data: {
                    "sellerID": seller_id,
                    "imgPath": img_path,
                    "bookName": book_name,
                    "quantity": quantity,
                    "genre": genre,
                    "price": price,
                    "category": category,
                    "author": author,
                    "publisher":publisher
                },
                type: "post",
                success: function (response) {
                    //display product again
                }
            });
        });
        $(".upload-icon").click(function () {
            $(".file-input").click();
        });
        $(".file-input").change(function (e) {
            for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
                var file = e.originalEvent.srcElement.files[i];

                var img = document.createElement("img");

                var reader = new FileReader();
                reader.onloadend = function () {
                    img.src = reader.result;
                    img.classList.add("img-view");
                    img.alt = "";
                    $(".img-view").click(function () {
                        $(".preview-img").attr("src", this.src);
                        $(".preview-side").css("display", "flex");
                    });
                    $(".preview-side>i").click(function () {
                        $(".preview-side").css("display", "none");
                    });
                };
                reader.readAsDataURL(file);
                $(".file-input").after(img);
            }
        });
    });

    $.get("components/successPopUp.html", function (data) {
        $("body").append(data);
        $(".return-btn").click(function () {
            $(".mainpage-upload_success_notification").css("display", "none");
            $("body, html").css("overflow", "scroll");
        });
    });
});
