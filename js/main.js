const $ = document.querySelector.bind(document);
//get elements
const elements = {
  video: $(".video"),
  userIcon: $(".user-icon"),
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
  audio_title: $(".audio-title"),
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
  sing: $(".title-sing"),
  usericon: $(".user-icon"),
  control1: $(".control"),
  menunhactext: $(".text-menu-nhac"),
  pname: $(".p-name"),
  audiotitle: $(".audio-title"),
  library: $(".libraryhtml"),
  moreOptions: $(".more-options"),
  turnOffOptions:  $(".turnOff-options")
  ,options: $(".options"),
  share: $(".share")
};
const playingTrackName = $(".playing-track-name");
const video = $(".video");
let tracks = [];
let randomtrackIndex = 0;
let isTimerPlaying = false;
let iShuffle = false;
const audio = $(".audio");
let data_all_track;
let play_Track_Default = true;
function pullOutData_main() {
  const raw = JSON.parse(localStorage.getItem("setting"));
  if (!raw) return false;
  let a = raw.checkplay;
  return a;
}
let play_audio_with_video = pullOutData_main();
async function yeucau(callback){
  try{
    const data = await fetch("json/track.json",{method: "GET"});
     const response = await data.json();
     tracks = response;
    callback(response);
    return response;
  }catch (error){
  }
}
async function dataGG(){
  try{
   const response = await
   fetch("https://www.akiweb.click/auth/google/callback");
   const data = response.json();
   elements.userIcon.src = data.picture;
  }catch(erorr){
    console.log("404");
  }
}
function randomIndex(){
  if(play_Track_Default === true){
  let trackRandom = Math.floor(Math.random() * Math.max(tracks.length) + 1);
  randomtrackIndex = trackRandom;
  }
}
function loadTrack(id) {
  const trackId = Number(id);
  const track = tracks.find(data => data.id === trackId);
  data_all_track = track;
  audio.currentTime = 0;
  audio.preload = "auto";
  innerInterface_Main(track);
  /*if(isApp){
    createMusicControls(track);
  }*/
  audio.src = track.source;
  setTimeout(()=>{
      audio.load();
  },100);
}
function innerInterface_Main(track){
    elements.img.src = track.img;
  elements.audio_title.innerText = track.name;
  elements.singer.innerText = track.artist;
  playingTrackName.innerText = track.name;
  elements.menuphatnhac.innerHTML = `
    <img class="img-img" src="${track.img}">
    <div class="text-menu-nhac">
      <p class="p-name">${track.name}</p>
      <i class="i-artist">${track.artist}</i>
    </div>`;
   updatePlayPauseUI();
  resetProgress();
  saveHistory(track);
  playAudio_withVideo();
  extractColor(track.img);
  setupMediaSession(track);
  audio.load();
  change_media();
}

if(play_audio_with_video){
video.onplay=()=>{
  updatePlayPauseUI();
};
video.onpause=()=>{
  updatePlayPauseUI();
};
}else{
  //audio
audio.onpause = () => {
  updatePlayPauseUI();
};

audio.onplay = () => {
  updatePlayPauseUI();
};
}
function playAudio_withVideo() {
  const test = pullOutData_main();
  const isVideo = String(test).toLowerCase() === "true";
  elements.video.style.display = isVideo ? "block" : "none";
  elements.img.style.display = isVideo ? "none" : "block";
}
function updatePlayPauseUI() {
  const test = pullOutData_main();
  const isVideo = String(test).toLowerCase() === "true";
  const media = isVideo ? video : audio;
    const isPaused = media.paused;
    elements.playIcon.classList.toggle('fa-pause', !isPaused);
  elements.playIcon.classList.toggle('fa-play', isPaused);
  elements.playtracks.classList.toggle("active", !isPaused);
  elements.pause.classList.toggle("active", isPaused);
}

function resetProgress() {
  elements.currentTimeHtml.innerText = `0:00`;
  elements.durationHtml.innerText = `0:00`;
}

function extractColor(imgSrc) {
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
    }
 }
  
