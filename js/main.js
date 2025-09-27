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
  turnOffOptions: $(".turnOff-options")
  , options: $(".options"),
  share: $(".share"),
  btn_remove: $(".btn-remove")
};
const playingTrackName = $(".playing-track-name");
const video = $(".video");
let tracks = [];
let isApp = false;
let randomtrackIndex = 0;
let isTimerPlaying = false;
let iShuffle = false;
const audio = $(".audio");
let data_all_track;
let isSaveTrackLastTime;
let next_track_from = "home";
let name_play_list_now;
let play_Track_Default = true;
function pullOutData_main() {
  const raw = JSON.parse(localStorage.getItem("setting"));
  if (!raw) return false;
  let a = raw.checkplay;
  return a;
}
let play_audio_with_video = pullOutData_main();
async function yeucau(callback) {
  try {
    const data = await fetch("json/track.json");
    const response = await data.json();
    tracks = response;
    callback(response);
    return response;
  } catch (error) {
  }
}
function randomIndex() {
  if (play_Track_Default === true) {
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
  saveTrackLastTime();
  innerInterface(track);
  if (isApp) {
   window.createMusicControls(track);
  }
  audio.src = track.source;
  audio.load();
}
function innerInterface(track) {
  elements.img.src = track.img||track.thumbnail;
  elements.audio_title.innerText = track.name||track.title;
  elements.singer.innerText = track.artist||track.channel;
  playingTrackName.innerText = track.name||track.title;
  elements.menuphatnhac.innerHTML = `
    <img class="img-img" src="${track.img||track.thumbnail}">
    <div class="text-menu-nhac">
      <p class="p-name">${track.name||track.title}</p>
      <i class="i-artist">${track.channel}</i>
    </div>`;
    data_all_track = track;
  const isNumber = /^\d+$/.test(String(track));
  updatePlayPauseUI();
  media_audio_or_video();
  formatUi();
  resetProgress();
  saveHistory(track);
  playAudio_withVideo();
  setPaletteColors(track.img||track.thumbnail);
  setupMediaSession(track);
  chuchay();
  menu_nhac();
  mediaSession(track);
  playAudio_withVideo();
  saveHistory(track);
  change_media();
  if(!isNumber){
  getInfo_video(track.id);
  }
  removeOld_srcImg(track);
  if(isApp){ 
    window.createMusicControls(track);
  }
}
function rgbToHex([r, g, b]) {
  return "#" + [r, g, b]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("");
}
async function setPaletteColors(imgUrl) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgUrl;
  img.onload = () => {
    const colorThief = new ColorThief();
    const palette = colorThief.getPalette(img, 3);
    const hexColors = palette.map(rgbToHex);
     extractBestColors(hexColors);
  };
  extractColor(imgUrl);
}
async function extractBestColors(colors,options = {}) {
  const data = {
    primary: `${colors[0]}`,
    secondary: `${colors[1]}`, 
    accent: `${colors[2]}`
  };
  const settings = {
    intensity: options.intensity || 0.7,
    blur: options.blur || false,
    animation: options.animation || false,
    ...options
  };
  applyAdvancedGradient(data, settings);
}

function applyAdvancedGradient(colors, settings) {
  const { primary, secondary, accent } = colors;
  const opacity = Math.round(settings.intensity * 100);
  let gradient = `
    radial-gradient(circle at 20% 20%, ${darkenColor(secondary, 53)} 0%, transparent 80%),
    radial-gradient(circle at 20% 20%, ${darkenColor(primary, 10)} 0%, transparent 80%),
    radial-gradient(circle at 20% 20%, ${darkenColor(accent, 30)}${opacity.toString(16)} 0%, transparent 80%),
    radial-gradient(circle at 60% 60%, ${lightenColor(primary, 20)}${opacity.toString(16)} 0%, transparent 10%),
    linear-gradient(to bottom, ${darkenColor(primary, 30)}FF 0%, ${darkenColor(secondary, 20)}FF 30%, #000000 50%, #000000 100%)
  `;
  if (settings.blur) {
    gradient += `, blur(20px)`;
  }
  
  if (elements.musiclo) {
    elements.musiclo.style.background = gradient;
    elements.musiclo.style.transition = "background 0.8s ease-in-out";
    
    if (settings.animation) {
      elements.musiclo.style.animation = "gradientShift 10s ease-in-out infinite";
    }
  }
}

// CSS Animation (thêm vào stylesheet)
const style = document.createElement('style');
style.textContent = `
  @keyframes gradientShift {
    0%, 100% { filter: hue-rotate(0deg); }
    25% { filter: hue-rotate(10deg); }
    50% { filter: hue-rotate(-5deg); }
    75% { filter: hue-rotate(15deg); }
  }
`;
function darkenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  
  return "#" + (
    0x1000000 +
    R * 0x10000 +
    G * 0x100 +
    B
  ).toString(16).slice(1).toUpperCase();
}
function lightenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  
  return "#" + (
    0x1000000 +
    R * 0x10000 +
    G * 0x100 +
    B
  ).toString(16).slice(1).toUpperCase();
}

