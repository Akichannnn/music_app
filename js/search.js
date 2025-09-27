var search_Input = $('#search-input'),
  btn_find = $(".btn-find"),
  resultList = $('#result-list'),
  suggestions = $(".suggestions"),
  suggestionsContainer = $(".suggestions-container"),
  posted = $(".posted"),
  viwer = $(".viwer"),
  icon_all = $(".icon_all"),
  icon_songs = $(".icon_songs"),
  icon_videos = $(".icon_videos"),
  img = $(".img");
//http://localhost:3000
const sus = "aki";
let api = "https://api.akiweb.click";
let api_2 = "https://www.akiweb.click";
let suggestion = [];
let playlist = [];
let playlist_next = [];
let playList_replay = [];
let current_Index = 0;
let debounceTimer;
let filter_find = "videos";
let test_change; 
play_audio_with_video = test_change;
let fetchedSuggestions = new Set();
//play_audio_with_video = true;
search_Input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchVideos();
    apiSuggetions();
    suggestions.style.display = "none";
    document.body.querySelector(".main-2-3").style.display = 'none';
    resultList.style.display = "block";
  }
});
search_Input.addEventListener("click", () => {
  suggestions.style.display = "block";
  takeOutSearchList();
  document.body.querySelector(".icon_container").style.display = "block";
  document.body.querySelector("#main-2-h3").style.display = 'none';
  document.body.querySelector(".main-2-3").style.display = 'block';
  resultList.style.display = "none";
});
async function apiSuggetions() {
  const query = search_Input.value.trim();
  try {
    const response = await fetch(`${api_2}/suggestions?q=${query}&sus=${sus}`);
    console.log(`${api_2}/suggestions?q=${query}&sus=${sus}`)
    const data = await response.json();
    let data_Index = data.map((data, index) => ({
      title: data.title,
      index: index
    }));
    suggestion = data_Index;
    displaySuggestionsResults(suggestions);
    return suggestion;
  } catch (error) {
  }
}
function displaySuggestionsResults(suggestions, index) {
  suggestions.innerHTML = "";
  const fragment = document.createDocumentFragment();
  suggestion.forEach((data, index) => {
    const olSuggestions = document.createElement("ol");
    olSuggestions.className = "itemSuggestions";
    olSuggestions.innerHTML = `<h5 class="text-suggestion">${data.title}</h5> `;
    fragment.appendChild(olSuggestions);
    olSuggestions.addEventListener("click", () => {
      itemIndex(data.title);
     suggestions.style.display = "none";
    document.body.querySelector(".main-2-3").style.display = 'none';
      suggestions.style.display = "none";
      resultList.style.display = "block";
    });
  });
  suggestions.appendChild(fragment);
}
async function searchVideos(value) {
  const query = search_Input.value.trim();
  saveSearch(query||value);
  if (!query) return;
  try {
  const response = await fetch(`${api_2}/search?q=${query}&filter=${filter_find}&sus=aki`);
    const video = await response.json();
    if (!Array.isArray(video) || video.length === 0) {
      return;
    }
    playlist = video;
    displaySearchResults(playlist);
  } catch (error) {
    console.error(error);
  }
}
search_Input.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    apiSuggetions();
  }, 300);
});

