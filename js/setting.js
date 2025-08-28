var $$item = document.querySelector.bind(document),
  changebackgound = $$item(".change-backgound"),
  info_account = $$item(".info-account"),
  back2 = $$item(".back-2"),
  changeui = $$item(".change-ui"),
  checkbox = $$item(".check-box"),
  container3 = $$item(".container-3"),
  submit = $$item(".submit"),
  back1 = $$item(".back-1"),
  back3 = $$item(".back-3"),
  container4 = $$item(".container_4"),
  container2 = $$item(".container-2"),
  container = $$item(".container"),
  checkplayvideo = $$item("#check-play_video"),
  audio_quality_64k = $$item(".audio_quality_64k"),
  audio_quality_128k = $$item(".audio_quality_128k"),
  audio_quality_256k = $$item(".audio_quality_256k");
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

// Khi tải lại trang, kiểm tra và áp dụng hình nền từ localStorage
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

  saveSetting(isChecked);
  pullOutData_search();
});
function pullAudio_quality_main() {
  const raw = JSON.parse(localStorage.getItem("setting"));
  if (!raw) return "64k"
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
    ui_checkplay();
  } else if (a === "128k") {
    audio_quality_128k.checked = true;
    audio_quality_64k.checked = false;
    audio_quality_256k.checked = false;
    localStorage.setItem("setting", JSON.stringify
      ({
        checkplay: false,
        audio_quality: "128k"
      }));
    ui_checkplay();
  } else if (a === "256k") {
    audio_quality_256k.checked = true;
    audio_quality_64k.checked = false;
    audio_quality_128k.checked = false;
    localStorage.setItem("setting", JSON.stringify
      ({
        checkplay: false,
        audio_quality: "256k"
      }));
    ui_checkplay();
  }
}
audio_quality_64k.addEventListener("change", () => {
  if (audio_quality_64k.checked) {
    const value = "64k";
    setVaule_audioQuality(value);
    saveSetting_audioQuality(value);
  }
});
audio_quality_128k.addEventListener("change", () => {
  if (audio_quality_128k.checked) {
    const value = "128k";
    setVaule_audioQuality(value);
    saveSetting_audioQuality(value);
  }
});
audio_quality_256k.addEventListener("change", () => {
  if (audio_quality_256k.checked) {
    const value = "256k";
    setVaule_audioQuality(value);
    saveSetting_audioQuality(value);
  }
})
function ui_checkplay() {
  const raw = JSON.parse(localStorage.getItem("setting"));
  if (!raw) return false;
  const is64k = raw.checkplay;
  checkplayvideo.checked = is64k;
}
function saveSetting_audioQuality(value) {
  const t = pullOutData_main();
  localStorage.setItem("setting", JSON.stringify
    ({
      checkplay: t,
      audio_quality: value || "64k"
    }));
}
function saveSetting(value) {
  const t = pullAudio_quality_main();
  localStorage.setItem("setting", JSON.stringify
    ({
      checkplay: value,
      audio_quality: t
    }));
}
function pullOutData_search() {
  const data = JSON.parse(localStorage.getItem("setting"));
  if (data && typeof data.checkplay === "boolean") {
    checkplayvideo.checked = data.checkplay;
    if (data.checkplay) {
      checkplayvideo.classList.add("active");
    } else {
      checkplayvideo.classList.remove("active");
    }
  }
}
pullOutData_search();