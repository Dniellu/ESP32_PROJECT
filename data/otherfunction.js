// 主功能：其他服務（美食轉盤與SOS）
function otherServices() {
  closeAllFeatureBoxes();
  document.getElementById("output").innerHTML = `
    <div class='service-options'>
      <button onclick="openFoodWheel()">🎡 美食轉盤</button>
      <button onclick="emergency()">🚨 SOS 緊急按鈕</button>
    </div>`;
}

const canvasId = "wheelCanvas";

// 開啟美食轉盤功能
function openFoodWheel() {
  if (document.getElementById("foodWheelContainer")) return; // 避免重複加入

  document.getElementById("output").innerHTML += `
    <div id="foodWheelContainer" class="food-wheel-container">
      <canvas id="${canvasId}" width="300" height="300"></canvas>
      <button id="spinButton">開始!</button>
      <button onclick="closeFoodWheel()">關閉轉盤</button>
      <p id="resultText"></p>
    </div>`;

  initFoodWheel();
}

// 關閉轉盤
function closeFoodWheel() {
  const foodWheel = document.getElementById("foodWheelContainer");
  if (foodWheel) foodWheel.remove();
}

// 初始化轉盤
function initFoodWheel() {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const spinButton = document.getElementById("spinButton");
  const resultText = document.getElementById("resultText");

  const foodOptions = [
    { name: "生煎包" }, { name: "師園" }, { name: "13 Burger" }, { name: "燈籠滷味" },
    { name: "牛老大" }, { name: "夏威夷生魚飯" }, { name: "甘泉魚麵" }, { name: "銀兔咖哩" },
    { name: "丼口飯食" }, { name: "蚩尤鐵板燒" }, { name: "蛋幾ㄌㄟˇ" }, { name: "八方雲集" },
  ];

  const colors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#9B59B6", "#E67E22", "#1ABC9C", "#D35400"];
  const slices = foodOptions.length;
  const sliceAngle = (2 * Math.PI) / slices;
  let currentAngle = 0;
  let spinning = false;
  let spinVelocity = 0;

  function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    for (let i = 0; i < slices; i++) {
      const startAngle = currentAngle + i * sliceAngle;
      const endAngle = currentAngle + (i + 1) * sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(foodOptions[i].name, radius - 20, 10);
      ctx.restore();
    }

    // 畫出指針
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX - 10, centerY - radius - 10);
    ctx.lineTo(centerX + 10, centerY - radius - 10);
    ctx.closePath();
    ctx.fill();
  }

  function spinWheel() {
    if (spinning) return;
    spinning = true;
    spinVelocity = Math.random() * 20 + 15;
    const deceleration = 0.99;

    function animate() {
      if (spinVelocity > 0.1) {
        spinVelocity *= deceleration;
        currentAngle += spinVelocity * 0.05;
        drawWheel();
        requestAnimationFrame(animate);
      } else {
        spinning = false;
        selectResult();
      }
    }
    animate();
  }

  function selectResult() {
    const finalAngle = currentAngle % (2 * Math.PI);
    const pointerAngle = (3 * Math.PI / 2 - finalAngle + 2 * Math.PI) % (2 * Math.PI);
    const selectedIndex = Math.floor(pointerAngle / sliceAngle);
    resultText.innerText = "今天吃: " + foodOptions[selectedIndex].name;
  }

  spinButton.addEventListener("click", spinWheel);
}

// 啟動 SOS 緊急模式
function emergency() {
  closeAllFeatureBoxes();
  document.getElementById("output").innerHTML = "";
  const dm = document.getElementById("dm-container");
  if (dm) dm.style.display = "none";
  const buttonContainer = document.querySelector(".button-container");
  if (buttonContainer) buttonContainer.style.display = "none";
  document.getElementById("screensaver").style.display = "block";
  startSlideshow();
  setTimeout(() => stopSlideshowAndReturnHome(), 10000);
}

// 開始播放警示投影片
function startSlideshow() {
  const slides = document.querySelectorAll(".slide");
  let currentIndex = 0;
  slides.forEach((slide, i) => slide.style.display = i === 0 ? "block" : "none");
  setInterval(() => {
    slides[currentIndex].style.display = "none";
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].style.display = "block";
  }, 3000);
}

// 停止投影片並返回首頁
function stopSlideshowAndReturnHome() {
  document.getElementById("screensaver").style.display = "none";
  const dm = document.getElementById("dm-container");
  if (dm) dm.style.display = "block";
  const buttonContainer = document.querySelector(".button-container");
  if (buttonContainer) buttonContainer.style.display = "flex";
  document.querySelectorAll(".slide").forEach(slide => slide.style.display = "none");
}

// 小助手功能
function showMenu() {
  document.getElementById('menu').style.display = 'block';
  document.getElementById('answer').style.display = 'none';
}

function showAnswer(option) {
  const responses = {
    weather: "您可以點擊「天氣查詢」按鈕，輸入城市名稱後，即可查看最新的天氣資訊。",
    youbike: "點擊「YouBike 查詢」按鈕，網站會顯示最近的 YouBike 站點資訊，包括可借與可還車輛數量。",
    map: "點選「地圖導航」按鈕，系統將引導您至嵌入式 Google 地圖介面，您可選擇目的地並啟動路線規劃。",
    services: "點擊「其他服務」後，您將看到以下可選功能：🎯 美食轉盤與 🚨 SOS 緊急模式。",
    foodWheel: "點選「其他服務」→「美食轉盤」，按下「開始！」即可轉出餐廳，按「關閉轉盤」可結束。",
    sosMode: "點擊「其他服務」→「SOS 緊急按鈕」，將啟動警示背景、播放警報音效與警告圖片。",
    howToStart: "請先點擊任一功能（如天氣、地圖或其他服務）進行探索，系統將依需求提供資訊。",
    returnHome: "點選畫面左上角首頁圖示，或重新整理頁面即可返回首頁。",
    soundOff: "如無聲音，請檢查裝置音量，並確認蜂鳴器接通。",
    foodWheelCriteria: "轉盤將從內建清單隨機推薦，未來版本將加入位置與評價推薦功能。",
  };

  document.getElementById('answer-text').innerText = responses[option] || '無效選項';
  document.getElementById('menu').style.display = 'none';
  document.getElementById('answer').style.display = 'block';
}

function closeAnswer() {
  document.getElementById('answer').style.display = 'none';
  document.getElementById('menu').style.display = 'block';
}

function closeMenu() {
  document.getElementById('menu').style.display = 'none';
}

// 顯示/隱藏其他功能按鈕
function toggleOtherFunctions() {
  const other = document.getElementById("other-functions");
  other.style.display = other.style.display === "none" ? "flex" : "none";
}

// 顯示第二層功能選單
function showOtherFunctions() {
  document.getElementById("main-buttons").style.display = "none";
  document.getElementById("secondary-buttons").style.display = "flex";
  document.getElementById("back-button").style.display = "block";
}

// 回到首頁
function goBack() {
  document.getElementById("secondary-buttons").style.display = "none";
  document.getElementById("back-button").style.display = "none";
  document.getElementById("main-buttons").style.display = "flex";
}

// 教室導引功能
function openClassroomGuide() {
  document.getElementById("main-buttons").style.display = "none";
  document.getElementById("classroomBox").style.display = "block";
}

// 關閉所有功能區塊
function closeAllFeatureBoxes() {
  document.getElementById("classroomBox").style.display = "none";
  document.getElementById("output").innerHTML = "";
  document.getElementById("screensaver").style.display = "none";
}
