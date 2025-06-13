// ============================
// 主畫面初始化與返回首頁功能
// ============================
function goHome() {
  // 顯示主選單容器
  document.getElementById("dm-container").style.display = "block";
  // 清空輸出區域
  document.getElementById("output").innerHTML = "";
  // 隱藏天氣與教室選單
  document.getElementById("weatherBox").style.display = "none";
  document.getElementById("classroomBox").style.display = "none";
  document.getElementById("result").style.display = "none";
}

// ============================
// 時鐘功能：顯示台灣當地時間
// ============================
function updateTime() {
  const now = new Date();
  const taiwanTime = now.toLocaleTimeString('zh-TW', { hour12: false, timeZone: 'Asia/Taipei' });
  document.getElementById("time").textContent = taiwanTime;
}
setInterval(updateTime, 1000); // 每秒更新一次時間
updateTime(); // 頁面載入時立即更新

// ============================
// 天氣查詢功能
// ============================

// OpenWeather API Key（僅作註記，實際查詢用的是 CWA）
const apiKey = "df0db18b400c04fca56c5117612d6276";

// 關閉所有功能區塊（目前僅針對天氣查詢）
function closeAllFeatureBoxes() {
  const weatherBox = document.getElementById("weatherBox");
  if (weatherBox) weatherBox.style.display = "none";

  const output = document.getElementById("output");
  if (output) output.innerHTML = "";
}

// 縣市清單（用於下拉選單）
const cities = [
  "臺北市", "新北市", "桃園市", "臺中市", "臺南市", "高雄市",
  "基隆市", "新竹市", "新竹縣", "苗栗縣", "彰化縣", "南投縣",
  "雲林縣", "嘉義市", "嘉義縣", "屏東縣", "宜蘭縣", "花蓮縣",
  "臺東縣", "澎湖縣", "金門縣", "連江縣"
];

// ============================
// 頁面載入後初始化天氣功能
// ============================
window.addEventListener("DOMContentLoaded", () => {
  const citySelect = document.getElementById("city");

  // 載入所有縣市到下拉選單
  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });

  // 開啟天氣查詢視窗
  document.getElementById("weather").addEventListener("click", () => {
    closeAllFeatureBoxes();
    document.getElementById("weatherBox").style.display = "block";
  });

  // 關閉天氣查詢視窗
  document.getElementById("closeWeather").addEventListener("click", () => {
    document.getElementById("weatherBox").style.display = "none";
    document.getElementById("output").innerHTML = "";
  });

  // 點擊送出按鈕查詢天氣
  document.getElementById("submitWeather").addEventListener("click", checkWeather);
});

// ============================
// 查詢並顯示天氣資料（CWA 氣象局 API）
// ============================
function checkWeather() {
  const city = document.getElementById("city").value;

  // 未選擇縣市提示
  if (!city) {
    document.getElementById("output").innerHTML = "<p style='color: red;'>請選擇縣市！</p>";
    return;
  }

  // 中央氣象署 API Key 與查詢網址
  const apiKey = "CWA-20035795-9F2B-4491-9525-4FEF7C9A2143";
  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}&locationName=${city}`;

  document.getElementById("output").innerHTML = "<p>查詢天氣中...</p>";

  // 發送 API 請求並處理回應
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const location = data.records.location[0];
      const cityName = location.locationName;
      const weather = location.weatherElement;

      // 取出各項天氣資訊
      const wx = weather[0].time[0].parameter.parameterName;   // 天氣現象
      const pop = weather[1].time[0].parameter.parameterName;  // 降雨機率
      const minT = weather[2].time[0].parameter.parameterName; // 最低溫
      const ci = weather[3].time[0].parameter.parameterName;   // 舒適度
      const maxT = weather[4].time[0].parameter.parameterName; // 最高溫

      // 顯示天氣卡片
      document.getElementById("output").innerHTML = `
        <div class='weather-card'>
          <h2>🌤 ${cityName} - 今明 36 小時天氣預報</h2>
          <p><strong>🌦 天氣狀況:</strong> ${wx}</p>
          <p><strong>🌡 氣溫範圍:</strong> ${minT}°C ~ ${maxT}°C</p>
          <p><strong>🌧 降雨機率:</strong> ${pop}%</p>
          <p><strong>😊 舒適度:</strong> ${ci}</p>
        </div>
      `;
    })
    .catch(err => {
      document.getElementById("output").innerHTML = `<p>查詢失敗：${err.message}</p>`;
    });
}
