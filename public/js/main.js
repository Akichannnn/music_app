const $ = document.querySelector.bind(document);
const elements = {
  menunhac: $(".menu-nhac"),
  playIcon: $('.fa-play'),
  playBtn: $(".play"),
  replay: $(".replay"),
  randombtn: $(".random"),
  playbtn2: $("#btn-play"),
  skipForward: $(".skip-forward"),
  skipBack: $(".skip-back"),
  currentTimeHtml: $(".current-time"),
  durationHtml: $(".duration"),
  img: $('.img'),
  title: $(".audio-title"),
  singer: $(".audio-singer"),
  musiclo: $(".music-player"),
  playtracks: $("#playtracks"),
  pause: $("#pause"),
  progress_test: $(".progress_test"),
  menuphatnhac: $(".menu-phat-nhac"),
  thanhcc: $(".thanh-cc"),
  music_player: $("#music-player"),
  menu: $("#menu"),
  otherplaybtn: $(".menu-nhac"),
  loichao: $('.h4-1'),
  i1: $('#i-1'),
  i2: $('#i-2'),
  i3: $('#i-3'),
  home: $(".homehtml"),
  search: $(".searchhtml"),
  settinghtml: $(".settinghtml"),
  control: $(".control"),
  icon1: $(".tat-ca"),
  icon2: $(".nhac-nhe"),
  icon3: $(".nhac-remix"),
  homehtml: $(".homehtml"),
  btnplay: $("#btn-play"),
  progress: $(".progress"),
  currenttime: $(".current-time"),
  duration: $(".duration"),
  sing: $(".Singer"),
  usericon: $(".user-icon"),
  control1: $(".control"),
  menunhactext: $(".text-menu-nhac"),
  pname: $(".p-name"),
  audiotitle: $(".audio-title"),
  library: $(".libraryhtml")
};

let tracks = [];
const randomtrackIndex = Math.floor(Math.random() * 23) + 1;
let currentTrackIndex = randomtrackIndex;
let isTimerPlaying = false;
let iShuffle = false;
const audio = new Audio();
audio.loop = false;
let play_Track_Default = true;
async function fetchWithCache(url, cacheKey, cacheTime = 60000) {
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < cacheTime) return data;
  }
  const data = await fetchWithRetry(url);
  localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
  return data;
}

async function fetchWithRetry(url, retries = 3) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    if (retries > 0) return fetchWithRetry(url, retries - 1);
    throw error;
  }
}

async function initialize() {
  try {
    tracks = await fetchWithCache("track.json", "tracksCache");
    if (tracks && tracks.length > 0) loadTrack(currentTrackIndex);
    else console.error("No tracks found.");
  } catch (error) {
  }
}
async function yeucau(callback){
  try{
    const data = await fetch("json/track.json",{method: "GET"});
    if(data.ok){
     const response = await data.json();
     tracks = response;
    callback(response);
    return true;
    }else{
      initialize();
      console.log("file k tồn tại");
      return false;
    }
  }catch (error){
  }
}
function loadTrack(trackId) {
  if (!Array.isArray(tracks) || tracks.length === 0) return;

  const track = tracks.find(data => data.id === Number(trackId));
  if (!track) return;

  audio.src = track.source;
  elements.img.src = track.img;
  elements.title.innerText = track.name;
  elements.singer.innerText = track.artist;
  audio.currentTime = 0;
  audio.preload = "auto";
  updatePlayPauseUI();
  resetProgress();
  extractColor(track.img);

  elements.menuphatnhac.innerHTML = `
    <img class="img-img" src="${track.img}">
    <div class="text-menu-nhac">
      <p class="p-name">${track.name}</p>
      <i class="i-artist">${track.artist}</i>
    </div>`;

  setupMediaSession(track);
}

function updatePlayPauseUI() {
  const isPaused = audio.paused;
  elements.playIcon.classList.toggle('fa-pause', !isPaused);
  elements.playIcon.classList.toggle('fa-play', isPaused);
  elements.playtracks.classList.toggle("active", !isPaused);
  elements.pause.classList.toggle("active", isPaused);
}

function resetProgress() {
  elements.currentTimeHtml.innerText = `0:00`;
  elements.durationHtml.innerText = `0:00`;
}

async function extractColor(imgSrc) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgSrc;
  img.onload = () => {
    const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, 4);
      const totalPixels = img.width * img.height;
      const colorPercentages = {};

      palette.forEach((color) => {
        const colorKey = color.join(',');
        if (colorPercentages[colorKey]) {
          colorPercentages[colorKey]++;
        } else {
          colorPercentages[colorKey] = 1;
        }
      });
      let minColor = null;
      let maxColor = null;
      let minPercentage = Infinity;
      let maxPercentage = 0;

      for (const color in colorPercentages) {
        const percentage = (colorPercentages[color] / totalPixels) * 100;
        if (percentage < minPercentage) {
          minPercentage = percentage;
          minColor = color;
        }
        if (percentage > maxPercentage) {
          maxPercentage = percentage;
          maxColor = color;
        }
      }
      if (maxColor) {
        const [r, g, b] = maxColor.split(',');
        elements.musiclo.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
       elements.menunhac.style.backgroundColor  = `rgb(${r}, ${g}, ${b})`;
      }
    };
 }
  
