#include <WiFi.h>
#include <WebServer.h>
#include <SD.h>
#include <SPI.h>
#include <AccelStepper.h>
#include "classroom.h"  // 教室角度表，需包含 unordered_map<String, int> classroomAngles

#include <MD_MAX72XX.h>

// ==== WiFi 設定 ====
const char* ssid = "310_Lab";
const char* password = "TAHRD310";

// ==== SD卡設定 ====
#define SD_CS 5  // SD 卡 CS 腳位

// ==== 蜂鳴器設定 ====
#define BUZZER_PIN 22  // 蜂鳴器腳位

WebServer server(80);

// ==== 馬達設定 ====
#define DIR_PIN 14
#define STEP_PIN 12
AccelStepper stepper(AccelStepper::DRIVER, STEP_PIN, DIR_PIN);
int currentAngle = 0;  // 紀錄目前角度

// ==== MAX7219 + 1088AS LED 矩陣設定 ====
#define DIN_PIN   22   // 你實際接的 DIN
#define CLK_PIN   21   // 你說 CLK 接 GPIO21
#define CS_PIN    15   // CS/LOAD (選擇一個腳位)

#define HARDWARE_TYPE MD_MAX72XX::FC16_HW
#define MAX_DEVICES   1

MD_MAX72XX mx = MD_MAX72XX(HARDWARE_TYPE, DIN_PIN, CLK_PIN, CS_PIN, MAX_DEVICES);

// 向右箭頭圖案 (8x8)
byte arrow_right[8] = {
  B00011000,
  B00011100,
  B11111111,
  B11111111,
  B11111111,
  B00011100,
  B00011000,
  B00010000
};

// ==== 初始化 ====
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

  // LED 矩陣初始化
  mx.begin();
  mx.control(MD_MAX72XX::INTENSITY, 8);  // 亮度 0~15
  mx.clear();
  drawArrow();

  // 設定 WebServer
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

// ==== LED 畫箭頭 ====
void drawArrow() {
  mx.clear();
  for (int row = 0; row < 8; row++) {
    for (int col = 0; col < 8; col++) {
      bool pixel = bitRead(arrow_right[row], 7 - col); // 逐點繪製
      mx.setPoint(row, col, pixel);
    }
  }
}

// ==== 提供靜態檔案 ====
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

// ==== 控制馬達旋轉 ====
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

  int stepsPerRevolution = 200; // 依照馬達規格
  int steps = deltaAngle * stepsPerRevolution / 360;

  stepper.move(steps);
  currentAngle = targetAngle;

  server.send(200, "text/plain", "旋轉成功到 " + classroom);
  Serial.println("✅ 指向已更新至 " + classroom);

  tone(BUZZER_PIN, 1000, 200); // 發出 1000Hz 音調，200ms

  drawArrow(); // 旋轉後刷新箭頭
}

// ==== URL 解碼 ====
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
