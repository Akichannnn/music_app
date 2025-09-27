const $library = document.querySelector.bind(document);
const addPlayList_local = $library(".addPlayList_local"),
  list_playList_dad = $library(".list_playList_dad"),
  ok_btn_library = $library(".ok_btn_library"),
  album_of_you_list = $library(".album_of_you_list"),
  playList_library = $library(".playList_library"),
  list_playList_want_add = $library(".list_playList_want_add"),
  list_playList_want_add_ = $library(".list_playList_want_add"),
  ti_caret_down_btn = $library(".ti-caret-down-btn"),
  setTime_Sleep = $library(".setTime_Sleep"),
  album = $library(".album"),
  turnOff_album = $library(".turnOff-album"),
  library = $library(".library"),
  interface_album_img = $library(".interface_album_img"),
  interface_album_h3 = $library(".interface_album_h3"),
  interface_album_i = $library(".interface_album_i"),
  interface_album_div = $library(".interface_album_div"),
  turnOff_interface_album_menu = $library(".turnOff-interface_album_menu"),
  interface_album_menu = $library(".interface_album_menu"),
  more_playList_options = $library(".ti-circle-dashed-plus"),
  rename_playList = $library(".ti-pencil"),
  changeNew_img = $library(".ti-photo-edit"),
  changeNew_describe = $library(".ti-highlight"),
  ti_player_play = $library(".ti-player-play");
