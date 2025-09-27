// ========== MUSIC CONTROLS & PERMISSIONS - THUẦN JAVASCRIPT ==========

// Biến global
var isApp = false;
var currentTrack = null;
var CapacitorMusicControls = null;
var Filesystem = null;
var LocalNotifications = null;
var Capacitor = null;

// ========== KHỞI TẠO PLUGINS ==========
function initializeCapacitorPlugins() {
  console.log('🔌 Initializing Capacitor plugins...');
  
  if (window.CapacitorMusicControls) {
    CapacitorMusicControls = window.CapacitorMusicControls;
    console.log('✅ CapacitorMusicControls found');
  } else {
    console.log('❌ CapacitorMusicControls not found');
  }
  
  if (window.Capacitor) {
    Capacitor = window.Capacitor;
    console.log('✅ Capacitor core found');
    
    if (window.Capacitor.Plugins) {
      Filesystem = window.Capacitor.Plugins.Filesystem;
      LocalNotifications = window.Capacitor.Plugins.LocalNotifications;
      console.log('✅ Capacitor plugins loaded');
    }
  } else {
    console.log('❌ Capacitor core not found');
  }
}

function checkPlatform() {
  if (Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()) {
    isApp = true;
    console.log('📱 Running on native platform:', Capacitor.getPlatform());
  } else {
    isApp = false;
    console.log('🌐 Running on web browser');
  }
}

function checkPluginsAvailable() {
  console.log('=== PLUGIN STATUS ===');
  console.log('Capacitor core:', window.Capacitor ? '✅' : '❌');
  console.log('MusicControls:', window.CapacitorMusicControls ? '✅' : '❌');
  console.log('Filesystem:', (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Filesystem) ? '✅' : '❌');
  console.log('LocalNotifications:', (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications) ? '✅' : '❌');
  console.log('Is Native App:', isApp ? '✅' : '❌');
  console.log('===================');
}

// ========== XIN QUYỀN ==========
window.requestAllPermissions = function() {
  if (!isApp) {
    console.log('🌐 Web app - không cần xin quyền');
    return Promise.resolve();
  }
  
  console.log('🔐 Đang xin quyền...');
  
  var promises = [];
  
  // 1. Quyền Filesystem
  if (Filesystem && Filesystem.requestPermissions) {
    promises.push(
      Filesystem.requestPermissions()
        .then(function(result) {
          console.log('📁 Filesystem permission:', result);
          return result;
        })
        .catch(function(err) {
          console.error('📁 Filesystem permission error:', err);
          return null;
        })
    );
  }
  
  // 2. Quyền Notification  
  if (LocalNotifications && LocalNotifications.requestPermissions) {
    promises.push(
      LocalNotifications.requestPermissions()
        .then(function(result) {
          console.log('🔔 Notification permission:', result);
          return result;
        })
        .catch(function(err) {
          console.error('🔔 Notification permission error:', err);
          return null;
        })
    );
  }
  
  return Promise.all(promises)
    .then(function() {
      console.log('✅ Đã xin xong tất cả quyền');
    })
    .catch(function(err) {
      console.error('❌ Lỗi xin quyền:', err);
    });
};