function setupMediaSession(track) {
  if (!('mediaSession' in navigator)) return;
  if(play_Track_Default === true){
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.name,
    artist: track.artist,
    artwork: [
      { src: track.img, sizes: '96x96', type: 'image/jpeg' },
      { src: track.img, sizes: '128x128', type: 'image/jpeg' }
    ]
  });

  navigator.mediaSession.setActionHandler('play', () => audio.play());
  navigator.mediaSession.setActionHandler('pause', () => audio.pause());
  navigator.mediaSession.setActionHandler('nexttrack', () => skipTrack(1));
  navigator.mediaSession.setActionHandler('previoustrack', () => skipTrack(-1));
  }
}

function skipTrack(direction) {
  if(play_Track_Default === true){
  currentTrackIndex = (currentTrackIndex + direction + tracks.length) % tracks.length
  loadTrack(currentTrackIndex)
  if (isTimerPlaying){
    audio.play();
    updatePlayPauseUI();
    chuchay();
  }
  }
}

audio.ontimeupdate = () => {
  if (!audio.duration) return;
  const progress = (audio.currentTime / audio.duration) * 100;9
  elements.currentTimeHtml.innerText = formatTime(audio.currentTime);
  elements.durationHtml.innerText = formatTime(audio.duration);
  elements.progress_test.value = progress;
};

elements.progress_test.oninput = (e) => {
  const value = Math.min(Math.max(e.target.value, 0), 100);
  audio.currentTime = (audio.duration * value) / 100;
};

