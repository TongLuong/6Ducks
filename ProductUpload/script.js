const icon = document.querySelector("ion-icon"),
fileInput = document.querySelector(".file-input"),
uploadBook = document.querySelector(".book-upload"),
cancel = document.querySelector(".cancel-upload"),
upLoad = document.querySelector(".upload");

icon.addEventListener("click", () =>{
  fileInput.click();
});

uploadBook.addEventListener("click", () =>{
 upLoad.classList.add('active');
});

cancel.addEventListener("click", () =>{
  upLoad.classList.remove('active');
 });