function setupMediaSession(track) {
  if (!('mediaSession' in navigator)) return;
  const isVideo = String(play_audio_with_video).toLowerCase() === "true";
  if(isVideo){
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
  if(tracks.length > 0){
    randomtrackIndex = (randomtrackIndex + direction + tracks.length) % tracks.length
    loadTrack(randomtrackIndex);
  if (audio.paused){
    isTimerPlaying = true;
    audio.play();
    updatePlayPauseUI();
    chuchay();
  }
  }
}
//audio ontimeupdate
function change_media() {
  const isVideo = String(play_audio_with_video).toLowerCase() === "true";
  const media = isVideo ? video : audio;
  pullOutData_main();
  return media;
}

let media_audio_or_video = change_media() || audio;

media_audio_or_video.ontimeupdate = () => {
  const duration = media_audio_or_video.duration;
  if (!Number.isFinite(duration) || duration === 0) return;

  const progress = (media_audio_or_video.currentTime / duration) * 100;
  elements.currentTimeHtml.innerText = formatTime(media_audio_or_video.currentTime);
  elements.durationHtml.innerText = formatTime(duration);
  elements.progress_test.value = progress;
};

elements.progress_test.oninput = (e) => {
  const value = Math.min(Math.max(Number(e.target.value), 0), 100);
  const duration = media_audio_or_video.duration;
  if (!Number.isFinite(duration) || duration === 0) return;

  media_audio_or_video.currentTime = (duration * value) / 100;
}

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
  const test = pullOutData_main();
  const isVideo = String(test).toLowerCase() === "true";
  const media = isVideo ? video : audio;
  if (media.paused) {
    media.play();
    isTimerPlaying = true;
    chuchay();
  } else {
    media.pause();
    isTimerPlaying = false;
  }
  updatePlayPauseUI();
}

elements.playbtn2.onclick = togglePlayPause;
elements.playBtn.onclick = togglePlayPause;

elements.skipForward.addEventListener('click', () =>{
  if(play_Track_Default){
    skipTrack(1);
  }else{
    next_track(+1);
  }
}
)
elements.skipBack.addEventListener('click', () =>{
  if(play_Track_Default){
    skipTrack(-1);
  }else{
    next_track(-1);
  }
}
)
if(play_audio_with_video === false){
elements.replay.onclick = () => {
  audio.loop = !audio.loop;
  elements.replay.style.color = audio.loop ? "green" : "white";
};

elements.randombtn.onclick = () => {
  iShuffle = !iShuffle;
  elements.randombtn.style.color = iShuffle ? "green" : "white";
};
}else{
  elements.replay.onclick = () => {
  video.loop = !video.loop;
  elements.replay.style.color = video.loop ? "green" : "white";
};

elements.randombtn.onclick = () => {
  iShuffle = !iShuffle;
  elements.randombtn.style.color = iShuffle ? "green" : "white";
};
}
audio.onended = () => {
  if (iShuffle === true && play_Track_Default === true) {
      skipTrack(+1)
  }
  if (isTimerPlaying == true){
    updatePlayPauseUI();
    audio.play();
  }
};
function changeProgressColor() {
    var val = (elements.progress_test.value - elements.progress_test.min) /
    (elements.progress_test.max - elements.progress_test.min) * 100;
  const randomColor1 = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  elements.progress_test.style.background = `linear-gradient(to right,
  ${randomColor1}
  ${val}%, #333 ${val}%)`;
}

window.onload = () => {
  changeProgressColor();
};

 setInterval(()=>{
   changeProgressColor()
 },2000);

const { innerWidth: x, innerHeight: y } = window;

