#include <WiFi.h>
#include <WebServer.h>
#include <SD.h>
#include <SPI.h>
#include <AccelStepper.h>
#include "classroom.h" // 教室角度表，需包含 unordered_map<String, int> classroomAngles

// WiFi 設定
const char* ssid = "310_Lab";
const char* password = "TAHRD310";

// SD卡設定
#define SD_CS 5  // SD 卡 CS 腳位

// 蜂鳴器設定
#define BUZZER_PIN 22  // 接蜂鳴器腳位

WebServer server(80);

// 馬達設定
#define DIR_PIN 14    // 方向
#define STEP_PIN 12   // 步進
AccelStepper stepper(AccelStepper::DRIVER, STEP_PIN, DIR_PIN);

// 紀錄目前角度
int currentAngle = 0;

void setup() {
  Serial.begin(115200);

  pinMode(BUZZER_PIN, OUTPUT);

  // WiFi 連線
  WiFi.begin(ssid, password);
  Serial.print("連線中...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi 連線成功！");
  Serial.print("📡 IP 位址: ");
  Serial.println(WiFi.localIP());

  // SD 卡初始化
  if (!SD.begin(SD_CS)) {
    Serial.println("⚠️ SD卡初始化失敗！");
    return;
  }
  Serial.println("✅ SD卡初始化成功");

  // 馬達初始化
  stepper.setMaxSpeed(1000);
  stepper.setAcceleration(500);

  // 設定網頁伺服器
  server.on("/", []() {
    File file = SD.open("/index.html");
    if (file) {
      server.streamFile(file, "text/html");
      file.close();
    } else {
      server.send(404, "text/plain", "index.html not found");
    }
  });

  server.on("/rotate", handleRotate);
  server.onNotFound(handleFileRequest);

  server.begin();
  Serial.println("🌐 HTTP伺服器啟動完成");
}

void loop() {
  server.handleClient();
  stepper.run(); // 執行馬達移動
}

// 提供靜態資源 (js, css, 圖片等)
void handleFileRequest() {
  String path = urlDecode(server.uri());

  if (!path.startsWith("/")) path = "/" + path;
  if (path.endsWith("/")) path += "index.html";

  Serial.println("📄 嘗試讀取檔案：" + path);

  String contentType = getContentType(path);
  File file = SD.open(path.c_str());

  if (!file) {
    Serial.println("❌ 檔案找不到：" + path);
    server.send(404, "text/plain", "File not found: " + path);
    return;
  }

  server.streamFile(file, contentType);
  file.close();
  Serial.println("✅ 成功提供檔案：" + path);
}

// 根據副檔名回傳 MIME 類型
String getContentType(String filename) {
  if (filename.endsWith(".html")) return "text/html";
  if (filename.endsWith(".css")) return "text/css";
  if (filename.endsWith(".js")) return "application/javascript";
  if (filename.endsWith(".json")) return "application/json";
  if (filename.endsWith(".png")) return "image/png";
  if (filename.endsWith(".jpg")) return "image/jpeg";
  if (filename.endsWith(".jpeg")) return "image/jpeg";
  if (filename.endsWith(".gif")) return "image/gif";
  if (filename.endsWith(".ico")) return "image/x-icon";
  return "text/plain";
}

// 控制馬達旋轉到指定教室
void handleRotate() {
  if (!server.hasArg("classroom")) {
    server.send(400, "text/plain", "Missing parameter");
    return;
  }

  String classroom = server.arg("classroom");
  Serial.println("🧭 收到教室請求: " + classroom);

  if (classroomAngles.find(classroom) == classroomAngles.end()) {
    server.send(404, "text/plain", "Unknown classroom");
    return;
  }

  int targetAngle = classroomAngles[classroom];
  int deltaAngle = targetAngle - currentAngle;

  // 處理方向最短路徑
  if (deltaAngle > 180) deltaAngle -= 360;
  if (deltaAngle < -180) deltaAngle += 360;

  int stepsPerRevolution = 200; // 根據你的馬達設定
  int steps = deltaAngle * stepsPerRevolution / 360;

  stepper.move(steps);
  currentAngle = targetAngle;

  server.send(200, "text/plain", "旋轉成功到 " + classroom);
  Serial.println("✅ 指向已更新至 " + classroom);

  tone(BUZZER_PIN, 1000, 200); // 發出 1000Hz 音調，200ms
}

// 解碼 URL 字串
String urlDecode(const String& input) {
  String decoded = "";
  char c;
  for (int i = 0; i < input.length(); i++) {
    if (input[i] == '%') {
      if (i + 2 < input.length()) {
        char hex[3] = { input[i + 1], input[i + 2], 0 };
        c = strtol(hex, NULL, 16);
        decoded += c;
        i += 2;
      }
    } else if (input[i] == '+') {
      decoded += ' ';
    } else {
      decoded += input[i];
    }
  }
  return decoded;
}