const now = new Date();
const fullDateTime = now.toLocaleString();
addPlayList_local.addEventListener("click", () => {
  const Y = innerHeight;
  const i = gsap.timeline();
  i.set(".list_playList_want_add_div", {
    display: "block",
    height: 0,
    top: "10em"
  });
  i.to(".list_playList_want_add_div", {
    height: "60%",
    y: 0,
    top: "-12em",
    duration: 0.35,
    ease: "power3.out"
  });
  list_playList_Want_Add();
});
ok_btn_library.addEventListener("click", () => { pop_up_create_playList() });
ti_caret_down_btn.addEventListener("click", () => {
  const i2 = gsap.timeline();
  i2.set(".list_playList_want_add_div", {
    height: 0,
    y: 0,
    top: "-8em"
  });
  i2.to(".list_playList_want_add_div", {
    height: "60%",
    y: 0,
    top: y,
    duration: 0.35,
    ease: "power3.out"
  });
  i2.set(".list_playList_want_add_div", {
    display: "none"
  });
});
turnOff_interface_album_menu.addEventListener("click", () => {
  const i = gsap.timeline();
  i.set(".interface_album_menu", {
    top: "-18em",
    background: "black",
    height: "90%",
    y: 0,
  });
  i.to(".interface_album_menu", {
    height: "90%",
    y: 0,
    top: y,
    duration: 0.35,
    ease: "power3.out"
  });
  i.set(".interface_album_menu", {
    display: "none"
  });
});
more_playList_options.addEventListener("click", () => {
  const i = gsap.timeline();
  i.set(".interface_album_menu", {
    display: "block",
    top: y,
    background: "black",
    height: "90%",
    y: 0,
  });
  i.to(".interface_album_menu", {
    height: "90%",
    y: 0,
    top: "-18em",
    duration: 0.35,
    ease: "power3.out"
  });
});
function save_list_playList(value) {
  const max = 5;
  let name = value.trim() === "" ? "danh sách phát" : value.trim();
  let data = JSON.parse(localStorage.getItem("list_playList")) || [];
  if(!data) return add_addPlayList_local("danh sách phát");
  let list_playList = data;
  if (list_playList.length >= max) {
    Swal.fire({
      title: "List playlist đã đạt tối đa!",
      icon: "warning",
      background: "black",
      confirmButtonText: "Được rồi"
    });
    return;
  }

  const exists = list_playList.find(item => item.name === name);

  if (exists) {
    const t = `danh sách phát-${list_playList.length + 1}`;
    add_addPlayList_local(t);
    list_playList.push({ name: t });
  } else {
    add_addPlayList_local(name);
    list_playList.push({ name });
  }

  localStorage.setItem("list_playList", JSON.stringify(list_playList));
}
function addPlayList_Local(name, track) {
  let data = JSON.parse(localStorage.getItem(name)) || {
    info: {
      name_playList: name,
      url_img: "img/new_icon.png",
      describe: "Tất cả đều là những bài hát tôi yêu thích",
      create_at: fullDateTime
    },
    tracks: []
  };

  const exists = data.tracks.find(item => track.id === item.id);
  if (exists) {
    Swal.fire("bạn đã lưu bài này rồi!", "", "fail");
    return;
  }
  data.tracks.unshift(track);
  data.tracks = data.tracks.slice(0, 100);
  localStorage.setItem(name, JSON.stringify(data));
}
function add_addPlayList_local(value) {
  let name = value === "" ? "danh sách phát" : value;
  const data = JSON.parse(localStorage.getItem("list_playList"));
  if (!data) {
    const data_playList = {
      info: {
        name_playList: name,
        url_img: "img/new_icon.png",
        describe: " tất cả đều là những bài hát tôi yêu thích",
        create_at: fullDateTime
      },
      tracks: []
    };
    localStorage.setItem(value, JSON.stringify(data_playList));
  }else{
  const exists = data.find(item => item.name === value);
  if (!exists) {
    const data_playList = {
      info: {
        name_playList: name,
        url_img: "img/new_icon.png",
        describe: " tất cả đều là những bài hát tôi yêu thích",
        create_at: fullDateTime
      },
      tracks: []
    };
    localStorage.setItem(value, JSON.stringify(data_playList));
  }
  }
}
function innerPlayList() {
  const list = JSON.parse(localStorage.getItem("list_playList")) || [];
  album_of_you_list.innerHTML = " ";
  const fragment = document.createDocumentFragment();
  list.forEach(name => {
    const data = JSON.parse(localStorage.getItem(name.name));
    if (!data) return;
    const list_playList = document.createElement("ol");
    list_playList.className = "list_playList_css";
    list_playList.innerHTML = `
      <img src="${data.info.url_img}">
       <h4>${data.info.name_playList}</h4>
      <i>${data.info.describe}</i>
    `;
    list_playList.addEventListener("click", () => {
      const i = gsap.timeline();
      i.set(".album", {
        display: "block",
        top: y,
        background: "black",
        height: y,
        y: 0,
      });
      i.to(".album", {
        height: y,
        y: 0,
        top: 0,
        duration: 0.35,
        ease: "power3.out"
      });
      name_play_list_now = name.name;
      library.style.display = "none";
      innerList_form_list_playList(`${name.name}`);
      getName_forFunction(name.name);
      inner_info(name);
    });
    fragment.appendChild(list_playList);
  });

  album_of_you_list.appendChild(fragment);
}
function getName_forFunction(name) {
  rename_playList.addEventListener("click", () => { rename_playlist(name) });
  changeNew_img.addEventListener("click", () => { changeNew_Img(name) });
  changeNew_describe.addEventListener("click", () => { changeNew_Describe(name) });
  ti_player_play.addEventListener("click", () => {
    playTrack_PlayList(name);
  });
}
innerPlayList();
function list_playList_Want_Add() {
  const data = JSON.parse(localStorage.getItem("list_playList")) || [];
  list_playList_want_add.innerHTML = ""; // Xoá nội dung cũ
  const fragment = document.createDocumentFragment();
  data.forEach(item => {
    const playlist = JSON.parse(localStorage.getItem(item.name));
    if (!playlist) return; // bỏ qua nếu playlist null
    const ol = document.createElement("ol");
    ol.innerText = item.name;
    ol.addEventListener("click", () => {
      const exists = playlist.tracks && playlist.tracks.find(track => track.id === data_all_track.id);
      if (exists) {
        Swal.fire("Bạn đã lưu bài này rồi!", "", "warning");
      } else {
        addPlayList_Local(item.name, data_all_track);
        Swal.fire("Saved!", "", "success");
      }
      const i2 = gsap.timeline();
      i2.set(".list_playList_want_add_div", {
        height: 0, y: 0, top: "-8em"
      });
      i2.to(".list_playList_want_add_div", { height: "60%", y: 0, top: y, duration: 0.35, ease: "power3.out" });
      i2.set(".list_playList_want_add_div", {
        display: "none"
      });
    });

    fragment.appendChild(ol);
  });

  list_playList_want_add.appendChild(fragment);
}
function innerList_form_list_playList(name) {
  const fragment = document.createDocumentFragment();
  playList_library.innerHTML = "";
  const listJson = localStorage.getItem(name);
  if (!listJson) {
    console.warn(`Không tìm thấy playlist với tên "${name}"`);
    return;
  }
  let list;
  try {
    list = JSON.parse(listJson);
  } catch (e) {
    console.error("❌ Lỗi parse JSON:", e);
    return;
  }

  const tracks = list.tracks || [];
  if (!Array.isArray(tracks)) {
    console.warn("❌ tracks không phải mảng:", tracks);
    return;
  }
  tracks.forEach((track,index) => {
    const ol = document.createElement("ol");
    ol.className = "kqtimkiem";
    ol.innerHTML = `
      <img class="img-kqtimkiem" src="${track.thumbnail || track.img || ''}"
      alt="Thumbnail" onclick="get_current_Index(${index})">
      <h5 class="ten-kqtimkiem">${track.title || track.name || 'Không rõ'}</h5>
      <br>
      <i class="casi-kqtimkiem">${track.channel || track.artist || 'Unknown'}</i>
    `;
    fragment.appendChild(ol);

    ol.addEventListener("click", () => {
      playTrack_FormPlayList(name, track.id);
      menu_nhac();
      get_current_Index(index)
      name_play_list_now = name;
      next_track_from = "library"
    });
  });

  playList_library.appendChild(fragment);
}
function inner_info(name) {
  const data = JSON.parse(localStorage.getItem(name.name || name));
  if (!data || !data.info) {
    console.error("❌ Không tìm thấy dữ liệu hoặc thiếu trường info!");
    return;
  }

  const data_info = data.info;
  interface_album_img.src = data_info.url_img || "img/default.png";
  interface_album_h3.innerText = data_info.name_playList || "Tên danh sách phát";
  interface_album_i.innerText = data_info.describe || "Không có mô tả";
  interface_album_div.innerText = `Danh sách được tạo vào: ${data_info.create_at || "Không rõ"}`;
}
function playTrack_FormPlayList(name_list, trackId) {
  const data = JSON.parse(localStorage.getItem(name_list)) || { tracks: [] };
  let list = data.tracks;
  const track = list.find(track => track.id === trackId);
  data_all_track = track;
  name_play_list_now = name;
  const isNumber = /^\d+$/.test(String(track?.id));
  if (isNumber) {
    loadTrack(track.id);
    menu_nhac();
    innerInterface(track);
    play_audio_with_video = false;
    play_Track_Default = true;
  } else {
    innerInterface(track)
    playAudioFromDB(track.id,pullAudio_quality_main())
    menu_nhac();
    next_track_from = "library";
    play_Track_Default = false;
    audio.onended = () => {
      if (!iShuffle & next_track_from === "library") {
    next_track_libary(+1,name_list)
      }};
  }
  if (isApp) {
    createMusicControls(track);
  }
}
album_of_you_list.style.width = `${x / 2 + 170}px`;
function pop_up_create_playList() {
  Swal.fire({
    title: "Vui lòng nhập tên danh sách của bạn!",
    icon: "info",
    background: "black",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "Được rồi!",
    input: "text"
  }).then((result) => {
    if (result.isConfirmed) {
      const value = result.value;
      Swal.fire("Saved!", "", "success");
      save_list_playList(value);
      innerPlayList();
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}
setTime_Sleep.addEventListener("click", () => {
  Swal.fire({
    title: "bạn muốn hẹn bao nhiêu phút?",
    icon: "info",
    background: "black",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "Được rồi!",
    input: "text"
  }).then((result) => {
    if (result.isConfirmed) {
      const value = result.value;
      Swal.fire("đã hẹn thời gian đi ngủ!", "", "success");
      setSleepTimer(value);
    }
  });
})
let sleepTimerId = null;
function setSleepTimer(minutes) {
  clearSleepTimer();
  const milliseconds = minutes * 60 * 1000;
  sleepTimerId = setTimeout(() => {
    stopMusic();
    Swal.fire("Đã đến giờ đi ngủ", "chúc bạn ngủ ngon 🥰", "info");
  }, milliseconds);
  console.log(`Hẹn giờ đi ngủ sau ${minutes} phút`);
}

function clearSleepTimer() {
  if (sleepTimerId) {
    clearTimeout(sleepTimerId);
    sleepTimerId = null;
    console.log("Đã huỷ hẹn giờ đi ngủ");
  }
}
turnOff_album.addEventListener("click", () => {
  interface_album_menu.style.display = "none";
  library.style.display = "block";
  const i = gsap.timeline()
  i.set(".album", {
    top: "0.1em",
    background: "black",
    height: 0,
    y: 0,
  })
  i.to(".album", {
    height: y,
    y: 0,
    top: y,
    duration: 0.35,
    ease: "power3.out"
  })
  i.set(".album", {
    display: "none"
  })
})
function stopMusic() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}
function rename_playlist(oldName) {
  const data = JSON.parse(localStorage.getItem(oldName));
  let listPlayList = JSON.parse(localStorage.getItem("list_playList")) || [];
  Swal.fire({
    title: "Bạn muốn đổi tên thành gì?",
    icon: "question",
    background: "black",
    input: "text",
    showCancelButton: true,
    confirmButtonText: "Được rồi!"
  }).then((result) => {
    if (result.isConfirmed) {
      const newName = result.value.trim();
      if (newName) {
        const exists = localStorage.getItem(newName);
        if (exists) {
          Swal.fire("Tên này đã tồn tại!", "", "warning");
          return;
        }
        data.info.name_playList = newName;
        localStorage.setItem(newName, JSON.stringify(data));
        localStorage.removeItem(oldName);
        listPlayList = listPlayList.map(item =>
          item.name === oldName ? { ...item, name: newName } : item
        );
        localStorage.setItem("list_playList", JSON.stringify(listPlayList));
        Swal.fire("Đã đổi tên danh sách phát!", "", "success");
        inner_info(newName);
        innerPlayList(newName);
      } else {
        Swal.fire("Bạn chưa nhập gì cả!", "", "warning");
      }
    }
  });
}
function changeNew_Img(name) {
  const data = JSON.parse(localStorage.getItem(name));
  let n = name;
  Swal.fire({
    title: "Bạn muốn đổi ảnh thành gì?",
    input: 'file',                   // input kiểu file
    inputAttributes: {
      accept: 'image/*'              // chỉ chọn ảnh
    },
    background: "black",
    showCancelButton: true,
    confirmButtonText: "Được rồi!"
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const file = result.value;

      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;

        // Cập nhật lại localStorage của playlist
        data.info.url_img = imageUrl;
        localStorage.setItem(name, JSON.stringify(data));

        Swal.fire("Đã đổi ảnh danh sách phát", "", "success");
        inner_info(n)
        innerPlayList(n)
      };
      reader.readAsDataURL(file);
    } else {
      console.log("Người dùng đã huỷ hoặc không chọn file.");
    }
  });
}
function changeNew_Describe(name) {
  const data = JSON.parse(localStorage.getItem(name));
  let n = name;
  Swal.fire({
    title: "Bạn muốn đổi miêu tả của danh sách thành gì?",
    icon: "question",
    background: "black",
    input: "text",
    inputPlaceholder: "Nhập miêu tả mới...",
    showCancelButton: true,
    confirmButtonText: "Được rồi!"
  }).then((result) => {
    if (result.isConfirmed) {
      const value = result.value.trim();
      if (value) {
        data.info.describe = value;
        localStorage.setItem(name, JSON.stringify(data));
        inner_info(n)
        innerPlayList(n);
        Swal.fire("Đã đổi miêu tả danh sách phát!", "", "success");
      } else {
        Swal.fire("Bạn chưa nhập gì cả!", "", "warning");
      }
    }
  });
}
album.style.height = `${(y / 2) + 300}px`;
interface_album_menu.addEventListener('touchmove', function (e) {
  e.preventDefault();
}, { passive: false });
function playTrack_PlayList(name) {
  if(name_play_list_now === "library"){
  const data = JSON.parse(localStorage.getItem(name)) || { tracks: [] };
  let list = data.tracks;
  current_Index = 0;
  const return_what = list[0];
  name_play_list_now = name;
  const isNumber = /^\d+$/.test(String(return_what.id));
  if (isNumber) {
    loadTrack(return_what.id);
    menu_nhac();
    play_audio_with_video = false;
    play_Track_Default = true;
  } else {
    innerInterface(return_what)
    menu_nhac();
    playAudioFromDB(return_what.id,pullAudio_quality_main());
    play_Track_Default = false;
    play_audio_with_video = false;
    audio.onended = () => {
      if (!iShuffle) {
    next_track_libary(+1,name)
      }};
  }
  if (isApp) {
    createMusicControls(track);
  }
  }
}
function get_current_Index(number,nameList){
  current_Index = number;
  const data = JSON.parse(localStorage.getItem(nameList));
  if(number >= data.length){
    
  }
}
function next_track_libary(direction,name) {
  if(next_track_from === "library"){
  const data = JSON.parse(localStorage.getItem(name));
  let list = data.tracks;
  if(current_Index > list.length){
    current_Index = 0;
  }else if(current_Index < 0){
    current_Index = list.length - 1;
  }else{
    current_Index = current_Index + direction;
  }
  let newIndex = current_Index;
  const track = list[newIndex];
  innerInterface(track)
  data_all_track = track;
  playAudioFromDB(track.id,pullAudio_quality_main())
    menu_nhac();
    play_Track_Default = false;
  }
}
async function checkAudioSrc(trackId,audio_quality) {
  const isVideo = String(pullOutData_main()).toLowerCase() === "true";
  stopOtherMedia();
  elements.btn_remove.addEventListener("click",()=>{
    deleteDb(trackId,audio_quality)
  });
  let media = isVideo?video:audio;
  media.onerror = () => {
    deleteDb(trackId,audio_quality)
}}