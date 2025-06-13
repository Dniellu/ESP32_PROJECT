// ==============================
// 📍 教室導引主功能區塊
// ==============================

// 開啟教室導引功能
function openClassroomGuide() {
  closeAllFeatureBoxes(); // 關掉其他功能區塊（如天氣查詢）

  // 插入教室導引選單與圖片容器 HTML 結構
  document.getElementById("output").innerHTML = `
    <div class="classroom-guide">
      <label for="area">選擇區域：</label>
      <select id="area" onchange="updateClassrooms()">
        <option value="">請選擇區域</option>
        <option value="cheng">誠</option>
        <option value="zheng">正</option>
        <option value="qin">勤</option>
        <option value="pu">樸</option>
        <option value="office">系所辦公室</option>
      </select>

      <label for="floor">選擇樓層：</label>
      <select id="floor" onchange="updateClassrooms()">
        <option value="">請選擇樓層</option>
        <option value="1樓">1樓</option>
        <option value="2樓">2樓</option>
        <option value="3樓">3樓</option>
        <option value="4樓">4樓</option>
        <option value="5樓">5樓</option>
      </select>

      <label for="classroom">選擇教室：</label>
      <select id="classroom" disabled>
        <option value="">請選擇教室</option>
      </select>

      <button onclick="showImage()">📸 顯示教室圖片</button>
    </div>

    <div id="result" style="display:none; margin-top: 1em;">
      <img id="classroom-image" src="" alt="教室圖片" style="max-width:100%; border: 1px solid #ccc; cursor: zoom-in;" />
      <p style="text-align:center; font-size: 0.9em;">🔍 點擊圖片可放大</p>
    </div>

    <div id="imageModal" class="modal" onclick="closeModal()" style="display:none;">
      <span class="modal-close" onclick="closeModal()">&times;</span>
      <img class="modal-content" id="modalImage">
    </div>
  `;
}

// ==============================
// 📋 更新教室選項功能
// ==============================

function updateClassrooms() {
  const area = document.getElementById("area").value;
  const floorSelect = document.getElementById("floor");
  const classroomSelect = document.getElementById("classroom");

  // 清除舊的教室選項
  classroomSelect.innerHTML = '<option value="">請選擇教室</option>';

  // 處理「系所辦公室」特例（不需選樓層）
  if (area === "office") {
    floorSelect.disabled = true; // 樓層選單無效

    // 辦公室教室清單
    const officeRooms = [/* ...此處省略已定義的所有辦公室名稱... */];

    officeRooms.forEach(room => {
      const option = document.createElement("option");
      option.value = room;
      option.textContent = room;
      classroomSelect.appendChild(option);
    });

    classroomSelect.disabled = false; // 啟用教室選單
    return;
  }

  // 不是辦公室時，樓層選單恢復啟用
  floorSelect.disabled = false;

  const floor = floorSelect.value;

  // 教室資料表（區域 → 樓層 → 教室）
  const classroomData = {
    cheng: { /* 誠樓各樓層教室列表 */ },
    zheng: { /* 正樓各樓層教室列表 */ },
    qin: { "3樓": ["勤301", "勤302"] },
    pu: { /* 樸樓各樓層教室列表 */ }
  };

  // 取得對應的教室列表（若無則為空）
  const classrooms = classroomData[area]?.[floor] || [];

  // 插入教室選項
  classrooms.forEach(room => {
    const option = document.createElement("option");
    option.value = room;
    option.textContent = room;
    classroomSelect.appendChild(option);
  });

  classroomSelect.disabled = classrooms.length === 0; // 無資料則禁用下拉
}

// ==============================
// 📸 顯示選取教室圖片 + 傳送資料到 ESP32
// ==============================

function showImage() {
  const classroom = document.getElementById("classroom").value;
  if (!classroom) return alert("請選擇完整資訊");

  const path = `images/${classroom}.jpg`;
  const img = document.getElementById("classroom-image");

  img.src = path;
  img.onerror = () => img.src = "images/default.jpg"; // 圖片載入失敗時用預設圖
  img.onload = () => console.log("圖片加載成功：", path);
  img.onclick = () => openModal(path); // 點擊圖片可放大

  document.getElementById("result").style.display = "block";

  // 將選擇結果送到 ESP32（轉動實體路牌）
  fetch(`http://192.168.50.232/rotate?classroom=${encodeURIComponent(classroom)}`)
    .then(res => res.text())
    .then(msg => console.log("ESP32 回應：", msg))
    .catch(err => console.error("傳送失敗：", err));
}

// ==============================
// 🔍 圖片放大功能 (Modal)
// ==============================

// 開啟圖片放大視窗
function openModal(imageSrc) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modal.style.display = "block";
  modalImg.src = imageSrc;
}

// 關閉放大視窗
function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}
