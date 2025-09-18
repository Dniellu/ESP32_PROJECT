const canvasId = "foodWheelCanvas";

// 開啟美食轉盤功能
function openFoodWheel() {
  if (document.getElementById("foodWheelContainer")) return; // 避免重複加入

  const container = document.createElement("div");
  container.id = "foodWheelContainer";
  container.className = "food-wheel-container";

  container.innerHTML = `
    <canvas id="${canvasId}" width="300" height="300"></canvas>
    <div>
      <button id="spinButton">開始!</button>
      <button id="closeWheelButton">關閉轉盤</button>
    </div>
    <p id="resultText"></p>
  `;

  document.body.appendChild(container);

  document.getElementById("closeWheelButton").addEventListener("click", closeFoodWheel);

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
      ctx.font = "18px Arial";
      ctx.fillText(foodOptions[i].name, radius - 20, 10);
      ctx.restore();
    }

    // 畫指針
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 10);
    ctx.lineTo(centerX - 10, centerY - radius - 30);
    ctx.lineTo(centerX + 10, centerY - radius - 30);
    ctx.closePath();
    ctx.fill();
  }

  function spinWheel() {
    if (spinning) return;
    spinning = true;
    spinVelocity = Math.random() * 20 + 15;
    const deceleration = 0.97;

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

  drawWheel();
  spinButton.addEventListener("click", spinWheel);
}
