// === 🌐 固定位置設定（師大和平校區附近） ===
const fixedLat = 25.025170138217476;
const fixedLng = 121.52791149741792;

// === 📏 計算兩點距離（公里） ===
function getDistance(lat1, lng1, lat2, lng2) {
  function toRad(deg) {
    return deg * Math.PI / 180;
  }
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// === 🚀 開啟 Google 地圖導航連結 ===
function openGoogleMaps(lat, lng) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, '_blank');
}

// === ❌ 關閉所有功能區塊（清空顯示） ===
function closeAllFeatureBoxes() {
  ["weatherBox", "classroomBox", "result", "dm-container"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
  const output = document.getElementById("output");
  if (output) output.innerHTML = "";
}

// === 🍜 美食地點資料 ===
const foodSpots = [
  { name: "八方雲集（浦城店）", address: "台北市大安區和平東路一段182-3號", lat: 25.026391204355118, lng: 121.53000996795559 },
  { name: "師園鹹酥雞", address: "台北市大安區師大路39巷14號", lat: 25.024619139008344, lng: 121.5290237370823 },
  { name: "13 Burger", address: "台北市大安區師大路49巷13號1樓", lat: 25.024410716521547, lng: 121.52937516798522 },
  { name: "燈籠滷味", address: "台北市大安區師大路43號", lat: 25.024738046314173, lng: 121.52867589496981 },
  { name: "牛老大牛肉麵", address: "台北市大安區龍泉街19-2號", lat: 25.025005532603156, lng: 121.5294764968212 }
];

// === 🍱 顯示附近美食清單（距離排序） ===
function findFood() {
  const output = document.getElementById("output");
  if (output) output.innerHTML = "<p>📍 正在載入美食資料...</p>";

  const sorted = foodSpots.map(spot => ({
    ...spot,
    distance: getDistance(fixedLat, fixedLng, spot.lat, spot.lng)
  })).sort((a, b) => a.distance - b.distance);

  if (output) {
    output.innerHTML = `<h2>🍜 附近的美食推薦</h2>`;
    sorted.forEach(spot => {
      const el = document.createElement("div");
      el.className = "station-card";
      el.innerHTML = `
        <h3>${spot.name}</h3>
        <p><strong>📍 地址:</strong> ${spot.address}</p>
        <p><strong>📏 距離:</strong> ${spot.distance.toFixed(2)} 公里</p>
        <button class="navigate-btn" onclick="openGoogleMaps(${spot.lat}, ${spot.lng})">🚀 開啟導航</button>
      `;
      output.appendChild(el);
    });
  }
}

// === 🏫 校區資料與顯示 ===
function showCampusInfo(name) {
  const data = {
    "和平校區": { address: "台北市大安區和平東路", lat: 25.0265, lng: 121.5270 },
    "圖書館校區": { address: "台北市大安區師大路", lat: 25.0268, lng: 121.5298 },
    "公館校區": { address: "台北市中正區思源街", lat: 25.00791592293412, lng: 121.53719859711522 },
    "林口校區": { address: "新北市林口區", lat: 25.068189405956723, lng: 121.39784825109346 }
  };
  const c = data[name];
  const output = document.getElementById("output");
  if (output) {
    output.innerHTML = `
      <div class='campus-card'>
        <h2>${name}</h2>
        <p><strong>📍 地址:</strong> ${c.address}</p>
        <button onclick="openGoogleMaps(${c.lat}, ${c.lng})">🚀 開啟導航</button>
        <button onclick="findLocations()">⬅️ 返回校區選單</button>
      </div>`;
  }
}

// === 🚏 公車站牌資料與顯示 ===
const busStations = [
  { name: "師大(正門)", address: "台北市大安區和平東路一段", lat: 25.026561533860896, lng: 121.52787469175102 },
  { name: "師大(正門對面)", address: "台北市大安區和平東路一段", lat: 25.02687262224867, lng: 121.52781568315359 },
  { name: "師大(師大路)", address: "台北市大安區師大路", lat: 25.026119203701775, lng: 121.52851842190495 },
  { name: "師大綜合大樓(綜合大樓前)", address: "台北市大安區浦城街", lat: 25.026712217400604, lng: 121.53003655221535 },
  { name: "師大綜合大樓(八方雲集側)", address: "台北市大安區浦城街", lat: 25.026401128606224, lng: 121.52995072152815 }
];

function findNearestBUS() {
  const sorted = busStations.map(st => ({
    ...st,
    distance: getDistance(fixedLat, fixedLng, st.lat, st.lng)
  })).sort((a, b) => a.distance - b.distance);

  const output = document.getElementById("output");
  if (output) {
    output.innerHTML = `<h2>🚏 附近的公車站牌</h2>`;
    sorted.forEach(st => {
      const el = document.createElement("div");
      el.className = "station-card";
      el.innerHTML = `
        <h3>${st.name}</h3>
        <p><strong>地址:</strong> ${st.address}</p>
        <p><strong>距離:</strong> ${st.distance.toFixed(2)} 公里</p>
        <button class="navigate-btn" onclick="openGoogleMaps(${st.lat}, ${st.lng})">🚀 開啟導航</button>
      `;
      output.appendChild(el);
    });

    // 加上返回按鈕
    const backButton = document.createElement("button");
    backButton.textContent = "⬅️ 返回";
    backButton.onclick = openMap;
    backButton.style.marginTop = "20px";
    output.appendChild(backButton);
  }
}

// === 🚇 捷運站資料與顯示 ===
const mrtStations = [
  { name: "古亭站", address: "台北市中正區羅斯福路", lat: 25.021829220678253, lng: 121.52814535783513 },
  { name: "公館站", address: "台北市中正區羅斯福路四段", lat: 25.01584965714648, lng: 121.5383549810451 },
  { name: "科技大樓站", address: "台北市大安區復興南路一段", lat: 25.025842138634974, lng: 121.5445329197595 }
];

function findNearestMRT() {
  const sorted = mrtStations.map(st => ({
    ...st,
    distance: getDistance(fixedLat, fixedLng, st.lat, st.lng)
  })).sort((a, b) => a.distance - b.distance);

  const output = document.getElementById("output");
  if (output) {
    output.innerHTML = `<h2>🚇 附近的捷運站</h2>`;
    sorted.forEach(st => {
      const el = document.createElement("div");
      el.className = "station-card";
      el.innerHTML = `
        <h3>${st.name}</h3>
        <p><strong>地址:</strong> ${st.address}</p>
        <p><strong>距離:</strong> ${st.distance.toFixed(2)} 公里</p>
        <button class="navigate-btn" onclick="openGoogleMaps(${st.lat}, ${st.lng})">🚀 開啟導航</button>
      `;
      output.appendChild(el);
    });
  }
}

// === 🚲 YouBike 站點資料與顯示 ===
const youbikeStations = [
  { name: "捷運科技大樓站(1號出口)", address: "台北市大安區復興南路一段390號", lat: 25.026998303233184, lng: 121.54384583812368 },
  { name: "捷運科技大樓站(2號出口)", address: "台北市大安區復興南路一段416號", lat: 25.027232250004858, lng: 121.54546946202438 },
  { name: "捷運古亭站(3號出口)", address: "台北市中正區汀州路三段117號", lat: 25.019608088645825, lng: 121.52783969764386 },
  { name: "捷運公館站(1號出口)", address: "台北市中正區羅斯福路四段72號", lat: 25.015092872987378, lng: 121.53761166405995 }
];

function findYoubike() {
  const sorted = youbikeStations.map(st => ({
    ...st,
    distance: getDistance(fixedLat, fixedLng, st.lat, st.lng)
  })).sort((a, b) => a.distance - b.distance);

  const output = document.getElementById("output");
  if (output) {
    output.innerHTML = `<h2>🚲 附近的YouBike站點</h2>`;
    sorted.forEach(st => {
      const el = document.createElement("div");
      el.className = "station-card";
      el.innerHTML = `
        <h3>${st.name}</h3>
        <p><strong>地址:</strong> ${st.address}</p>
        <p><strong>距離:</strong> ${st.distance.toFixed(2)} 公里</p>
        <button class="navigate-btn" onclick="openGoogleMaps(${st.lat}, ${st.lng})">🚀 開啟導航</button>
      `;
      output.appendChild(el);
    });
  }
}

// === 🔄 主選單 / 校區選單 顯示控制 ===
function showCampusMenu() {
  document.getElementById("main-buttons").style.display = "none";
  document.getElementById("campus-buttons").style.display = "flex";
  document.getElementById("back-button").style.display = "block";
}

function backToMain() {
  document.getElementById("campus-buttons").style.display = "none";
  document.getElementById("main-buttons").style.display = "flex";
  document.getElementById("back-button").style.display = "none";
}
