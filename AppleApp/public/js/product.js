const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
let isDragging = false, startX, startScrollLeft;

let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth) ;
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // console.log(btn.id);
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth ;
    })
})


const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX ;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return ;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = (e) => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

// const infiniteScroll = () => {
//     if(carousel.scrollLeft === 0) {
//         console.log("Youve reached the left end");  
//     } else if(carousel.scrollLeft === carousel.scrollWidth - carousel.offsetWidth){
//         console.log("You reached to right end");
//     }
// }

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
// document.addEventListener("scroll", infiniteScroll);