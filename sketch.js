'use strict';

// Globals
let simulation;
let textToPrint;

let camX = 0;
let camY = 0;
let zoom = 100;
let zoomStep = 20;

// P5.js framework functions

function setup() {
  width = 1000;
  height = 1200;
  simulation = new Simulation();
  createCanvas(simulation.width, simulation.height);

  // GUI
  createButton('Pause/Resume')
    .style('font-size', '16px')
    .style('padding', '10px')
    .mousePressed(pauseButtonIsPressed);

  // createButton('SpeedistanceUp')
  //   .style('font-size', '16px')
  //   .style('padding', '10px')
  //   .mousePressed(speedUpButtonIsPressed);

  // createButton('Slow Down')
  //   .style('font-size', '16px')
  //   .style('padding', '10px')
  //   .mousePressed(slowDownButtonIsPressed);

  // createButton('Export')
  //   .style('font-size', '16px')
  //   .style('padding', '10px')
  //   .mousePressed(exportButtonIsPressed);

  // createFileInput(importButtonIsPressed)
  //   .style('font-size', '14px')
  //   .style('padding', '8px');
}

function draw() {
  textToPrint = '';
  background(243, 156, 18);
  //
  simulation.update();
  simulation.display();
  //
  noStroke();
  fill(0);
  textSize(15);
  text(textToPrint, 5, 15);
}

function keyPressed() {
  switch (key) {
    case '+':
      handlePlusKey();
      break;

    case '-':
      handleMinusKey();
      break;

    case 's':
      camY--;
      break;

    case 'w':
      camY++;
      break;

    case 'a':
      camX++;
      break;

    case 'd':
      camX--;
      break;

    default:
      break;
  }
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

function handlePlusKey() {
  if (zoom + zoomStep <= 500) zoom += zoomStep;
}

function handleMinusKey() {
  if (zoom - zoomStep > 0) zoom -= zoomStep;
}

//- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- -//

function calculateAreaFromDiameter(diameter) {
  const radius = diameter / 2;
  const area = Math.PI * Math.pow(radius, 2);
  return area;
}

function calculateDiameterFromArea(area) {
  const radius = Math.sqrt(area / Math.PI);
  const diameter = radius * 2;
  return diameter;
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
    let life = [];
    // Only for testing purpose
    for (let i = 0; i < 100; i++) {
      life.push(new Particle({}));
    }
    // life.push(new Particle({ stroke: 5 }));
    // life.push(new Particle({ stroke: 45 }));
    return life;
  }

  constructor(entities) {
    // Map data
    this.width = width;
    this.height = height;
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
    for (let e of this.entities) {
      e.updateValues();
    }

    this.entities = this.entities.filter((e) => e.stroke > 0);
    printLine(`entities: ${this.entities.length}`);
  }

  display() {
    for (let e of this.entities) {
      e.display();
    }
    printLine(`Running: ${this.isRunning}`);
    printLine(`Zoom: ${zoom}%`);
  }

  switchPause() {
    this.isRunning = !this.isRunning;
  }

  changeTime(deltaTime) {}

  export() {}
}

//- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- -//

class Entity {
  constructor() {}
  update() {}
  updateValues() {}
  display() {}
}

class Particle extends Entity {
  static mapValue(input) {
    input = constrain(input, 0, 1);
    let output = map(1 - input, 0, 1, 0, 255);
    return round(output);
  }

  constructor({ x, y, velocityX, velocityY, density, stroke } = {}) {
    super();
    this.x = typeof x === 'number' ? constrain(x, 0, width) : random(width);
    this.y = typeof y === 'number' ? constrain(y, 0, height) : random(height);
    this.vX = typeof velocityX === 'number' ? velocityX : 0;
    this.vY = typeof velocityY === 'number' ? velocityY : 0;

    this.x += 0;
    this.y += 0;

    this.density = typeof density === 'number' ? density : random(1);
    this.stroke = typeof stroke === 'number' ? stroke : random(5, 35);

    this.color = color(Particle.mapValue(this.density));

    this.deltaArea = 0;
  }

  interact(other) {
    const G = 0.01;
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const area = calculateAreaFromDiameter(this.stroke);
    const radius = this.stroke / 2;

    const otherArea = calculateAreaFromDiameter(other.stroke);
    const otherRadius = other.stroke / 2;

    if (distance > 0) {
      let force = (G * otherArea) / (distance * distance);
      let fx = (force * dx) / distance;
      let fy = (force * dy) / distance;

      this.vX += fx;
      this.vY += fy;

      if (distance < radius + otherRadius) {
        if (distance < Math.abs(radius - otherRadius)) {
          if (radius > otherRadius) {
            this.deltaArea += otherArea;
          } else {
            this.deltaArea -= otherArea;
          }
        } else {
          const intersectionArea = calculateIntersectionArea(
            distance,
            radius,
            otherRadius
          );
          if (radius > otherRadius) {
            this.deltaArea += intersectionArea;
          } else {
            this.deltaArea -= intersectionArea;
          }
        }
      }
    }
  }

  update() {
    // Interactions
    for (let other of simulation.entities) {
      if (other !== this) {
        this.interact(other);
      }
    }
  }

  updateValues() {
    //
    if (this.deltaArea) {
      const area = calculateAreaFromDiameter(this.stroke) + this.deltaArea;
      this.stroke = calculateDiameterFromArea(area);
      this.deltaArea = 0;
    }

    // Out of borders
    // if ((this.x <= 0 && this.vX < 0) || (this.x >= width && this.vX > 0)) {
    //   this.vX *= -1;
    // } else if (
    //   (this.y <= 0 && this.vY < 0) ||
    //   (this.y >= height && this.vY > 0)
    // ) {
    //   this.vY *= -1;
    // }

    // if (this.x < 0) {
    //   this.x = 0;
    // } else if (this.x > width) {
    //   this.x = width;
    // }
    // if (this.y < 0) {
    //   this.y = 0;
    // } else if (this.y > height) {
    //   this.y = height;
    // }

    //
    // this.vX *= 0.99;
    // this.vY *= 0.99;

    //
    this.x += this.vX;
    this.y += this.vY;
  }

  display() {
    let x = this.x;
    let y = this.y;

    // x += camX;
    // y += camY;

    stroke(this.color);
    strokeWeight(camZoomTranslation(this.stroke));
    point(camZoomTranslation(x), camZoomTranslation(y));
  }
}

function camZoomTranslation(number) {
  let result = number;
  if (zoom > 0) {
    result *= zoom / 100;
  }
  return result;
}

function calculateIntersectionArea(centerDistance, radius1, radius2) {
  const term1 =
    radius1 *
    radius1 *
    Math.acos(
      (centerDistance * centerDistance +
        radius1 * radius1 -
        radius2 * radius2) /
        (2 * centerDistance * radius1)
    );
  const term2 =
    radius2 *
    radius2 *
    Math.acos(
      (centerDistance * centerDistance +
        radius2 * radius2 -
        radius1 * radius1) /
        (2 * centerDistance * radius2)
    );
  const term3 =
    0.5 *
    Math.sqrt(
      (-centerDistance + radius1 + radius2) *
        (centerDistance + radius1 - radius2) *
        (centerDistance - radius1 + radius2) *
        (centerDistance + radius1 + radius2)
    );

  const intersectionArea = term1 + term2 - term3;
  return intersectionArea;
}
