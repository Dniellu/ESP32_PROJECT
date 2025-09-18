// ==============================
// ⏱️ 閒置偵測邏輯
// ==============================

// 初始變數設定
let idleTime = 0;         // 使用者閒置秒數
let idleLimit = 20;       // 閒置進入待機的時間（秒）
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
  document.getElementById("screensaver").style.display = "block";
  startSlideshow();
}

// 離開待機模式（關閉螢幕保護並停止投影片播放）
function exitIdleMode() {
  isIdle = false;
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

// 初始化啟動閒置偵測
startIdleChecker();


// ==============================
// 📽️ 投影片輪播邏輯
// ==============================

let slideIndex = 0;         // 當前顯示的投影片索引
let slideshowInterval;      // 投影片 setInterval 控制器

// 開始播放投影片輪播
function startSlideshow() {
  let slides = document.querySelectorAll(".slide"); // 選取所有投影片元素
  slides.forEach((s) => (s.style.display = "none")); // 先全部隱藏
  slideIndex = 0;
  slides[slideIndex].style.display = "block"; // 顯示第一張

  // 每 3 秒輪播下一張
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
