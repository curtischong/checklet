import WebSocket from "ws";

const ws = new WebSocket("wss://100.27.18.241:2053"); // Use your WebSocket URL

ws.on("open", function open() {
  console.log("Connected to the WebSocket server");
  ws.send("Hello from client!");
});

ws.on("message", function message(data) {
  console.log("Received message:", data);
});

ws.on("close", function close() {
  console.log("WebSocket connection closed");
});

ws.on("error", function error(err) {
  console.error("WebSocket error:", err);
});
