const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch
let serial;
let portButton;
let xPos = 200, yPos = 200;
let heatLampOn = false;

function setup() {
  createCanvas(400, 400);
  
  // Setup WebSerial
  serial = createSerial();
  
  portButton = createButton('Connect Arduino');
  portButton.position(10, 10);
  portButton.mousePressed(connectPort);
}

function draw() {
  background(heatLampOn ? 'orange' : 'white'); // Change color based on LED state

  // 1. Receive from Arduino
  if (serial.available() > 0) {
    let data = serial.readUntil('\n');
    console.log(data);
    if (data) {
      let sensors = split(data, ',');
      if (sensors.length == 2) {
        // Map joystick (0-1023) to canvas size
        xPos = map(sensors[0], 0, 1023, 0, width);
        yPos = map(sensors[1], 0, 1023, height, 0);
      }
    }
  }

  // Draw "Watering Can" controlled by Arduino Joystick
  fill('brown');
  rect(xPos, yPos, 40, 30, 5);
  rect(xPos + 38, yPos, 15, 5); // Spout

  // UI Instructions
  fill(0);
  text("Use the joystick to move the watering can", 20, 50);
  text("Click the mouse to toggle the LED", 20, 70);
}

// 2. Send to Arduino
function mousePressed() {
  // when the mouse is pressed, toggle heatLampOn boolean
  // to the opposite of what it currently is
  heatLampOn = !heatLampOn;
  // if heatLampOn is true
  if (heatLampOn) {
    // serial write the value 1
    serial.write('1');
    // otherwise...
  } else {
    //serial write the value 0
    serial.write('0');
  }
}

function connectPort() {
  if (!serial.opened()) {
    serial.open(9600);
    portButton.hide();
  }
}