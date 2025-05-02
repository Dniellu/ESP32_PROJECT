#include <WiFi.h>
#include <WebServer.h>
#include <SD.h>
#include <SPI.h>
#include <AccelStepper.h>
#include "classroom.h" // 你的教室角度表

// WiFi 設定
const char* ssid = "310_Lab";
const char* password = "TAHRD310";

// SD卡設定
#define SD_CS 5  // 你的SD卡筆記D5

WebServer server(80);

// 馬達設定
#define DIR_PIN 14    // 方向
#define STEP_PIN 12   // 步進
AccelStepper stepper(AccelStepper::DRIVER, STEP_PIN, DIR_PIN);

// 記錄目前的角度
int currentAngle = 0;
bool isRotating = false; // 新增：是否正在轉動

void setup() {
  Serial.begin(115200);

  // 連WiFi
  WiFi.begin(ssid, password);
  Serial.print("\u9023\u7dda\u4e2d...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi\u9023\u7dda\u6210\u529f");
  Serial.println(WiFi.localIP());

  // 初始化SD卡
  if (!SD.begin(SD_CS)) {
    Serial.println("SD\u5361\u521d\u59cb\u5316\u5931\u6557");
    return;
  }
  Serial.println("SD\u5361\u521d\u59cb\u5316\u6210\u529f");

  // 馬達初始化
  stepper.setMaxSpeed(200);
  stepper.setAcceleration(100);

  // 網頁伺服器設定
  server.on("/", handleRoot);
  server.onNotFound(handleFileRequest);
  server.on("/rotate", handleRotate);

  server.begin();
  Serial.println("HTTP\u670d\u52d9\u5668\u555f\u52d5\u5b8c成");
}

void loop() {
  if (isRotating) {
    if (stepper.distanceToGo() != 0) {
      stepper.run();
    } else {
      isRotating = false;
      Serial.println("\u8f49\u52d5\u5b8c\u6210");
    }
  } else {
    server.handleClient();
  }
}

// 根盤目錄
void handleRoot() {
  File file = SD.open("/index.html");
  if (!file) {
    server.send(404, "text/plain", "File not found");
    return;
  }
  server.streamFile(file, "text/html");
  file.close();
}

// 請求其他檔案 (js, css, 圖片)
void handleFileRequest() {
  String path = server.uri();
  if (path.endsWith("/")) path += "index.html";

  String contentType = getContentType(path);

  File file = SD.open(path.c_str());
  if (!file) {
    server.send(404, "text/plain", "File not found");
    return;
  }
  server.streamFile(file, contentType);
  file.close();
}

// 根擬副檔名判斷 MIME Type
String getContentType(String filename) {
  if (filename.endsWith(".html")) return "text/html";
  if (filename.endsWith(".css")) return "text/css";
  if (filename.endsWith(".js")) return "application/javascript";
  if (filename.endsWith(".json")) return "application/json";
  if (filename.endsWith(".png")) return "image/png";
  if (filename.endsWith(".jpg")) return "image/jpeg";
  if (filename.endsWith(".gif")) return "image/gif";
  if (filename.endsWith(".ico")) return "image/x-icon";
  return "text/plain";
}

// 接收教室選擇並轉動馬達
void handleRotate() {
  if (!server.hasArg("classroom")) {
    server.send(400, "text/plain", "Missing parameter");
    return;
  }

  String classroom = server.arg("classroom");
  Serial.println("\u6536\u5230\u6559\u5ba4\u8acb\u6c42: " + classroom);

  if (classroomAngles.find(classroom) == classroomAngles.end()) {
    server.send(404, "text/plain", "Unknown classroom");
    return;
  }

  int targetAngle = classroomAngles[classroom];
  int deltaAngle = targetAngle - currentAngle;

  // 修正短路徑
  if (deltaAngle > 180) deltaAngle -= 360;
  if (deltaAngle < -180) deltaAngle += 360;

  int stepsPerRevolution = 200; // 依你的步進馬達設定
  int steps = deltaAngle * stepsPerRevolution / 360;

  Serial.println("\u8a08\u7b97\u51fa\u8981\u8f49\u7684\u6b65\u6578: " + String(steps));

  stepper.move(steps);
  currentAngle = targetAngle;
  isRotating = true;

  server.send(200, "text/plain", "\u65cb\u8f49\u6210\u529f\u5230 " + classroom);
}