function formatTime(time) {
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time % 3600) / 60);
  let seconds = Math.floor(time % 60);

  let formattedHours = String(hours).padStart(2, '0');
  let formattedMinutes = String(minutes).padStart(2, '0');
  let formattedSeconds = String(seconds).padStart(2, '0');

  return hours > 0 
    ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}` 
    : `${formattedMinutes}:${formattedSeconds}`;
}
function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    isTimerPlaying = true;
    chuchay();
    updatePlayPauseUI();
  } else {
    audio.pause();
    isTimerPlaying = false;
    updatePlayPauseUI();
  }
  
}

elements.playbtn2.onclick = togglePlayPause;
elements.playBtn.onclick = togglePlayPause;

elements.skipForward.addEventListener('click', () =>{
  if(play_Track_Default === true){
    skipTrack(1);
  }else{
    next_track(current_Index+1);
  }
}
)
elements.skipBack.addEventListener('click', () =>{
  if(play_Track_Default === true){
    skipTrack(-1);
  }else{
    next_track(current_Index-1);
  }
}
)
elements.replay.onclick = () => {
  audio.loop = !audio.loop;
  elements.replay.style.color = audio.loop ? "green" : "white";
};

elements.randombtn.onclick = () => {
  iShuffle = !iShuffle;
  elements.randombtn.style.color = iShuffle ? "green" : "white";
};
audio.onended = () => {
  if (iShuffle) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * tracks.length);
    } while (randomIndex === currentTrackIndex);
    currentTrackIndex = randomIndex;
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  }
  loadTrack(currentTrackIndex);
  if (isTimerPlaying) audio.play();
};

function changeProgressColor() {
  const randomColor1 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  const randomColor2 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  elements.progress_test.style.background = `linear-gradient(to right, ${randomColor1}, ${randomColor2})`;
  setTimeout(changeProgressColor, Math.random() * 1000 + 1000);
}

window.onload = () => {
  changeProgressColor();
};

const { innerWidth: x, innerHeight: y } = window;

function updatethanhcc() {
  elements.otherplaybtn.addEventListener('click', () => {
    document.body.style.position = "fixed";
    animatePlayer();
    elements.music_player.style.top = `${y + 50}px`;
  });
  elements.menu.addEventListener("click", () => {
    unanimatePlayer();
    elements.music_player.style.top = "11px";
    document.body.style.position = "";
  });
}
function fetchHTML(url, selector, scriptSrc) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      $(selector).innerHTML = data;
      const script = document.createElement("script");
      script.src = scriptSrc;
      document.body.appendChild(script);
    });
}

fetchHTML('home.html', '.homehtml', "js/home.js");
fetchHTML("search.html", ".searchhtml", "js/search.js");
fetchHTML("setting.html", ".settinghtml", "js/setting.js");
fetchHTML("library.html",".libraryhtml")
function updateGreeting() {
  const hour = new Date().getHours();
  elements.loichao.innerHTML = hour < 12 ? "Chào buổi sáng!" : hour <= 17 ? "Chào buổi chiều!" : "Chào buổi tối!";
}

function setActiveIcon(activeIcon) {
  [elements.icon1, elements.icon2, elements.icon3].forEach(icon => {
    icon.style.background = icon === activeIcon ? '#00e300' : '#3e3d3d';
    icon.style.color = icon === activeIcon ? 'white' : 'black';
  });
}

function icolor(imausac) {
  imausac.style.color = '#2dac61';
  [elements.i1, elements.i2, elements.i3].forEach(maui => {
    if (maui !== imausac) maui.style.color = 'white';
  });
}
elements.i1.style.color = "green";
if(elements.i1.style.color === "green"){
    elements.i2.style.color = "white";
    elements.i3.style.color = "white"
  }
elements.i1.addEventListener('click', () => {
  icolor(elements.i1);
  elements.search.style.display = "none";
  elements.home.style.display = "block";
  elements.control.style.display = "block";
  elements.library.style.display = "none";
});

elements.i2.addEventListener('click', () => {
  icolor(elements.i2);
  elements.search.style.display = "block";
  elements.home.style.display = "none";
  elements.control.style.display = "none";
  elements.library.style.display = "none";
});

elements.i3.addEventListener('click', () => {
  icolor(elements.i3);
  elements.search.style.display = "none";
  elements.home.style.display = "none";
  elements.control.style.display = "none";
  elements.library.style.display = "block";
});

elements.icon1.addEventListener('click', () => setActiveIcon(elements.icon1));
elements.icon2.addEventListener('click', () => setActiveIcon(elements.icon2));
elements.icon3.addEventListener('click', () => setActiveIcon(elements.icon3));

function animatePlayer() {
  const aP = gsap.timeline();
  aP.to("#music-player",{
    y: 0,
    delay: 0.001,
    ease: "power3.out",
    height: 0,
    top: y+50,
   display: "block"
  })
  aP.to("#music-player",{
    y: -10,
    delay: 0.001,
    ease: "power3.out",
    height: y +40,
    top: 0
    })
};function unanimatePlayer(){
  const uaP = gsap.timeline();
  uaP.to("#music-player",{
  y: y+50,
  ease: "power3.out",
  display: "none",
  top: y+20
    })
};
function chuchay() {
    const menunhactext = $(".text-menu-nhac");
    const pname = $(".p-name");
    const menunhacWidth = menunhactext.offsetWidth;
    const textWidth = pname.scrollWidth; 
    if (textWidth < menunhacWidth) {
        pname.style.transform = "translateX(0)";
        return;
    }
    let position = menunhacWidth;
    function animation() {
        position -= 1;
        if (position < -textWidth) {
            position = menunhacWidth;
        }
        pname.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(animation);
    }
    animation();
    setTimeout(()=>{
          chuchay_2();
    },1000)
}
function chuchay_2(){
  const audio_title = $(".audio-title");
  const sing = $(".Singer");
  const audiotitleWidth = audio_title.scrollWidth;
  const singerWidth = sing.offsetWidth;
  if(audiotitleWidth < singerWidth){
      audio_title.style.transform = "translateX(0)";
      return;
    }
 var toa_do = singerWidth;
 function animation_2(){
   toa_do -=1;
    if(toa_do < -audiotitleWidth){
      toa_do = singerWidth;
    }
    audio_title.style.transform = `translateX(${toa_do}px)`;
   requestAnimationFrame(animation_2);
 }
 animation_2();
}
function checkDevice() {
  const userAgent = navigator.userAgent;
  if (/Mobi|Android/i.test(userAgent)) console.log("Thiết bị Android");
  else if (/Mobi|Ios/i.test(userAgent)) console.log("thiết bị ios");
  else if (/Tablet|iPad/i.test(userAgent)) console.log("Tablet/iPad");
  else window.location.href = "login.html";
}

elements.usericon.onclick = () => {
  elements.thanhcc.style.display = "none";
  elements.home.style.display = "none";
  elements.control1.style.display = "none";
  elements.settinghtml.style.display = "block";
};

function animation_mp() {
  gsap.from([".p-name", ".i-artist", ".img-img"], { width: 1, top: 0.1 });
}

function menu_nhac() {
  gsap.from(".menu-nhac", { width: 0.5, ease: "power3.out" });
  elements.menunhac.style.display = "block";
  animation_mp();
}

window.addEventListener('resize', updatethanhcc);
window.onscroll = () => {
  elements.control1.style.transform = window.scrollY > 50 ? "translateY(-100px)" : "translateY(0)";
};
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
updatethanhcc();
updateGreeting();
checkDevice();