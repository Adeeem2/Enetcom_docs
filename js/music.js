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

  let currentTrack = 0;
  const audio = document.getElementById("audio");
  const title = document.getElementById("title");
  const artist = document.getElementById("artist");
  const albumImage = document.getElementById("album");
  const playPauseBtn = document.getElementById("play-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const progress = document.getElementById("progress");
  const container = document.getElementsByClassName("player-container");

  function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
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
      albumImage.style.animation = "rotation 10s linear infinite";
    } else {
      audio.pause();
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      albumImage.style.animation = "none";
    }
  }

  function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    audio.play();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }

  function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    audio.play();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }

  // Update progress bar
  audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + "%";
  });

  playPauseBtn.addEventListener("click", playPause);
  nextBtn.addEventListener("click", nextTrack);
  prevBtn.addEventListener("click", prevTrack);

  // Load first track
  loadTrack(currentTrack);

