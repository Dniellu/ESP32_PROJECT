// === 🚏 公車站牌資料 ===
const busStations = [
  { name: "師大(正門)", address: "台北市大安區和平東路一段", lat: 25.026561533860896, lng: 121.52787469175102 },
  { name: "師大(正門對面)", address: "台北市大安區和平東路一段", lat: 25.02687262224867, lng: 121.52781568315359 },
  { name: "師大(師大路)", address: "台北市大安區師大路", lat: 25.026119203701775, lng: 121.52851842190495 },
  { name: "師大綜合大樓(綜合大樓前)", address: "台北市大安區浦城街", lat: 25.026712217400604, lng: 121.53003655221535 },
  { name: "師大綜合大樓(八方雲集側)", address: "台北市大安區浦城街", lat: 25.026401128606224, lng: 121.52995072152815 }
];

// === 🚏 顯示附近公車站牌 ===
function findNearestBUS() {
  const sorted = busStations.map(st => ({
    ...st,
    distance: getDistance(fixedLat, fixedLng, st.lat, st.lng)
  })).sort((a, b) => a.distance - b.distance);

  const output = document.getElementById("bus-output");
  if (output) {
    output.innerHTML = ''; // 清空舊卡片
    sorted.forEach(st => {
      const card = document.createElement("div");
      card.className = "card"; // 套用 CSS

      card.innerHTML = `
        <img src="img/bus.png" alt="${st.name}">
        <h3>${st.name}</h3>
        <p>📍 ${st.address}</p>
        <p>📏 ${st.distance.toFixed(2)} 公里</p>
        <button onclick="openGoogleMaps(${st.lat}, ${st.lng})">🚀 開啟導航</button>
      `;
      output.appendChild(card);
    });
  }
}
