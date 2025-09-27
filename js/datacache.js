import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';
window.openMyDB = async function() {
  return await openDB('aki_music_db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('audios')) {
        db.createObjectStore('audios'); 
      }
    }
  });
};
window.saveAudioToDB = async function(trackId, audioUrl, audio_quality) {
  try {
    const isVideo = String(pullOutData_main()).toLowerCase() === "true";
    stopOtherMedia();
    const returnMime = isVideo ? "video/mp4" : "audio/mpeg";
    const id = typeof trackId === "object" ? trackId.id : trackId;

    console.log('Starting download for:', id);
    
    const response = await fetch(
      audioUrl || `https://www.akiweb.click/audio?id=${id}&si=${isVideo}&quality=${audio_quality}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      throw new Error('Empty response data');
    }

    const db = await openMyDB();
    const key = isVideo ? id : `${id}-${audio_quality}`;
    const blob = new Blob([arrayBuffer], { type: returnMime });

    await db.put("audios", blob, key);
    
   const verification = await db.get("audios", key);
    if (verification) {
      console.log(`✅ Lưu xong ${key} vào DB`);
    await playAudioFromDB(trackId.id,pullAudio_quality_main());
    } else {
      throw new Error('Failed to verify saved data');
    }

  } catch (error) {
    console.error('❌ Lỗi save audio:', error);
    throw error;
  }
};

window.playAudioFromDB = async function(trackId,audio_quality) {
  const isVideo = String(pullOutData_main()).toLowerCase() === "true";
  const namefile = isVideo?trackId:`${trackId}-${audio_quality}`;
  const db = await openMyDB();
  const blob = await db.get('audios', namefile);
  const audio = document.querySelector(".audio");
  const video = document.querySelector(".video");
  chuchay();
  chuchay_2();
  saveTrackLastTime();
  checkAudioSrc(trackId,audio_quality);
  const media = isVideo ? video : audio;
  if (blob) {
   stopOtherMedia();
    const url = URL.createObjectURL(blob);
    media.src = url;
    media.load();
    media.play();
  } else {
    console.warn("❌ Chưa có file, cần tải từ server trước!");
    saveAudioTocache(data_all_track);
  }
};
window.deleteDb = async function(trackId,audio_quality){
  async function deleteAudioFromDB(trackId) {
    const isVideo = String(pullOutData_main()).toLowerCase() === "true";
  const namefile = isVideo?trackId:`${trackId+audio_quality}`;
  const db = await openDB('aki_music_db', 1);
  await db.delete('audios', namefile);
  await saveAudioToDB(trackId);
}};