document.head.appendChild(style);
function extractColor(imgUrl) {
  const img = new Image();
  img.crossOrigin = "anonymous"; // tránh lỗi CORS
  img.src = imgUrl;

  img.onload = () => {
    const colorThief = new ColorThief();
    const [r, g, b] = colorThief.getColor(img);
    elements.menunhac.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  };
}
function formatUi() {
if (play_audio_with_video) {
  video.onplay = () => {
    updatePlayPauseUI();
  };
  video.onpause = () => {
    updatePlayPauseUI();
  };
} else {
  //audio
  audio.onpause = () => {
    updatePlayPauseUI();
  };

  audio.onplay = () => {
    updatePlayPauseUI();
  };
}
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
function setupMediaSession(track) {
  if (!('mediaSession' in navigator)) return;
  const isVideo = String(play_audio_with_video).toLowerCase() === "true";
  const media = isVideo ? video : audio;
  if (isVideo) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.name || track.title,
      artist: track.artist || track.channel,
      artwork: [
        { src: track.img||track.thumbnail, sizes: '96x96', type: 'image/jpeg' },
        { src: track.img||track.thumbnail, sizes: '128x128', type: 'image/jpeg' }
      ]
    });
    navigator.mediaSession.setActionHandler('play', () => media.play());
    navigator.mediaSession.setActionHandler('pause', () => media.pause());
    navigator.mediaSession.setActionHandler('nexttrack', () => skipTrack(1));
    navigator.mediaSession.setActionHandler('previoustrack', () => skipTrack(-1));
  }
}
function skipTrack(direction) {
  if (next_track_from === "home") {
    randomtrackIndex = (randomtrackIndex + direction + tracks.length) % tracks.length
    loadTrack(randomtrackIndex);
    if (audio.paused) {
      isTimerPlaying = true;
      audio.play();
      updatePlayPauseUI();
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
function media_audio_or_video() {
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
audio.addEventListener('timeupdate', function() {
    window.updateElapsedTime(media.currentTime);
});
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
  const isVideo = String(pullOutData_main()).toLowerCase() === "true";
  const media = isVideo ? video : audio;
  if (media.paused) {
    media.play();
    isTimerPlaying = true;
     window.updatePlayingState(true);
  } else {
    media.pause();
    isTimerPlaying = false;
     window.updatePlayingState(false);
  }
  updatePlayPauseUI();
}

elements.playbtn2.onclick = togglePlayPause;
elements.playBtn.onclick = togglePlayPause;

elements.skipForward.addEventListener('click', () => {
  if (next_track_from === "home") {
    skipTrack(1);
     console.log("home")
  } else if(next_track_from === "search"){
    next_track(+1);
     console.log("search")
  }else if(next_track_from === "library"){
     console.log("library")
    next_track_libary(+1,name_play_list_now)
  }}
)
elements.skipBack.addEventListener('click', () => {
  if (next_track_from === "home") {
    skipTrack(-1);
  } else if(next_track_from === "search"){
    next_track(-1);
  }else if(next_track_from === "library"){
    next_track_libary(-1,name_play_list_now)
  }}
)
if (play_audio_with_video === false) {
  elements.replay.onclick = () => {
    audio.loop = !audio.loop;
    elements.replay.style.color = audio.loop ? "green" : "white";
  };

  elements.randombtn.onclick = () => {
    iShuffle = !iShuffle;
    elements.randombtn.style.color = iShuffle ? "green" : "white";
  };
} else {
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
  if (isTimerPlaying == true) {
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

setInterval(() => {
  changeProgressColor()
}, 2000);

const { innerWidth: x, innerHeight: y } = window;

function updatethanhcc() {
  elements.otherplaybtn.addEventListener('click', () => {
    //document.body.style.position = "fixed";
    animatePlayer(y)
    elements.music_player.style.top = `${y + 50}px`;
    elements.music_player.style.height = `${y + 20}px`;
  });
  elements.menu.addEventListener("click", () => {
    unanimatePlayer(y);
    elements.music_player.style.top = "11px";
    elements.music_player.style.height = `${y + 20}px`;
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

fetchHTML('page/home.html', '.homehtml', "js/home.js");
fetchHTML("page/search.html", ".searchhtml", "js/search.js");
fetchHTML("page/setting.html", ".settinghtml", "js/setting.js");
fetchHTML("page/library.html", ".libraryhtml", "js/library.js")
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
if (elements.i1.style.color === "white") {
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
  i2.set("#music-player", {
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
  i2.set("#music-player", {
    display: "none"
  })
}
let animationFrameId1 = null;
let animationFrameId2 = null;
let animationFrameId3 = null;
function chuchay() {
  const menunhactext = document.querySelector(".text-menu-nhac");
  const pname = document.querySelector(".p-name");
  if (!menunhactext || !pname) return;

  const menunhacWidth = menunhactext.offsetWidth;
  const textWidth = pname.scrollWidth;
  pname.style.transform = "translateX(0)";
  if (textWidth <= menunhacWidth) {
    pname.style.transform = "translateX(0)";
    return;
  }
  let position = menunhacWidth;
  if (animationFrameId1) cancelAnimationFrame(animationFrameId1);

  function animation() {
    position -= 1;
    if (position < -textWidth) {
      position = menunhacWidth;
    }
    pname.style.transform = `translateX(${position}px)`;
    animationFrameId1 = requestAnimationFrame(animation);
  }
  animation();
  setTimeout(()=>{
    chuchay_2();
  })
}
function chuchay_2() {
  const audio_title = document.querySelector(".audio-title");
  const sing = document.querySelector(".title-sing");
  if (!audio_title || !sing) return;
  const singerWidth = sing.offsetWidth;
  const audiotitleWidth = audio_title.scrollWidth;
  audio_title.style.transform = "translateX(0px)";
  audio_title.style.left = "2px";
  cancelAnimationFrame(animationFrameId2);
  if (audiotitleWidth <= singerWidth) {
    audio_title.style.transform = "translateX(0px)";
    return;
  }
  let position = singerWidth;

  function animation_2() {
    position -= 1;
    if (position < -audiotitleWidth) {
      position = singerWidth;
    }
    audio_title.style.transform = `translateX(${position}px)`;
    animationFrameId2 = requestAnimationFrame(animation_2);
  }

  animation_2();
}
/*function chuchay_3(menunhactext,pname) {
  const menunhactext = document.querySelector(".text-menu-nhac");
  const pname = document.querySelector(".p-name");
  if (!menunhactext || !pname) return;
  let  animationFrameId = null;
  const menunhacWidth = menunhactext.offsetWidth;
  const textWidth = pname.scrollWidth;
  pname.style.transform = "translateX(0)";
  if (textWidth <= menunhacWidth) {
    pname.style.transform = "translateX(0)";
    return;
  let position = menunhacWidth;
  if (animationFrameId) cancelAnimationFrame(animationFrameId)

  function animation() {
    position -= 1;
    if (position < -textWidth) {
      position = menunhacWidth;
    }
    pname.style.transform = `translateX(${position}px)`;
    animationFrameId = requestAnimationFrame(animation);
  }
  animation();
}*/
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
  gsap.killTweensOf(".menu-nhac");
  elements.menunhac.style.display = "block";
  gsap.fromTo(".menu-nhac",
    { width: "0px" },
    { width: "94%", ease: "power3.out", duration: 0.5 }
  );
  animation_mp();
  setTimeout(() => {
    chuchay_2();
  }, 1000)
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
/*if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}*/
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
function turnOffOptions() {
  const i2 = gsap.timeline()
  i2.set(".options", {
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
  i2.set(".options", {
    display: "none"
  })
  const i = gsap.timeline();
  i.set(".list_playList_want_add_div", {
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
  i.set(".list_playList_want_add_div", {
    display: "none"
  });
}
function moreOptions() {
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
elements.music_player.addEventListener('touchmove', function (e) {
  e.preventDefault();
}, { passive: false });
elements.options.addEventListener('touchmove', function (e) {
  e.preventDefault();
}, { passive: false });
elements.share.addEventListener("click", () => {
  copySpecificLink();
})
function copySpecificLink() {
  const data = data_all_track.id;
  const linkToCopy = `https://music.youtube.com/watch?v=${data}`;
  navigator.clipboard?.writeText(linkToCopy)
  Swal.fire("đã copy link", "", "success")
}
document.addEventListener("contextmenu", function(event){
  event.preventDefault();
});
class DevToolsChecker extends Error {
  toString() {
    return "mở devtool lm j đấy bn ơi 😒";
  }
  get message() {
    return "mở devtool lm j đấy bn ơi 😒";
  }
}
function detectDevTools() {
  const start = performance.now();
  debugger;
  const end = performance.now();
  if (end - start > 100) {
    console.log(new DevToolsChecker().message);
  }
}
setInterval(detectDevTools, 1000);
console.log(performance.now())
// Kiểm tra có phải native app không
if (window.isNativeApp()) {
    console.log('Đang chạy trên mobile app');
} else {
    console.log('Đang chạy trên web');
}

// Kiểm tra trạng thái plugins
console.log(window.getMusicControlsStatus());