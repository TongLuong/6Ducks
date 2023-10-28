const icon = document.querySelector(".upload-icon"),
fileInput = document.querySelector(".file-input"),
uploadBook = document.querySelector(".book-upload"),
cancel = document.querySelector(".cancel-upload"),
submit = document.querySelector(".submit-upload"),
success = document.querySelector(".success"),
returnbtn = document.querySelector(".return-btn"),
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


submit.addEventListener("click", () =>{
  success.classList.add('active');
  upLoad.classList.remove('active');
});

returnbtn.addEventListener("click", () =>{
  success.classList.remove('active');
});