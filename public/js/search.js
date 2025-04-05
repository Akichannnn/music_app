var $search = document.querySelector.bind(document),searchInput = $search('#search-input'),resultList = $search('#result-list');
  yeucau(playtracksid);
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filteredSongs = tracks.filter(song =>
    song.name.toLowerCase().includes(query)
  );
  kqtimkiem(filteredSongs);
});
function kqtimkiem(songList) {
  resultList.innerHTML = ""; // Xóa danh sách cũ
  const limitedcreat = songList.slice(0,15);
  limitedcreat.forEach((song,index) => {
    const div = document.createElement("div");
    div.className = "kqtimkiemdiv";
    // Tạo nội dung HTML bên trong li
    div.innerHTML = `
      <li class="kqtimkiem" onclick="playtracksid(${song.id})">
        <img class="img-kqtimkiem" src="${song.img}">
        <h5 class="ten-kqtimkiem">${song.name}
        </h5>
          <i class="casi-kqtimkiem">${song.artist}</i>
      </li>
    `;

    // Thêm sự kiện onclick cho li
    div.onclick = function () {
      playtracksid(song.id);
      menu_nhac();
    };
    resultList.appendChild(div);
  });
}
async function playtracksid(trackId) {
  trackId = Number(trackId);
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return;
  }
  const track = tracks.find(song => song.id === trackId);
  if (track) {
    //app src cho audio
    audio.src = track.source;
    elements.img.src = track.img;
    elements.title.innerText = track.name;
    elements.singer.innerText = track.artist;
    audio.currentTime = 0;
    resetProgress();
   //inner menuphatnhac
    menuphatnhac.innerHTML = `
    <img class="img-img" src="${track.img}">
     <div class="text-menu-nhac">
    <p class="p-name">${track.name}</p>
      <i class="i-artist">${track.artist}</i>
      </div>`;
   // chỉnh màu cho menu nhac và music lo
      navigator.mediaSession.metadata = new MediaMetadata({
    title: `${track.name}`,
    artist: `${track.artist}`,
    artwork: [
      { src: `${track.img}`, sizes: '96x96', type: 'image/jpeg' },
      { src: `${track.img}`, sizes: '128x128', type: 'image/jpeg'
      }
      ]
  });
  extractColor(track.img);navigator.mediaSession.setActionHandler('play', () => audio.play());
  navigator.mediaSession.setActionHandler('pause', () => audio.pause());
  navigator.mediaSession.setActionHandler("nexttrack",()=>{
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isTimerPlaying) audio.play();
  } );
  navigator.mediaSession.setActionHandler("previoustrack",()=>{
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isTimerPlaying) audio.play();
  });
  
   }
}