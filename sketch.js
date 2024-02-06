'use strict';

// Globals
let simulation;
let textToPrint;

// P5.js framework functions

function setup() {
  simulation = new Simulation(800, 600);
  simulation.setup();
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

  inputbtn = createFileInput(importButtonIsPressed)
    .style('font-size', '14px')
    .style('padding', '8px');
}

function draw() {
  textToPrint = '';
  //
  simulation.update();
  simulation.display();
  //
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
      es.push(new Entity(random(width), random(height)));
    }
    return es;
  }

  constructor(simulationWidth, simulationHeight, entities) {
    // Map data
    this.width = simulationWidth;
    this.height = simulationHeight;
    // TODO: add map obstacles
    // Time
    this.isRunning = false;
    this.timeMillis = 0;
    // Entities
    this.entities =
      entities && Array.isArray(entities) && entities.length > 0
        ? entities
        : Simulation.generateEntities();
  }

  update() {
    if (!this.isRunning) return;
    for (let e of this.entities) {
      e.update();
    }
    printLine(`Pause: ${this.isRunning}`);
  }

  display() {
    if (!this.isRunning) return;
    for (let e of this.entities) {
      e.display();
    }
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
    stroke(255, 255, 255);
    strokeWeight(5);
    point(this.x, this.y);
  }

  toString() {
    // TODO
  }
}

//- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- -//

class Organism extends Entity {
  constructor(...args) {
    super(...args);
    // TODO: adding life characteristics (health ecc)
  }
}

// Functions to control the simulation
function pauseSimulation() {
  if (isRunning) {
    // sta andando e lo sto bloccando
    startPause = millis();
    pauseLength = 0;
    isRunning = false;
  } else {
    // è in pausa e lo sto avviando
    pauseLength = millis() - startPause;
    isRunning = true;
  }
}

function speedUpSimulation() {
  simulationSpeed *= 2;
}

function slowDownSimulation() {
  simulationSpeed /= 2;
}
