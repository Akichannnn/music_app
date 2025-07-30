const $home = document.querySelector.bind(document);
const menuphatnhac = $home(".menu-phat-nhac");
const ul = $home(".tat-ca-list");
// Shuffle random list
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
yeucau(printList)
// In danh sách bài hát
function printList(tracker) {
  const randomData = shuffleArray(tracker).slice(0, 15);
  const fragment = document.createDocumentFragment();

  randomData.forEach((track) => {
    if (!track || !track.id || !track.img || !track.name || !track.artist) return;

    const li = document.createElement("li");
    li.className = "li";
    li.innerHTML = `
      <img onclick="loadTrack(${track.id})" class="imgsrc" src="${track.img}">
      <h4 class="tracks-print-h4">${track.name}</h4>
      <i class="tracks-print-i">${track.artist}</i>
    `;
    li.addEventListener("click",()=> {
      menu_nhac();
      play_Track_Default = true;
      play_audio_with_video = false;
     setTimeout(function() {
       loadTrack(track.id);
     }, 10);
    });

    fragment.appendChild(li);
  });
  ul.appendChild(fragment);
}
yeucau(printArtist);
// Hiển thị danh sách theo nghệ sĩ ngẫu nhiên
async function printArtist() {
  const list = document.querySelector(".list-h3-2");
  if (!list) return;

  const trackIds = tracks.map(track => track.id);
  const maxId = Math.max(...trackIds);
  const randomId = Math.floor(Math.random() * maxId) + 2;
  const randomTrack = tracks.find(track => track.id === randomId);
  if (!randomTrack) return;

  const artistTracks = tracks.filter(track => track.artist === randomTrack.artist);
  const ten_nghe_si = $(".ten_nghe_si");
  if (ten_nghe_si) {
    ten_nghe_si.innerText = randomTrack.artist;
  }

  const listHTML = artistTracks.map(track => `
    <li class="li-2" onclick="loadTrack(${track.id})">
      <img class="imgsrc" src="${track.img}">
      <h4 class="tracks-print-h4">${track.name}</h4>
      <i class="tracks-print-i">${track.artist}</i>
    </li>
  `).join("");

  list.innerHTML = listHTML;
}
  const tatcalist = document.querySelector(".tat-ca-list");
    tatcalist.style.width = `${x / 2 +170}px`;
  document.body.querySelector(".list-h3-2").style.width=`${x / 2 +170}px`;
