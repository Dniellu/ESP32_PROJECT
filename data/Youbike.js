// === 🚲 YouBike 站點資料 ===
const youbikeStations = [
  { name: "捷運科技大樓站(1號出口)", address: "台北市大安區復興南路一段390號", lat: 25.026998303233184, lng: 121.54384583812368 },
  { name: "捷運科技大樓站(2號出口)", address: "台北市大安區復興南路一段416號", lat: 25.027232250004858, lng: 121.54546946202438 },
  { name: "捷運古亭站(3號出口)", address: "台北市中正區汀州路三段117號", lat: 25.019608088645825, lng: 121.52783969764386 },
  { name: "捷運公館站(1號出口)", address: "台北市中正區羅斯福路四段72號", lat: 25.015092872987378, lng: 121.53761166405995 }
];

// === 🚲 顯示附近 YouBike ===
function findYoubike() {
  const sorted = youbikeStations.map(st => ({
    ...st,
    distance: getDistance(fixedLat, fixedLng, st.lat, st.lng)
  })).sort((a, b) => a.distance - b.distance);

  const output = document.getElementById("youbike-output");
  if (output) {
    output.innerHTML = '';
    sorted.forEach(st => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${st.name}</h3>
        <p>📍 ${st.address}</p>
        <p>📏 ${st.distance.toFixed(2)} 公里</p>
        <button onclick="openGoogleMaps(${st.lat}, ${st.lng})">🚀 開啟導航</button>
      `;
      output.appendChild(card);
    });
  }
}