async function itemIndex(index) {
  const findIndex = suggestion.find(data => data.title === index);
  search_Input.value = findIndex.title;
  searchVideos(findIndex.title);
}
// 🟢 Hiển thị kết quả tìm kiếm
function displaySearchResults(playlist) {
  resultList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  playlist.forEach((video) => {
    const li = document.createElement("li");
    li.className = "kqtimkiem";
    li.innerHTML = `
        <img class="img-kqtimkiem" src="${video.thumbnail}" alt="Thumbnail">
        <h5 class="ten-kqtimkiem">${video.title}</h5>
        <br>
        <i class="casi-kqtimkiem">${video.channel}</i>
    `;
    fragment.appendChild(li);
   li.addEventListener('click', () => {
        playtracksid(video.id);
        menu_nhac();
        play_Track_Default = false;
        next_track_from = "search";
      });
  });
  resultList.appendChild(fragment);
}
async function playtracksid(trackId) {
  const track = playlist.find(song => song.id == trackId);
  suggestion_next_playList(track.id);
  innerInterface(track);
  resetProgress();
  updatePlayPauseUI();
  data_all_track = track;
  saveAudioTocache(track);
}
async function saveAudioTocache(track) {
  test_change = pullOutData_main();
  const audio_quality = pullAudio_quality_main();
  const isVideo = String(test_change).toLowerCase() === "true";
  stopOtherMedia();
  const media = isVideo ? video : audio;
  const media_src = `${api}/audio?id=${track.id}&si=${isVideo}&quality=${audio_quality}`;
  await saveAudioToDB(track,media_src,audio_quality);
}
async function playTrack(track) {
  test_change = pullOutData_main();
  const isVideo = String(test_change).toLowerCase() === "true";
  stopOtherMedia();
  const media = isVideo ? video : audio;
  const media_src = `${api}/audio?id=${track}&si=${isVideo}`;
  const quality = pullAudio_quality_main();
  await saveAudioToDB(track.id,media_src,quality)
}
async function getInfo_video(id_video) {
  let video_id = id_video;
  let savedInfo = JSON.parse(localStorage.getItem("saveInfoVideo")) || [];
  let exists = savedInfo.find(item => item.trackId === video_id);
  if (exists) {
    viwer.innerText = filter_view(exists.info.views);
    posted.innerText = formatUploadDate(exists.info.upload_date);
    return exists.info;
  }
  else{
    try {
    const response = await fetch(`${api_2}/getinfo?id=${video_id}`);
    const videoInfo = await response.json();

    viwer.innerText = filter_view(videoInfo.views);
    posted.innerText = formatUploadDate(videoInfo.upload_date);

    // Lưu lại
    savedInfo.push({
      trackId: video_id,
      info: videoInfo
    });
    localStorage.setItem("saveInfoVideo", JSON.stringify(savedInfo));

    return videoInfo;
  } catch (e) {
    console.error("❌ Lỗi khi lấy thông tin video:", e);
  }
  }
}
//filter lại data
function filter_view(view) {
  let u = 0;
  let uu;
  if (view >= 1000000000) {
    u = Math.trunc(view / 1000000000)
        uu = `${u} tỷ`
  } else if (view >= 1000000) {
    u = Math.trunc(view / 1000000);
        uu = `${u} triệu`
  } else if (view >= 10000) {
    u = Math.trunc(view / 1000);
    uu = `${u} nghìn`;
  }else{
    uu = view;
  }
  return uu;
}
function formatUploadDate(dateStr) {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `ngày ${day} tháng ${month} năm ${year}`;
}
function mediaSession(track) {
  const test = pullOutData_main();
  const isVideo = String(test).toLowerCase() === "true";
  const media = isVideo ? video:audio;
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.channel,
      artwork: [
      { src: track.thumbnail, sizes: '128x128', type: 'image/jpeg' }]
    });

    navigator.mediaSession.setActionHandler('play', () => media.play());
    navigator.mediaSession.setActionHandler('pause', () => media.pause());

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      next_track(+1)
      media.play();
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      next_track(-1)
      audio.play();
    });
  }
}
function next_track(direction) {
  if(next_track_from === "search"){
  current_Index > 0 ? current_Index = current_Index + direction: current_Index = (current_Index+direction+playlist_next.length)%playlist_next.length;
  let newIndex = current_Index;
  if(current_Index > 3){
    current_Index = 0;
  }
  const track = playlist_next[newIndex];
  playTrack_next(track)
  if (isTimerPlaying) {
    audio.play();
    updatePlayPauseUI();
    chuchay();
  }
  }
}
function saveSearch(query) {
  if (!query || typeof query !== "string") return;
  let historySearch = JSON.parse(localStorage.getItem("historySearch")) || [];
  if (!Array.isArray(historySearch)) {
    historySearch = [];
  }
  if (historySearch.includes(query)) return;
  historySearch.unshift(query);
  historySearch = historySearch.slice(0, 10);
  localStorage.setItem("historySearch", JSON.stringify(historySearch));
}
function takeOutSearchList() {
  const data = JSON.parse(localStorage.getItem("historySearch")) || [];

  suggestions.innerHTML = ""; // Xoá cũ nếu có
  const fragment = document.createDocumentFragment();

  data.forEach((item, index) => {
    const ol = document.createElement("ol");
    ol.className = "itemSuggestions";
    ol.innerHTML = `
      <p onclick="value_of_input(${index})">${item} <i class="fa-solid fa-magnifying-glass"></i></p>
    `;
    ol.addEventListener("click",()=>{
     suggestions.style.display = "none";
    document.body.querySelector(".main-2-3").style.display = 'none';
      suggestions.style.display = "none";
    resultList.style.display = "block";
    })
    fragment.appendChild(ol);
  });

  suggestions.appendChild(fragment);
}
function value_of_input(item){
  const data = JSON.parse(localStorage.getItem("historySearch")) || [];
  const mapData = data.map((data, index) => ({
  title: data,
  index: index
}));
  const findIndex = mapData.find((e)=>
  item === e.index)
    search_Input.value = findIndex.title
}
function saveHistory(track) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  const exists = history.find(item => item.id === track.id);
  if (exists) return;
  history.unshift(track);
  history = history.slice(0, 100);
  localStorage.setItem("history", JSON.stringify(history));
  setTimeout(()=>{
    ngheLai();
  },3000)
}
function ngheLai() {
  const data = JSON.parse(localStorage.getItem("history")) || [];
  playList_replay = data;
  const listNgheLai = $(".list-nghe-lai");
  if (!listNgheLai) return
  const fragment = document.createDocumentFragment();
  listNgheLai.innerHTML = "";
  data.forEach((track) => {
    const li = document.createElement("li");
    li.className = "li";
    li.innerHTML = `
      <img  class="imgsrc"
      src="${track.img||track.thumbnail}">
      <h4 class="tracks-print-h4">${track.name||track.title}</h4>
      <i class="tracks-print-i">${track.artist||track.channel}</i>
    `;
    li.addEventListener("click",()=>{
      menu_nhac();
      playTrack_nghelai(`${track.id}`);
      play_track_replay = false;
    });
    fragment.appendChild(li);
  });
  listNgheLai.style.width = `${x / 2 +170}px`;
  listNgheLai.appendChild(fragment);
}
ngheLai()
function remove_replay(){
  localStorage.removeItem("history");
}
icon_all.style.background = "white";
function setActiveIcon_search(activeIcon) {
  [icon_all, icon_songs, icon_videos].forEach(icon => {
    icon.style.background = icon === activeIcon ? 'white' : '#272525';
    icon.style.color = icon === activeIcon ? 'black' : 'white';
  });
}
icon_all.addEventListener('click', () =>{
  setActiveIcon_search(icon_all)
  filter_find = "alls"
  searchVideos();
  resultList.style.display = "block";
  suggestions.style.display = "none";
});
icon_songs.addEventListener('click', () =>{
  setActiveIcon_search(icon_songs)
  filter_find = "songs"
  searchVideos();
  suggestions.style.display = "none";
  resultList.style.display = "block";
});
icon_videos.addEventListener('click', () =>{
  setActiveIcon_search(icon_videos)
  filter_find = "videos";
  searchVideos();
  resultList.style.display = "block";
  suggestions.style.display = "none";
});
async function suggestion_next_playList(id) {
  if (fetchedSuggestions.has(id)) return;
  try {
    const response = await fetch(`${api_2}/api/suggestion/nexts?id=${id}&sus=aki`);
    const data = await response.json();
    playlist_next = data;
    fetchedSuggestions.add(id);
    console.log("danh sách bài tiếp theo:",playlist_next)
  } catch (e) {
    console.log("404");
  }
}
function handlePlayIndex(index, playlist) {
  if (index === 10) {
    const currentId = playlist[index]?.id;

    if (currentId && !fetchedSuggestions.has(currentId)) {
      suggestion_next_playList(currentId);
      fetchedSuggestions.add(currentId);
    }
  }
}
function playTrack_next(track){
  data_all_track = track;
  innerInterface(track);
  if (play_Track_Default === false) {
    const quality = pullAudio_quality_main();
     playAudioFromDB(track||track.id,quality)
  }
}
  suggestions.style.width = `${x / 2 +120}px`;
  suggestions.style.height = `${y / 2 +120}px`;
async function playTrack_listenAgin(trackId){
    const track = playList_replay.find(id=>id.id === trackId)
    const isNumber = /^\d+$/.test(String(track));
    if(isNumber){
    data_all_track = track;
    loadTrack(track.id);
    innerInterface(track)
    }else{
    data_all_track = track;
    innerInterface(track)
    const quality = pullAudio_quality_main();
   await playAudioFromDB(track.id,quality);
    suggestion_next_playList(track.id)
    }
  }
  function removeOld_srcImg(thumbnailUrl) {
  const check = thumbnailUrl.thumbnail
  elements.img.removeAttribute("src");
  elements.img.src = check + "?t=" + Date.now();
}