function updatethanhcc() {
  elements.otherplaybtn.addEventListener('click', () => {
    //document.body.style.position = "fixed";
    animatePlayer(y)
    elements.music_player.style.top = `${y + 50}px`;
    elements.music_player.style.height =`${y + 20}px`;
  });
  elements.menu.addEventListener("click", () => {
    unanimatePlayer(y);
    elements.music_player.style.top = "11px";
    elements.music_player.style.height =`${y + 20}px`;
   // document.body.style.position = "";
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
fetchHTML("library.html",".libraryhtml","js/library.js")
function updateGreeting() {
  const hour = new Date().getHours();
  elements.loichao.innerHTML = hour < 12 ? "Chào buổi sáng!" : hour <= 17 ? "Chào buổi chiều!" : "Chào buổi tối!";
}

function setActiveIcon(activeIcon) {
  [elements.icon1, elements.icon2, elements.icon3].forEach(icon => {
    icon.style.background = icon === activeIcon ? 'white' : '#272525';
    icon.style.color = icon === activeIcon ? 'black' : 'white';
  });
}

function icolor(imausac) {
  imausac.style.color = 'white';
  [elements.i1, elements.i2, elements.i3].forEach(maui => {
    if (maui !== imausac) maui.style.color = '#272525';
  });
}
elements.i1.style.color = "white";
if(elements.i1.style.color === "white"){
    elements.i2.style.color = "#272525";
    elements.i3.style.color = "#272525"
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

let isPlayerVisible = false;

function animatePlayer(y) {  // y là chiều cao player, có thể thay đổi
  if (isPlayerVisible) return;
  isPlayerVisible = true;

  const tl = gsap.timeline();

  // Bắt đầu bằng việc hiển thị
  tl.set("#music-player", { display: "block", height: 0, y: y + 50, top: y + 50 });

  // Mở player lên
  tl.to("#music-player", {
    height: y,
    y: 0,
    top: 0,
    duration: 0.35,
    ease: "power3.out"
  });

  animation_mp();
}

function unanimatePlayer(y) {
  if (!isPlayerVisible) return;
  isPlayerVisible = false;
  const i2 = gsap.timeline()
  i2.set("#music-player",  {
  height: y,
  y: 0,
  top: "10em"
  });
  i2.to("#music-player", {
    height: y,
    y: 0,
    top: y,
    duration: 0.35,
    ease: "power3.out"
  })
  i2.set("#music-player",{
    display: "none"
  })
}
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
  const sing = $(".audio-singer");
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
  else if (/Tablet|iPad/i.test(userAgent)) window.location.href = "login.html"
}

elements.usericon.onclick = () => {
  elements.thanhcc.style.display = "none";
  elements.home.style.display = "none";
  elements.control1.style.display = "none";
  elements.settinghtml.style.display = "block";
};

function animation_mp() {
  gsap.fromTo([".p-name", ".i-artist", ".img-img"],
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.05
    }
  );
}
function menu_nhac() {
  gsap.killTweensOf(".menu-nhac"); // Dừng animation trước
  elements.menunhac.style.display = "block"; // Hiện menu

  gsap.fromTo(".menu-nhac",
    { width: "0px" },
    { width: "94%", ease: "power3.out", duration: 0.5 }
  );

  animation_mp();
}
window.addEventListener('beforeunload', () => {
  navigator.sendBeacon('/savehistory', JSON.stringify({
    title: playlist.title,
    id: playlist.id,
    channel: playlist.channel,
    timestamp: Date.now()
  }));
});

window.addEventListener('resize', updatethanhcc);
const home = document.querySelector(".homehtml");

home.addEventListener("scroll", () => {
  elements.control1.style.transform = home.scrollTop > 50 
    ? "translateY(-100px)" 
    : "translateY(0)";
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
updatethanhcc();
updateGreeting();
checkDevice();
let play_track_replay;
function playTrack_nghelai(track) {
  const isNumber = /^\d+$/.test(String(track));
  if (isNumber) {
    loadTrack(track);
    play_audio_with_video = false;
    play_Track_Default = true;
  } else {
    playTrack_listenAgin(track)
    play_Track_Default = false;
    play_audio_with_video = false;
  }
}
function stopOtherMedia() {
  audio.pause();
  video.pause();
  audio.removeAttribute("src");
  video.removeAttribute("src");
  audio.load();
  video.load();
}
elements.options.style.display = "none"
function turnOffOptions(){
  const i2 = gsap.timeline()
  i2.set(".options",  {
  height: 0,
  y: 0,
  top: "10em"
  });
  i2.to(".options", {
    height: y,
    y: 0,
    top: y,
    duration: 0.35,
    ease: "power3.out"
  })
  i2.set(".options",{
    display: "none"
  })
  const i = gsap.timeline();
  i.set(".list_playList_want_add_div",  {
  height: 0,
  y: 0,
  top: "-8em"
  });
  i.to(".list_playList_want_add_div", {
    height: "60%",
    y: 0,
    top: y,
    duration: 0.35,
    ease: "power3.out"
  });
  i.set(".list_playList_want_add_div",{
    display: "none"
  });
}
function moreOptions(){
  const Y = innerHeight;
  const i = gsap.timeline()
  i.set(".options", {
    display: "block",
    height: 0,
    y: Y + 50,
    top: Y + 50
    });
  i.to(".options", {
    height: Y,
    y: 0,
    top: "10em",
    duration: 0.35,
    ease: "power3.out"
  })
}
elements.music_player.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });
elements.options.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });
elements.share.addEventListener("click", ()=>{
  copySpecificLink();
})
function copySpecificLink() {
  const data = data_all_track.id;
  const linkToCopy = `https://music.youtube.com/watch?v=${data}`;
  navigator.clipboard?.writeText(linkToCopy)
    Swal.fire("đã copy link" ,"","success")
}