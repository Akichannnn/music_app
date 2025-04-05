var $item = document.querySelector.bind(document);
var menuphatnhac = $item(".menu-phat-nhac");
yeucau(pirntlist);
var ul = $item('.tat-ca-list');
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
async function pirntlist(tracker) {
  const randomData = shuffleArray(tracker).slice(0, 10);
  const html = randomData.map((track) => `
    <li class="li" onclick="loadTrack(${track.id})">
      <img onclick="menu_nhac()" class="imgsrc" src="${track.img}">
      <h4 class="tracks-print-h4">${track.name}</h4>
      <i class="tracks-print-i">${track.artist}</i>
    </li>
  `).join("");
  ul.innerHTML = html;
}
const tatcalist = document.querySelector(".tat-ca-list");
tatcalist.style.width = `${x - 40}px`;
yeucau(printArtist);
async function printArtist() {
  const list = document.querySelector(".list-h3-2");
  
  if (!list) {
    console.error("Không tìm thấy phần tử .h3-2");
    return;
  }

  // Lấy danh sách ID và tìm ID lớn nhất
  const trackIds = tracks.map(track => track.id);
  const maxId = Math.max(...trackIds);

  // Tạo ID ngẫu nhiên từ 1 đến maxId
  const randomId = Math.floor(Math.random() * maxId) + 2;
  const randomTrack = tracks.find(track => track.id === randomId);
  if (!randomTrack) {
    return;
  }
  const artistTracks = tracks.filter(track => track.artist === randomTrack.artist);
  const ten_nghe_si = document.querySelector(".ten_nghe_si");
 ten_nghe_si.innerText = `${randomTrack.artist}`;
  const listHTML = artistTracks.map(track => `
    <li class="li-2" onclick="loadTrack(${track.id})">
      <img class="imgsrc" src="${track.img}">
       <h4 class="tracks-print-h4">${track.name}</h4>
      <i class="tracks-print-i">${track.artist}</i>
    </li>
  `).join("");
  list.innerHTML = listHTML;
}
printArtist();