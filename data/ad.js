let idleTime = 0;
let idleLimit = 20; // 秒數
let idleInterval;
let isIdle = false;

function resetIdleTimer() {
  idleTime = 0;
  if (isIdle) {
    exitIdleMode();
  }
}

// 進入待機模式（例如顯示投影片）
function enterIdleMode() {
  isIdle = true;
  document.getElementById("screensaver").style.display = "block";
  startSlideshow();
}

// 離開待機模式
function exitIdleMode() {
  isIdle = false;
  document.getElementById("screensaver").style.display = "none";
  stopSlideshow();
}

// 每秒檢查是否超過閒置時間
function startIdleChecker() {
  idleInterval = setInterval(() => {
    idleTime++;
    if (idleTime >= idleLimit && !isIdle) {
      enterIdleMode();
    }
  }, 1000);
}

// 監聽使用者互動
["mousemove", "keydown", "mousedown", "touchstart"].forEach((event) =>
  document.addEventListener(event, resetIdleTimer)
);

startIdleChecker();

let slideIndex = 0;
let slideshowInterval;

function startSlideshow() {
  let slides = document.querySelectorAll(".slide");
  slides.forEach((s) => (s.style.display = "none"));
  slideIndex = 0;
  slides[slideIndex].style.display = "block";

  slideshowInterval = setInterval(() => {
    slides[slideIndex].style.display = "none";
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].style.display = "block";
  }, 3000); // 每張間隔 3 秒
}

function stopSlideshow() {
  clearInterval(slideshowInterval);
}
