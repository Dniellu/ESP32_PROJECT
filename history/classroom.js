// 教室導引區塊
function openClassroomGuide() {
  closeAllFeatureBoxes(); // 關掉其他功能區塊

  // 顯示教室導引的選單與圖片結果容器
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

function updateClassrooms() {
  const area = document.getElementById("area").value;
  const floorSelect = document.getElementById("floor");
  const classroomSelect = document.getElementById("classroom");

  // 清除舊選項
  classroomSelect.innerHTML = '<option value="">請選擇教室</option>';

  if (area === "office") {
    // 鎖住樓層選單
    floorSelect.disabled = true;

    // 加入辦公室選項
    const officeRooms = [
      "健康促進與衛生教育學系5F", "健康促進與衛生教育學系6F", "英語診斷室1F", "英語聊天室1F", "英語學系8F", "英語學系7F",
      "網路大學籌辦處4F", "社會工作學研究所5F", "歷史學系5F", "歷史學系4F", "文學院3F", "文保中心5F", "教學發展中心1F",
      "政治學研究所東亞學系9F", "幼兒與家庭科學學系2F", "幼兒與家庭科學學系1F", "家庭研究發展中心5F", "地理學系10F", "地理學系9F",
      "圖書資訊學研究所5F", "國際與社會科學學院5F", "國文系研究所5F", "國文學系8F", "國文學系7F", "國文學系6F", "台灣史研究所3F",
      "公民教育與活動領導學系10F", "公民教育與活動領導學系9F", "公民教育與活動領導學系4F", "全球華文寫作中心3F"
    ];
    officeRooms.forEach(room => {
      const option = document.createElement("option");
      option.value = room;
      option.textContent = room;
      classroomSelect.appendChild(option);
    });

    classroomSelect.disabled = false;
    return;
  }

  // 不是 office 選項時還原樓層選單
  floorSelect.disabled = false;

  const floor = floorSelect.value;
  const classroomData = {
    cheng: {
      "1樓": ["誠101", "誠102", "誠104", "誠105", "誠106", "誠107", "誠108", "誠109"],
      "2樓": ["誠201", "誠202", "誠203", "誠204", "誠205", "誠206", "誠207", "誠208"],
      "3樓": ["誠301", "誠302", "誠303", "誠304", "誠305", "誠306", "誠307"],
      "4樓": ["誠401", "誠402"]
    },
    zheng: {
      "1樓": ["正101", "正102", "正103", "正104", "正105", "正106"],
      "2樓": ["正201", "正202", "正203", "正204", "正205", "正206"],
      "3樓": ["正301", "正302", "正303", "正304", "正305", "正306"],
      "4樓": ["正401", "正402", "正403", "正404", "正405", "正406", "正407"]
    },
    qin: {
      "3樓": ["勤301", "勤302"]
    },
    pu: {
      "1樓": ["樸105", "樸106"],
      "2樓": ["樸201", "樸202", "樸203", "樸204", "樸205", "樸206"],
      "3樓": ["樸301", "樸302", "樸303", "樸304", "樸305", "樸306", "樸307"],
      "4樓": ["樸401", "樸402", "樸403", "樸404", "樸405", "樸406", "樸407"]
    }
  };

  const classrooms = classroomData[area]?.[floor] || [];

  classrooms.forEach(room => {
    const option = document.createElement("option");
    option.value = room;
    option.textContent = room;
    classroomSelect.appendChild(option);
  });

  classroomSelect.disabled = classrooms.length === 0;
}

function showImage() {
  // ▶ 播放音效（來自 index.html 的 <audio>）
  const snd = document.getElementById("cameraSound");
  if (snd) {
    try {
      // 如果連點，回到 0 讓每次都能完整播放
      snd.currentTime = 0;
      snd.volume = 0.7; // 想更大或更小可調 0~1
      snd.play();
    } catch (e) {
      console.warn("音效播放被瀏覽器阻擋或檔案有問題：", e);
    }
  }
  
  const classroom = document.getElementById("classroom").value;
  if (!classroom) return alert("請選擇完整資訊");

  const path = `images/${classroom}.jpg`;
  const img = document.getElementById("classroom-image");
  img.src = path;
  img.onerror = () => img.src = "images/default.jpg";
  img.onload = () => console.log("圖片加載成功：", path);

  img.onclick = () => openModal(path);

  document.getElementById("result").style.display = "block";

  // 傳送資料到 ESP32
  fetch(`http://192.168.50.232/rotate?classroom=${encodeURIComponent(classroom)}`)
    .then(res => res.text())
    .then(msg => console.log("ESP32 回應：", msg))
    .catch(err => console.error("傳送失敗：", err));
}

function openModal(imageSrc) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modal.style.display = "block";
  modalImg.src = imageSrc;
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}
