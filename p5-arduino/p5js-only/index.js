const BAUD_RATE = 9600;

let port, connectBtn;
let isMousePressed = 0;

function setup() {
  setupSerial();
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  const portIsOpen = checkPort();
  if (!portIsOpen) return;

  // Read the Arduino's echo
  let str = port.readUntil("\n");
  if (str.length > 0) {
    isMousePressed = Number(str.trim());
  }
  port.write([val]);
  if (mouseIsPressed){
                fill("green");
            } else {
                fill("red");
            }
            rect(mouseX, mouseY, 50, 50);
}

// --- Serial helpers ---

function setupSerial() {
  port = createSerial();

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], BAUD_RATE);
  }

  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5);
  connectBtn.mouseClicked(onConnectButtonClicked);
}

function checkPort() {
  if (!port.opened()) {
    connectBtn.html("Connect to Arduino");
    background("gray");
    return false;
  } else {
    connectBtn.html("Disconnect");
    return true;
  }
}

function onConnectButtonClicked() {
  if (!port.opened()) {
    port.open(BAUD_RATE);
  } else {
    port.close();
  }
}