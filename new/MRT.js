// === 🚇 捷運站資料 ===
const mrtStations = [
  { name: "古亭站", address: "台北市中正區羅斯福路", lat: 25.021829220678253, lng: 121.52814535783513 },
  { name: "公館站", address: "台北市中正區羅斯福路四段", lat: 25.01584965714648, lng: 121.5383549810451 },
  { name: "科技大樓站", address: "台北市大安區復興南路一段", lat: 25.025842138634974, lng: 121.5445329197595 }
];

// === 🚇 顯示附近捷運站 ===
function findNearestMRT() {
  const sorted = mrtStations.map(st => ({
    ...st,
    distance: getDistance(fixedLat, fixedLng, st.lat, st.lng)
  })).sort((a, b) => a.distance - b.distance);

  const output = document.getElementById("mrt-output");
  if (output) {
    output.innerHTML = ''; // 清空舊卡片
    sorted.forEach(st => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="img/mrt.png" alt="${st.name}">
        <h3>${st.name}</h3>
        <p>📍 ${st.address}</p>
        <p>📏 ${st.distance.toFixed(2)} 公里</p>
        <button onclick="openGoogleMaps(${st.lat}, ${st.lng})">🚀 開啟導航</button>
      `;
      output.appendChild(card);
    });
  }
}
