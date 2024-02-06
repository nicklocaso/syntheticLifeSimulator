'use strict';

// Globals
let simulation;
let textToPrint;

// P5.js framework functions

function setup() {
  width = 800;
  height = 600;
  simulation = new Simulation();
  createCanvas(simulation.width, simulation.height);

  // GUI
  createButton('Pause/Resume')
    .style('font-size', '16px')
    .style('padding', '10px')
    .mousePressed(pauseButtonIsPressed);

  createButton('Speed Up')
    .style('font-size', '16px')
    .style('padding', '10px')
    .mousePressed(speedUpButtonIsPressed);

  createButton('Slow Down')
    .style('font-size', '16px')
    .style('padding', '10px')
    .mousePressed(slowDownButtonIsPressed);

  createButton('Export')
    .style('font-size', '16px')
    .style('padding', '10px')
    .mousePressed(exportButtonIsPressed);

  createFileInput(importButtonIsPressed)
    .style('font-size', '14px')
    .style('padding', '8px');
}

function draw() {
  textToPrint = '';
  background(150, 150, 150);
  //
  simulation.update();
  simulation.display();
  //
  noStroke();
  fill(0);
  textSize(10);
  text(textToPrint, 10, 10);
}

//- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- -//

// Handlers

function printLine(text) {
  textToPrint = textToPrint ? `${textToPrint}\n${text}` : text;
}

function pauseButtonIsPressed() {
  simulation.switchPause();
}
function speedUpButtonIsPressed() {
  simulation.changeTime(+0.1);
}

function slowDownButtonIsPressed() {
  simulation.changeTime(-0.1);
}

function exportButtonIsPressed() {
  // TODO
}

function importButtonIsPressed(file) {
  // TODO
}

//- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- -//

class Simulation {
  static export() {
    // TODO
  }

  static import() {
    // TODO
  }

  static generateEntities() {
    let es = [];
    for (let i = 0; i < 10; i++) {
      es.push(new Red(random(width), random(height)));
    }
    for (let i = 0; i < 10; i++) {
      es.push(new Blue(random(width), random(height)));
    }
    for (let i = 0; i < 10; i++) {
      es.push(new Green(random(width), random(height)));
    }
    return es;
  }

  constructor(entities) {
    // Map data
    this.width = width;
    this.height = height;
    // TODO: add map obstacles
    // Time
    this.isRunning = false;
    this.timeMillis = 0;
    // Entities
    this.entities =
      entities && Array.isArray(entities) && entities.length > 0
        ? entities
        : Simulation.generateEntities(this.width, this.height);
  }

  update() {
    if (!this.isRunning) return;
    for (let e of this.entities) {
      e.update();
    }
  }

  display() {
    for (let e of this.entities) {
      e.display();
    }
    printLine(`Is Running: ${this.isRunning}`);
  }

  switchPause() {
    this.isRunning = !this.isRunning;
  }

  changeTime(deltaTime) {}

  export() {}
}

//- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- -//

class Entity {
  constructor(x, y, velocityX, velocityY) {
    this.x = typeof x === 'number' ? constrain(x, 0, width) : random(width);
    this.y = typeof y === 'number' ? constrain(y, 0, height) : random(height);
    this.vX = typeof velocityX === 'number' ? velocityX : random(-2, 2);
    this.vY = typeof velocityY === 'number' ? velocityY : random(-2, 2);
    this.color = color(255, 255, 255);
  }

  update() {
    // Out of borders
    if ((this.x <= 0 && this.vX < 0) || (this.x >= width && this.vX > 0)) {
      this.vX *= -1;
    } else if (
      (this.y <= 0 && this.vY < 0) ||
      (this.y >= height && this.vY > 0)
    ) {
      this.vY *= -1;
    }

    //
    this.x += this.vX;
    this.y += this.vY;
  }

  display() {
    stroke(this.color);
    strokeWeight(5);
    point(this.x, this.y);
  }

  toString() {
    // TODO
  }
}

//- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- -//

class Red extends Entity {
  constructor(...args) {
    super(...args);
    this.id = 'RED';
    this.color = color(255, 0, 0);
  }
}

class Blue extends Entity {
  constructor(...args) {
    super(...args);
    this.id = 'BLUE';
    this.color = color(0, 0, 255);
  }
}

class Green extends Entity {
  constructor(...args) {
    super(...args);
    this.id = 'GREEN';
    this.color = color(0, 255, 0);
  }
}
