var $$item = document.querySelector.bind(document),
changebackgound=$$item(".change-backgound"),
info_account = $$item(".info-account"),
back2 = $$item(".back-2"),
changeui =$$item(".change-ui"),
checkbox=$$item(".check-box"),
container3 = $$item(".container-3"),
submit = $$item(".submit"),
back1 = $$item(".back-1"),
back3 = $$item(".back-3"),
container4 = $$item(".container_4"),
container2 = $$item(".container-2"),
container = $$item(".container"),
checkplayvideo = $$item("#check-play_video")
changebackgound.onclick =()=>{
  container2.style.display = "block";
  container.style.display = "none";
};
back3.onclick = ()=>{
  container4.style.display = "none";
  container.style.display = "block";
};
back1.onclick =()=>{
  container2.style.display = "none";
  container.style.display = "block";
};
changeui.onclick =()=>{
  container3.style.display = "block";
  container.style.display = "none";
};
info_account.onclick = ()=>{
  container4.style.display = "block";
  container.style.display = "none";
};
back2.onclick =()=>{
  container3.style.display = "none";
  container.style.display = "block";
};
checkbox.onclick =()=>{
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
setTimeout(()=>{
  const savedImageUrl = JSON.parse(localStorage.getItem("backgroundImage"));
  if (savedImageUrl) {
    setBackgroundImage(savedImageUrl);
  }},2000);
// Xoá hình nền đã lưu trong localStorage
document.querySelector(".clear-background").addEventListener("click", function () {
  localStorage.removeItem("backgroundImage");
  document.body.style.backgroundImage = "none";
});

var dataUser = [];

function getdatauser(callback) {
  fetch("json/datauser.json", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charscet=UTF-8"
    }
  })
  .then(response => response.json())
  .then(data => {
    dataUser = data;
    callback();
  });
}
getdatauser(getsettingdata);

function getsettingdata() {
  var userSetting = dataUser.find(userSt => userSt.oledbackgrond === "true");
  if (userSetting) {
    document.body.style.background = "#000";
  }
  
}
const back = document.querySelector("#back");
back.onclick = function(){
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

function saveSetting(value) {
  // Lưu trực tiếp Boolean vào localStorage
  localStorage.setItem("setting", JSON.stringify({ checkplay: value }));
}
function pullOutData_search(){
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