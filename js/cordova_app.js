let isApp = false;
let currentMedia = null;

// Sự kiện khi Cordova sẵn sàng
document.addEventListener('deviceready', async () => {
  console.log("✅ deviceready fired");

  isApp = true;
  setupMusicControls();
  await requestPermissions();
}, false);

// 📌 Đăng ký MusicControls listener
function setupMusicControls() {
  if (window.MusicControls) {
    MusicControls.subscribe(onMusicControlEvent);
    MusicControls.listen();
    console.log("🎛 MusicControls listener registered");
  } else {
    console.warn("⚠️ MusicControls plugin chưa sẵn sàng!");
  }
}

// 📌 Xin quyền truy cập
async function requestPermissions() {
  if (!cordova.plugins || !cordova.plugins.permissions) {
    console.warn("⚠️ Permissions plugin chưa sẵn sàng!");
    return;
  }

  const perms = cordova.plugins.permissions;
  const list = [
    perms.READ_EXTERNAL_STORAGE,
    perms.WRITE_EXTERNAL_STORAGE,
    perms.POST_NOTIFICATIONS
  ];

  // Android 11+ xin thêm full external storage
  if (cordova.platformId === 'android' && parseInt(device.version) >= 11) {
    list.push('android.permission.MANAGE_EXTERNAL_STORAGE');
  }

  perms.requestPermissions(list,
    status => {
      if (status.hasPermission) {
        console.log("✅ Tất cả permission đã được cấp");
      } else {
        console.warn("⚠️ Một số permission bị từ chối:", status);
      }
    },
    err => console.error("❌ Lỗi requestPermissions:", err)
  );
}

function createMusicControls(track) {
  if (!isApp || !window.MusicControls) return console.error("❌ App chưa sẵn sàng hoặc thiếu plugin!");
  let track_list = track;
  MusicControls.create({
    track: track_list.title || track_list.name,
    artist: track_list.artist || track_list.channel,
    cover: track_list.img || track_list.thumbnail,
    isPlaying: true,
    dismissable: true
  }, () => {
    console.log("✅ MusicControls created");
    startUpdatingElapsed(); // <-- Sửa ở đây
  }, err => console.error("❌ MusicControls error:", err));
}
// 📌 Xử lý sự kiện từ MusicControls
function onMusicControlEvent(action) {
  const message = JSON.parse(action).message;
  console.log("🎵 MusicControls event:", message);

  switch (message) {
    case 'music-control-next':
      stopUpdatingElapsed();
      next_track(+1);
      break;
    case 'music-control-previous':
      stopUpdatingElapsed();
      next_track(-1);
      break;
    case 'music-control-play':
      update_Music_Control(true);
      break;
    case 'music-control-pause':
      update_Music_Control(false);
      stopUpdatingElapsed();
      break;
    default:
      console.log("⚠️ Unhandled event:", message);
  }
}
// 📌 Cập nhật trạng thái play/pause
function startUpdatingElapsed() {
  stopUpdatingElapsed();

  if (!currentMedia) {
    console.warn("⚠️ Không thể cập nhật thời gian vì 'currentMedia' không tồn tại.");
    return;
  }
  elapsedTimer = setInterval(() => {
    currentMedia.getCurrentPosition(
      (position) => {
        if (position > -1) {
          MusicControls.updateElapsed({
            elapsed: position,
            isPlaying: true 
          });
        }
      },
      // Callback khi có lỗi
      (err) => {
        console.error("❌ Lỗi khi lấy thời gian hiện tại:", err);
        stopUpdatingElapsed();
      }
    );
  }, 1000);
}
function stopUpdatingElapsed() {
  if (elapsedTimer) {
    clearInterval(elapsedTimer);
    elapsedTimer = null;
  }
}
// 📌 Phát nhạc/video từ file local
function media_load(track) {
  if (!isApp) return;

  if (currentMedia) {
    currentMedia.stop();
    currentMedia.release();
  }

  const filename = play_audio_with_video ? `${track.id}.mp4` : `${track.id}.mp3`;
  const mediaPath = cordova.file.dataDirectory + filename;

  currentMedia = new Media(
    mediaPath,
    () => console.log("✅ Đang phát:", mediaPath),
    err => console.error("❌ Lỗi phát:", err)
  );

  try {
    currentMedia.play();
  } catch (e) {
    console.error("❌ Media play exception:", e);
  }
}

// 📌 Tải file từ server và lưu local
async function download_media(track) {
  try {
    const url = `${api_2}/audio?id=${track.id}&si=${play_audio_with_video}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("❌ Tải file thất bại");

    const blob = await response.blob();
    const filename = play_audio_with_video ? `${track.id}.mp4` : `${track.id}.mp3`;

    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, dir => {
      dir.getFile(filename, { create: true }, file => {
        file.createWriter(writer => {
          writer.write(blob);
          console.log("✅ Đã lưu file:", filename);
        }, err => console.error("❌ Lỗi ghi file:", err));
      }, err => console.error("❌ Lỗi getFile:", err));
    }, err => console.error("❌ Lỗi truy cập thư mục:", err));

  } catch (e) {
    console.error("❌ Lỗi tải file:", e);
  }
}

// 📌 Login & lấy cookie từ InAppBrowser
function loginAndGetCookie() {
  if (!cordova.InAppBrowser) return console.error("❌ InAppBrowser plugin chưa sẵn sàng!");

  const ref = cordova.InAppBrowser.open("https://music.youtube.com", "_blank", "location=yes,clearsessioncache=yes,clearcache=yes");

  ref.addEventListener("loadstop", () => {
    ref.executeScript({ code: "document.cookie" }, result => {
      if (result && result[0]) {
        const cookie = result[0];
        console.log("🍪 Cookie:", cookie);
        localStorage.setItem("ytmusic_cookie", cookie);
        ref.close();
      }
    });
  });

  ref.addEventListener("exit", () => console.log("🔒 User đóng webview"));
}