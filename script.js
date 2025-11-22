//var myAudio = document.getElementById("myAudio");
//var isPlaying = false;

//function togglePlay() {
  //isPlaying ? myAudio.pause() : myAudio.play();
//};

//myAudio.onplaying = function() {
  //isPlaying = true;
//};
//myAudio.onpause = function() {
  //isPlaying = false;
//};

function myFunction4() {
  var element = document.getElementById("font");
  if (element.classList === "w3-large") {
    element.classList.toggle("w3-xlarge") 
  } else {
    element.classList.toggle("w3-xlarge")
  }

}



function myFunction2() {
  var element = document.body;
  element.classList.toggle("light-mode");
}

// Grab the single audio element by ID
const audio = document.getElementById('myAudio');

// Player controls
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const rewindBtn = document.getElementById('rewindBtn');
const fastForwardBtn = document.getElementById('fastForwardBtn');
const currentTimeSpan = document.getElementById('currentTime');
const durationSpan = document.getElementById('duration');

// ---- PLAYLIST SETUP ----
// Put all your mp3 files here in the order you want them to play
const playlist = [
  'gpfm1.mp3',
  'gpfm2.mp3',
  'gpfm3.mp3',
  'gpfm4.mp3'
];

let currentTrack = 0;
let isPlaying = false;

// Initialize first track
function loadTrack(index) {
  if (index < 0 || index >= playlist.length) return;
  currentTrack = index;
  audio.src = playlist[currentTrack];
  audio.load();
}

// Call once on page load
loadTrack(0);

// ---- CONTROL FUNCTIONS ----
function playAudio() {
  audio.play();
  isPlaying = true;
  playBtn.style.display = 'none';
  pauseBtn.style.display = 'inline-block';
}

function pauseAudio() {
  audio.pause();
  isPlaying = false;
  playBtn.style.display = 'inline-block';
  pauseBtn.style.display = 'none';
}

function rewindAudio() {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
}

function fastForwardAudio() {
  // Prevent going beyond duration
  if (!isNaN(audio.duration)) {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  } else {
    audio.currentTime += 10;
  }
}

// ---- TIME DISPLAY ----
function updateTime() {
  const currentTime = Math.floor(audio.currentTime || 0);
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime - minutes * 60;
  currentTimeSpan.textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateDuration() {
  if (isNaN(audio.duration)) return;
  const duration = Math.floor(audio.duration);
  const minutes = Math.floor(duration / 60);
  const seconds = duration - minutes * 60;
  durationSpan.textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// ---- PLAYLIST AUTO-NEXT ----
audio.addEventListener('ended', () => {
  // Move to next track
  currentTrack++;

  if (currentTrack < playlist.length) {
    loadTrack(currentTrack);
    audio.play(); // auto-start next track
  } else {
    // Reached end of playlist - reset UI
    isPlaying = false;
    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    // Optionally: reset to first track
    // loadTrack(0);
  }
});

// ---- EVENT LISTENERS ----
playBtn.addEventListener('click', playAudio);
pauseBtn.addEventListener('click', pauseAudio);
rewindBtn.addEventListener('click', rewindAudio);
fastForwardBtn.addEventListener('click', fastForwardAudio);
audio.addEventListener('timeupdate', updateTime);
audio.addEventListener('loadedmetadata', updateDuration);

// Optional: start with pause button hidden
pauseBtn.style.display = 'none';

