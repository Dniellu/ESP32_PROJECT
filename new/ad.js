// ==============================
// ⏱️ 閒置偵測邏輯
// ==============================

// 初始變數設定
let idleTime = 0;         // 使用者閒置秒數
let idleLimit = 5;       // 閒置進入待機的時間（秒）
let idleInterval;         // setInterval 控制器
let isIdle = false;       // 是否目前為待機狀態

// 使用者互動時重設閒置計時器
function resetIdleTimer() {
  idleTime = 0;
  if (isIdle) {
    exitIdleMode(); // 若已進入待機，則退出
  }
}

// 進入待機模式（顯示螢幕保護區塊並開始播放投影片）
function enterIdleMode() {
  isIdle = true;
  console.log("➡️ 進入閒置模式");
  document.getElementById("screensaver").style.display = "flex";
  startSlideshow();
}

// 離開待機模式（關閉螢幕保護並停止投影片播放）
function exitIdleMode() {
  isIdle = false;
  console.log("⬅️ 離開閒置模式");
  document.getElementById("screensaver").style.display = "none";
  stopSlideshow();
}

// 啟動閒置監聽器（每秒檢查一次）
function startIdleChecker() {
  idleInterval = setInterval(() => {
    idleTime++;
    if (idleTime >= idleLimit && !isIdle) {
      enterIdleMode(); // 若超過閒置限制，啟動待機模式
    }
  }, 1000);
}

// 監聽使用者互動事件以重置閒置時間
["mousemove", "keydown", "mousedown", "touchstart"].forEach((event) =>
  document.addEventListener(event, resetIdleTimer)
);

// ==============================
// 📽️ 投影片輪播邏輯
// ==============================

let slideIndex = 0;         // 當前顯示的投影片索引
let slideshowInterval;      // 投影片 setInterval 控制器

// 開始播放投影片輪播
function startSlideshow() {
  let slides = document.querySelectorAll(".slide");
  if (slides.length === 0) return;

  slides.forEach((s) => (s.style.display = "none"));
  slideIndex = 0;
  slides[slideIndex].style.display = "block";

  slideshowInterval = setInterval(() => {
    slides[slideIndex].style.display = "none";
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].style.display = "block";
  }, 3000);
}

// 停止投影片輪播
function stopSlideshow() {
  clearInterval(slideshowInterval);
}

// 初始化啟動閒置偵測
function initIdleWatcher() {
  idleTime = 0;       // 確保從 0 開始
  isIdle = false;     // 一開始不是 idle
  startIdleChecker(); // 只啟動計時
}

document.addEventListener("DOMContentLoaded", initIdleWatcher);

