// foodmap.js

// === 🌐 固定位置設定（師大和平校區附近） ===
const fixedLat = 25.025170138217476;
const fixedLng = 121.52791149741792;

// === 📏 計算兩點距離（公里） ===
function getDistance(lat1, lng1, lat2, lng2) {
  function toRad(deg) {
    return deg * Math.PI / 180;
  }
  const R = 6371; // 地球半徑 (公里)
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

// === 🍜 美食地點資料 ===
const foodSpots = [
  { name: "八方雲集（浦城店）", address: "台北市大安區和平東路一段182-3號", lat: 25.026391204355118, lng: 121.53000996795559 },
  { name: "師園鹹酥雞", address: "台北市大安區師大路39巷14號", lat: 25.024619139008344, lng: 121.5290237370823 },
  { name: "13 Burger", address: "台北市大安區師大路49巷13號1樓", lat: 25.024410716521547, lng: 121.52937516798522 },
  { name: "燈籠滷味", address: "台北市大安區師大路43號", lat: 25.024738046314173, lng: 121.52867589496981 },
  { name: "牛老大牛肉麵", address: "台北市大安區龍泉街19-2號", lat: 25.025005532603156, lng: 121.5294764968212 }
];

// === 🍱 顯示附近美食清單（距離排序） ===
function showFoodMap() {
  const container = document.querySelector("#page-foodmap .foodmap-container");
  if (!container) return;

  container.innerHTML = "<p>📍 正在載入美食資料...</p>";

  // 計算距離 + 排序
  const sorted = foodSpots.map(spot => ({
    ...spot,
    distance: getDistance(fixedLat, fixedLng, spot.lat, spot.lng)
  })).sort((a, b) => a.distance - b.distance);

  // 顯示美食卡片
  container.innerHTML = "";
  sorted.forEach(spot => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <h3>${spot.name}</h3>
      <p>📍 地址: ${spot.address}</p>
      <p>📏 距離: ${spot.distance.toFixed(2)} 公里</p>
      <button onclick="openGoogleMaps(${spot.lat}, ${spot.lng})">開始導航</button>
    `;
    container.appendChild(el);
  });
}
