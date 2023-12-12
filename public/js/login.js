const inputkey = document.querySelector(".error-email");
const errorBox = document.querySelector(".user-Message");
console.log(errorBox);
if(errorBox !== null){
inputkey.addEventListener("keyup", () => {
    console.log("hello") ;
    errorBox.classList.add("hide");
})
}