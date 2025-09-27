const changebackgound = $(".change-backgound"),
  info_account = $(".info-account"),
  back2 = $(".back-2"),
  changeui = $(".change-ui"),
  checkbox = $(".check-box"),
  container3 = $(".container-3"),
  submit = $(".submit"),
  back1 = $(".back-1"),
  back3 = $(".back-3"),
  container4 = $(".container_4"),
  container2 = $(".container-2"),
  container = $(".container"),
  checkplayvideo = $("#check-play_video"),
  audio_quality_64k = $(".audio_quality_64k"),
  audio_quality_128k = $(".audio_quality_128k"),
  audio_quality_256k = $(".audio_quality_256k"),
  saveTrackLastTimeBtn = $("#SaveTrackLastTimeBtn"),
  lyric_yt = $(".lyric_yt"),
  lyric_musixmath = $(".lyric_musixMath");
changebackgound.onclick = () => {
  container2.style.display = "block";
  container.style.display = "none";
};
back3.onclick = () => {
  container4.style.display = "none";
  container.style.display = "block";
};
back1.onclick = () => {
  container2.style.display = "none";
  container.style.display = "block";
};
changeui.onclick = () => {
  container3.style.display = "block";
  container.style.display = "none";
};
info_account.onclick = () => {
  saveSetting();
  container4.style.display = "block";
  container.style.display = "none";
};
back2.onclick = () => {
  container3.style.display = "none";
  container.style.display = "block";
};
checkbox.onclick = () => {
  document.body.style.background = "#000000";
};// Sự kiện khi nhấn nút "Đồng ý"
document.querySelector(".submit").addEventListener("click", function () {
  const fileInput = document.querySelector(".file");
  const file = fileInput.files[0];

  if (!file) {
    alert("Vui lòng chọn một tệp ảnh.");
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Vui lòng chọn một tệp ảnh hợp lệ (JPG, PNG, GIF, ...)");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const imageUrl = e.target.result;
    setBackgroundImage(imageUrl);
    localStorage.setItem("backgroundImage", JSON.stringify(imageUrl));
  };
  reader.readAsDataURL(file);
});

// Hàm thiết lập hình nền
function setBackgroundImage(imageUrl) {
  document.body.style.backgroundImage = `url(${imageUrl})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
}
setTimeout(() => {
  const savedImageUrl = JSON.parse(localStorage.getItem("backgroundImage"));
  if (savedImageUrl) {
    setBackgroundImage(savedImageUrl);
  }
}, 2000);
// Xoá hình nền đã lưu trong localStorage
document.querySelector(".clear-background").addEventListener("click", function () {
  localStorage.removeItem("backgroundImage");
  document.body.style.backgroundImage = "none";
});
const back = document.querySelector("#back");
back.onclick = function () {
  elements.thanhcc.style.display = "block";
  elements.home.style.display = "block";
  elements.control1.style.display = "block";
  elements.settinghtml.style.display = "none";
};
checkplayvideo.addEventListener("change", () => {
  const isChecked = checkplayvideo.checked;

  if (isChecked) {
    checkplayvideo.classList.add("active");
  } else {
    checkplayvideo.classList.remove("active");
  }

  saveSetting("checkplay",isChecked);
});
saveTrackLastTimeBtn.addEventListener("change", () => {
  const isChecked = saveTrackLastTimeBtn.checked;
  saveSetting("saveTrackLastTime",isChecked);
});
function saveSetting(name, value) {
 let data = name;
  const defaultSettings = {
    checkplay: false,
    audio_quality: "64k",
    saveTrackLastTime: true,
    lyric_platform: "lyric_yt"
  };
  let settings = JSON.parse(localStorage.getItem("setting")) || defaultSettings;
  settings[data] = value;
  localStorage.setItem("setting", JSON.stringify(settings));
}
function UiSetting() {
  const data = JSON.parse(localStorage.getItem("setting"));
  if(!data)return;
  if(data.lyric_platform === "lyric_yt"){
    lyric_yt.checked = true;
    lyric_musixmath.checked = false;
  }else if(data.lyric_platform === "lyric_musixmath"){
    lyric_musixmath.checked = true;
    lyric_yt.checked = false;
  }
  saveTrackLastTimeBtn.checked = data.saveTrackLastTime;
  checkplayvideo.checked = data.checkplay;
}
UiSetting();
function pullAudio_quality_main() {
  const raw = JSON.parse(localStorage.getItem("setting"));
  if (!raw) return "64k";
  let a = raw.audio_quality;
  setVaule_audioQuality(a);
  return a;
}
pullAudio_quality_main();
function setVaule_audioQuality(a) {
  if (a === "64k") {
    audio_quality_64k.checked = true;
    audio_quality_128k.checked = false;
    audio_quality_256k.checked = false;
    saveSetting("audio_quality","64k");
  } else if (a === "128k") {
    audio_quality_128k.checked = true;
    audio_quality_64k.checked = false;
    audio_quality_256k.checked = false;
    saveSetting("audio_quality","128k");
  } else if (a === "256k") {
    audio_quality_256k.checked = true;
    audio_quality_64k.checked = false;
    audio_quality_128k.checked = false;
    saveSetting("audio_quality","256k");
  }
}
audio_quality_64k.addEventListener("change", () => {
  if (audio_quality_64k.checked) {
    const value = "64k";
    setVaule_audioQuality(value);
  }
});
audio_quality_128k.addEventListener("change", () => {
  if (audio_quality_128k.checked) {
    const value = "128k";
    setVaule_audioQuality(value);
  }
})
audio_quality_256k.addEventListener("change", () => {
  if (audio_quality_256k.checked) {
    const value = "256k";
    setVaule_audioQuality(value);
  }
})
lyric_yt.addEventListener("change", ()=>{
  const isChecked = saveTrackLastTimeBtn.checked;
  saveSetting("lyric_platform","lyric_yt");
  uiFlatformLyric()
})
lyric_musixmath.addEventListener("change",()=>{
  const isChecked = saveTrackLastTimeBtn.checked;
  saveSetting("lyric_platform","lyric_musixMath");
  uiFlatformLyric()
})
function getData_saveTrackLastTime() {
  const raw = JSON.parse(localStorage.getItem("setting"));
  if(!raw)return saveSetting();
  const t  = raw.saveTrackLastTime;
  return t;
}
function saveTrackLastTime() {
  if (!getData_saveTrackLastTime()) return;
  localStorage.setItem("saveTrackLastTime", JSON.stringify(data_all_track));
}

function loadTrackLastTime() {
  const track = JSON.parse(localStorage.getItem("saveTrackLastTime"));
  if(!track) return;
  const isNumber = /^\d+$/.test(String(track.id));
  if (!isNumber) {
    innerInterface(track);
    playAudioFromDB(track.id,pullAudio_quality_main())
    menu_nhac();
    chuchay();
  }else{
    loadTrack(track.id);
    chuchay();
    menu_nhac();
  }
  return null;
}
loadTrackLastTime();