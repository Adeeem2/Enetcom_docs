const updates = [
    "16/05/2025 : LTIC section will be added soon once i gather the documents.",
    "21/05/2025 : Improved navigation and fixed some bugs.",
    "23/05/2025 : Added dark mode toggle and improved UI.",
    "03/06/2025 : Added a new section for upcoming features."
];
const carousel = document.getElementById("carousel");
let i = 0;

updates.forEach(text => {
    const slide = document.createElement("div");
    slide.className = "slide";
    const p = document.createElement("p");
    p.textContent = text;
    slide.appendChild(p);
    carousel.appendChild(slide);
})
function updateCarousel(){
    carousel.style.transform = `translateX(-${i * 100}%)`;

}
document.getElementById("prev-btn").addEventListener("click", () => {
    i = (i -1 + updates.length) % updates.length;
    updateCarousel();
    resetTimer();
})
document.getElementById("next-btn").addEventListener("click", () => {
    i = (i + 1) % updates.length;
    updateCarousel();
    resetTimer();
})
let timer = setInterval(() => {
    i = (i + 1) % updates.length;
    updateCarousel();
}, 5000);
function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        i = (i + 1) % updates.length;
        updateCarousel();
    }, 5000);
}

updateCarousel();