// ========== MUSIC CONTROLS ==========
window.createMusicControls = function(track) {
  if (!isApp || !CapacitorMusicControls) {
    console.log('⚠️ Music controls không khả dụng (web hoặc plugin chưa load)');
    return Promise.resolve();
  }
  
  if (!track) {
    console.error('❌ Track data không được cung cấp');
    return Promise.resolve();
  }
  
  currentTrack = track;
  
  var controlsConfig = {
    track: track.title || track.name || "Unknown Track",
    artist: track.artist || track.channel || "Unknown Artist", 
    cover: track.thumbnail || track.img || track.cover || "assets/default_cover.png",
    album: track.album || "",
    duration: track.duration || 0,
    elapsed: track.elapsed || 0,

    // Controls
    hasSkipForward: true,
    hasSkipBackward: true,
    skipForwardInterval: 15,
    skipBackwardInterval: 15,
    
    hasNext: true,
    hasPrev: true,
    hasClose: true,
    
    hasScrubbing: false,
    isPlaying: true,
    dismissable: true,

    // Icons
    playIcon: "media_play",
    pauseIcon: "media_pause", 
    prevIcon: "media_prev",
    nextIcon: "media_next",
    closeIcon: "media_close",
    notificationIcon: "notification"
  };

  console.log('🎵 Creating music controls for:', controlsConfig.track);

  return CapacitorMusicControls.create(controlsConfig)
    .then(function() {
      console.log("✅ Music controls created successfully:", track.title || track.name);
    })
    .catch(function(error) {
      console.error("❌ Error creating music controls:", error);
    });
};

window.updatePlayingState = function(isPlaying) {
  if (!isApp || !CapacitorMusicControls) {
    console.log('⚠️ Cannot update playing state - not native app or plugin not loaded');
    return Promise.resolve();
  }
  
  return CapacitorMusicControls.updateIsPlaying({ 
    isPlaying: isPlaying 
  })
  .then(function() {
    console.log('🎵 Music controls updated:', isPlaying ? 'PLAYING' : 'PAUSED');
  })
  .catch(function(error) {
    console.error("❌ Error updating play state:", error);
  });
};

window.updateCover = function(coverUrl) {
  if (!isApp || !CapacitorMusicControls) {
    return Promise.resolve();
  }
  
  if (!coverUrl) {
    console.warn('⚠️ Cover URL is empty');
    return Promise.resolve();
  }
  
  return CapacitorMusicControls.updateCover({ 
    cover: coverUrl 
  })
  .then(function() {
    console.log("🖼️ Cover updated:", coverUrl);
  })
  .catch(function(error) {
    console.error("❌ Error updating cover:", error);
  });
};

window.updateTrackInfo = function(track) {
  if (!isApp || !CapacitorMusicControls) {
    return Promise.resolve();
  }
  
  if (!track) {
    console.warn('⚠️ Track data is empty');
    return Promise.resolve();
  }
  
  var metadata = {
    track: track.title || track.name || "Unknown Track",
    artist: track.artist || track.channel || "Unknown Artist",
    album: track.album || "",
    cover: track.thumbnail || track.img || track.cover || "assets/default_cover.png"
  };

  return CapacitorMusicControls.updateMetadata(metadata)
    .then(function() {
      console.log("📝 Track info updated:", metadata.track);
    })
    .catch(function(error) {
      console.error("❌ Error updating track info:", error);
    });
};

window.updateElapsedTime = function(elapsed) {
  if (!isApp || !CapacitorMusicControls) {
    return Promise.resolve();
  }
  
  return CapacitorMusicControls.updateElapsed({ 
    elapsed: elapsed || 0 
  })
  .then(function() {
    console.log("⏰ Elapsed time updated:", elapsed);
  })
  .catch(function(error) {
    console.error("❌ Error updating elapsed time:", error);
  });
};

window.destroyMusicControls = function() {
  if (!isApp || !CapacitorMusicControls) {
    return Promise.resolve();
  }
  
  return CapacitorMusicControls.destroy()
    .then(function() {
      console.log("🗑️ Music controls destroyed");
      currentTrack = null;
    })
    .catch(function(error) {
      console.error("❌ Error destroying controls:", error);
    });
};

// ========== EVENT HANDLERS ==========
function setupEventListeners() {
  if (!isApp) {
    console.log('🌐 Web app - không cần setup event listeners');
    return;
  }
  
  document.addEventListener("controlsNotification", function(event) {
    console.log("🎮 Music control event received:", event.message);
    handleMusicControlEvent(event.message, event);
  });
  
  console.log("👂 Music control event listeners setup complete");
}

