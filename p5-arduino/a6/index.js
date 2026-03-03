const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch
let serial; // placeholder variable that will later hold the WebSerial object
let portButton; // placeholder variable to store the "Connect" button
let xPos = 200, yPos = 200; // starting coordinates for the watering can (center of canvas)
let growLampOn = false; // make a boolean growlampOn that starts as false (light is off)

//setup
function setup() {
  createCanvas(400, 400); // create the canvas size of the game
  
  // setup WebSerial
  serial = createSerial();
  
  // make a button on the screen that says connect to arduino
  portButton = createButton('Connect Arduino');
  // button position on canvas
  portButton.position(10, 10);
  // in the case that the mouse is pressed on the button, run the connectPort function
  portButton.mousePressed(connectPort);
}

//draw
function draw() {
  // if the growLampOn variable is true...
  if (growLampOn == true) {
    background('orange'); // if the lamp is on, make the screen orange
  // otherwise...
  } else {
    background('white');  // if the lamp is off, make the screen white
  }
  // if there is data to receive from Arduino...
  if (serial.available() > 0) {
    // the variable "data" is added onto from the string in the serial 
    // until it hits a new line
    let data = serial.readUntil('\n');
    //prints the data to F12 console for debugging
    console.log(data);
    // if data has a value
    if (data) {
      // takes the string in data and chops it apart based on where the "," is in the 
      // string and puts the values into an array
      let sensors = split(data, ',');
      // if the array has 2 values (x and y values)...
      if (sensors.length == 2) {
        // Map joystick (0-1023) to canvas size
        xPos = map(sensors[0], 0, 1023, 0, width); // x value
        yPos = map(sensors[1], 0, 1023, height, 0); // y value
      }
    }
  }

  // draw a watering can controlled by Arduino joystick
  fill('brown'); // fill the shape with brown
  rect(xPos, yPos, 40, 30, 5); // draw rectangle for base of watering can
  // and place it at xPos and yPos that we calculated in the draw function
  rect(xPos + 38, yPos, 15, 5); // draw rectangle for spout of watering can
  // and place it at xPos and yPos that we calculated in the draw function

  // write instructions for the game
  fill(0); // fill text with black
  text("Use the joystick to move the watering can", 20, 50); // write text at location 20,50
  text("Click the mouse to toggle the LED", 20, 70); // write text at location 20,70
}

// send to Arduino
function mousePressed() {
  // toggle growLampOn boolean to the opposite of what it currently is
  growLampOn = !growLampOn;
  // if growLampOn is true
  if (growLampOn) {
    // serial write the value 1
    serial.write('1');
    // otherwise...
  } else {
    //serial write the value 0
    serial.write('0');
  }
}

// connect the computer to the arduino
function connectPort() {
  // if serial is not already connected
  if (!serial.opened()) {
    serial.open(9600); // pick Arduino
    portButton.hide(); // removes connect button once arduino is connected
  }
}