// 更新時間
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    document.getElementById("time").textContent = `${hours}:${minutes}`;

    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const weekday = weekdayNames[now.getDay()];
    document.getElementById("date").textContent = `${year}年${month}月${day}日, ${weekday}`;
}

setInterval(updateTime, 1000);
updateTime();

// 頁面切換
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(pageId).style.display = "block";

  if (pageId === "page-foodmap") {
    showFoodMap();
  }
}

// 假的教室導引功能
function openGuide() {
    alert("前往教室導引頁面！");
}