function handleMusicControlEvent(action, event) {
  console.log("🎮 Handling music control action:", action);
  
  switch(action) {
    case 'music-controls-next':
      console.log("⏭️ Next track requested");
      if (typeof window.nextTrack === 'function') {
        window.nextTrack();
      } else if (typeof window.next_track === 'function') {
        window.next_track(1);
      } else {
        console.warn('⚠️ nextTrack function not defined');
      }
      break;
      
    case 'music-controls-previous':
      console.log("⏮️ Previous track requested");
      if (typeof window.previousTrack === 'function') {
        window.previousTrack();
      } else if (typeof window.next_track === 'function') {
        window.next_track(-1);
      } else {
        console.warn('⚠️ previousTrack function not defined');
      }
      break;
      
    case 'music-controls-pause':
      console.log("⏸️ Pause requested");
      window.updatePlayingState(false);
      if (typeof window.pauseAudio === 'function') {
        window.pauseAudio();
      } else if (window.audio && typeof window.audio.pause === 'function') {
        window.audio.pause();
      } else {
        console.warn('⚠️ pauseAudio function not defined');
      }
      break;
      
    case 'music-controls-play':
      console.log("▶️ Play requested");
      window.updatePlayingState(true);
      if (typeof window.playAudio === 'function') {
        window.playAudio();
      } else if (window.audio && typeof window.audio.play === 'function') {
        window.audio.play();
      } else {
        console.warn('⚠️ playAudio function not defined');
      }
      break;
      
    case 'music-controls-destroy':
      console.log("🗑️ Destroy requested");
      window.destroyMusicControls();
      break;
      
    case 'music-controls-skip-forward':
      console.log("⏩ Skip forward requested");
      if (window.audio && typeof window.audio.currentTime !== 'undefined') {
        window.audio.currentTime += 15;
        window.updateElapsedTime(window.audio.currentTime);
      }
      break;
      
    case 'music-controls-skip-backward':
      console.log("⏪ Skip backward requested");
      if (window.audio && typeof window.audio.currentTime !== 'undefined') {
        window.audio.currentTime = Math.max(0, window.audio.currentTime - 15);
        window.updateElapsedTime(window.audio.currentTime);
      }
      break;
      
    default:
      console.log("❓ Unknown music control action:", action);
  }
}

// ========== UTILITY FUNCTIONS ==========
window.getMusicControlsStatus = function() {
  return {
    isApp: isApp,
    currentTrack: currentTrack,
    pluginsLoaded: {
      capacitor: !!Capacitor,
      musicControls: !!CapacitorMusicControls,
      filesystem: !!Filesystem,
      notifications: !!LocalNotifications
    }
  };
};

window.getCurrentTrack = function() {
  return currentTrack;
};

window.isNativeApp = function() {
  return isApp;
};

// ========== KHỞI TẠO ==========
document.addEventListener('deviceready', function() {
  console.log('📱 Device ready event fired!');
  
  initializeCapacitorPlugins();
  checkPlatform();
  checkPluginsAvailable();
  
  if (isApp) {
    window.requestAllPermissions()
      .then(function() {
        setupEventListeners();
        console.log('🚀 Native music app initialized successfully!');
      })
      .catch(function(err) {
        console.error('❌ Error initializing native app:', err);
      });
  } else {
    console.log('🌐 Web app mode - limited functionality');
  }
}, false);

// Fallback cho web - nếu không có deviceready event
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM Content Loaded');
  
  setTimeout(function() {
    if (!isApp) {
      console.log('🌐 Web fallback initialization...');
      initializeCapacitorPlugins();
      checkPlatform();
      checkPluginsAvailable();
      console.log('🚀 Web app initialized!');
    }
  }, 2000); // Tăng timeout để đảm bảo Capacitor đã load
});

// Kiểm tra khi window load
window.addEventListener('load', function() {
  console.log('🖼️ Window loaded');
  
  setTimeout(function() {
    checkPluginsAvailable();
  }, 1000);
});