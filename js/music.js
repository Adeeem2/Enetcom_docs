const playlist = [
    {
      title: "Famax",
      artist: "Raffa Guido",
      src: "sound/Famax.mp3",
      img: "icons/famax.jpg"
    },
    {
      title: "Lisa",
      artist: "Lush Crayon",
      src: "sound/Lisa.mp3",
      img: "icons/lisa.jpg"
    }
  ];
let rotationStart = 0;
let lasttime = null;
let isRotating = false;
let currentTrack = 0;
const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const albumImage = document.getElementById("album");
const playPauseBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progressbar");
const container = document.getElementsByClassName("player-container");

function setrotation(deg){
    albumImage.style.transform = `rotate(${deg}deg)`;
}
function animateRotation(timestamp) {
    if (!isRotating) {
        return;
    }
    if(!lasttime) {
        lasttime = timestamp;
    }
    const delta = timestamp - lasttime;
    rotationStart += (delta /10000) * 360;
    setrotation(rotationStart);
    lasttime = timestamp;
    requestAnimationFrame(animateRotation);

}

function loadTrack(index) {
  const track = playlist[index];
  rotationStart = 0;
  setrotation(rotationStart);
  audio.src = track.src;
  audio.load();
  title.textContent = track.title;
  artist.textContent = track.artist;
  albumImage.src = track.img;
  playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  container[0].style.setProperty('--bg-img', `url(../${track.img})`);
}

function playPause() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    isRotating = true;
    lasttime = null;
    requestAnimationFrame(animateRotation);
  } else {
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    albumImage.style.animation = "none";
    isRotating = false;
  }
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
  audio.play();
  playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  isRotating = true;
  lasttime = null;
  requestAnimationFrame(animateRotation);
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrack);
  audio.play();
  playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  isRotating = true;
  lasttime = null;
  requestAnimationFrame(animateRotation);
}

audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
});
progressBar.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percent = offsetX / width;
    audio.currentTime = percent * audio.duration;
})
audio.addEventListener("ended", () => {
    nextTrack();
});
playPauseBtn.addEventListener("click", playPause);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

loadTrack(currentTrack);

