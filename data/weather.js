// ============================
// 縣市清單
// ============================
const cities = [
  "臺北市", "新北市", "桃園市", "臺中市", "臺南市", "高雄市",
  "基隆市", "新竹市", "新竹縣", "苗栗縣", "彰化縣", "南投縣",
  "雲林縣", "嘉義市", "嘉義縣", "屏東縣", "宜蘭縣", "花蓮縣",
  "臺東縣", "澎湖縣", "金門縣", "連江縣"
];

// ============================
// 頁面初始化
// ============================
window.addEventListener("DOMContentLoaded", () => {
  const citySelect = document.getElementById("city");

  // 載入所有縣市
  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });

  // 綁定天氣查詢按鈕
  const weatherBtn = document.querySelector("button[alt='天氣查詢'], img[alt='天氣查詢']");
  if (weatherBtn) {
    weatherBtn.addEventListener("click", () => {
      showPage("page-weather");
    });
  }

  // 綁定送出查詢
  document.getElementById("submitWeather").addEventListener("click", checkWeather);
});

// ============================
// 切換頁面
// ============================
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(pageId).style.display = "block";
}

// ============================
// 查詢天氣
// ============================
function checkWeather() {
  const city = document.getElementById("city").value;
  const output = document.getElementById("output");

  if (!city) {
    output.innerHTML = "<p style='color:red;'>請選擇縣市！</p>";
    return;
  }

  const apiKey = "CWA-20035795-9F2B-4491-9525-4FEF7C9A2143";
  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}&locationName=${city}`;

  output.innerHTML = "<p>查詢天氣中...</p>";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const location = data.records.location[0];
      const cityName = location.locationName;
      const weather = location.weatherElement;

      const wx = weather[0].time[0].parameter.parameterName;   // 天氣現象
      const pop = weather[1].time[0].parameter.parameterName;  // 降雨機率
      const minT = weather[2].time[0].parameter.parameterName; // 最低溫
      const ci = weather[3].time[0].parameter.parameterName;   // 舒適度
      const maxT = weather[4].time[0].parameter.parameterName; // 最高溫

      output.innerHTML = `
        <div class="weather-card">
          <h2>${cityName} - 今明 36 小時天氣預報</h2>
          <p>☁ 天氣狀況: ${wx}</p>
          <p>🌡 氣溫範圍: ${minT}°C ~ ${maxT}°C</p>
          <p>🌧 降雨機率: ${pop}%</p>
          <p>😊 舒適度: ${ci}</p>
        </div>
      `;
    })
    .catch(err => {
      output.innerHTML = `<p style="color:red;">查詢失敗：${err.message}</p>`;
    });
}
