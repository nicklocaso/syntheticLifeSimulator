'use strict';

// Globals
let simulation;
let textToPrint;

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

  // createButton('Speed Up')
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
    let life = [];
    // Only for testing purpose
    for (let i = 0; i < 50; i++) {
      life.push(new Particle({}));
    }
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

    this.density = typeof density === 'number' ? density : random(1);
    this.stroke = typeof stroke === 'number' ? stroke : random(5, 10);

    this.color = color(Particle.mapValue(this.density));

    this.deltaStroke = 0;
  }

  interact(other) {
    let G = 0.1;

    let dx = other.x - this.x;
    let dy = other.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      let force = (G * other.stroke) / (distance * distance); // F = (G * m1 * m2) / d^2
      let fx = (force * dx) / distance;
      let fy = (force * dy) / distance;

      this.vX += fx;
      this.vY += fy;

      const R1 = this.stroke / 2;
      const R2 = other.stroke / 2;

      if (distance < R1 + R2) {
        // let alpha =
        //   Math.acos(
        //     (R1 * R1 + distance * distance - R2 * R2) / (2 * R1 * distance)
        //   ) * 2;
        // let beta =
        //   Math.acos(
        //     (R2 * R2 + distance * distance - R1 * R1) / (2 * R2 * distance)
        //   ) * 2;
        // let a1 = 0.5 * beta * R2 * R2 - 0.5 * R2 * R2 * Math.sin(beta);
        // let a2 = 0.5 * alpha * R1 * R1 - 0.5 * R1 * R1 * Math.sin(alpha);
        // const newArea = Math.PI * Math.pow(R1, 2) + Math.floor(a1 + a2);

        const result = combinedRadius(R1, R2);

        if (R1 > R2) {
          this.deltaStroke += result * 2;
        } else {
          this.deltaStroke -= result * 2;
        }
      }
    }

    function combinedRadius(radius1, radius2) {
      const area1 = Math.PI * Math.pow(radius1, 2);
      const area2 = Math.PI * Math.pow(radius2, 2);

      const combinedArea = area1 + area2;
      const combinedRadius = Math.sqrt(combinedArea / Math.PI);

      return combinedRadius;
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
    if (this.deltaStroke) {
      this.stroke = this.deltaStroke;
      this.deltaStroke = 0;
    }

    // Out of borders
    if ((this.x <= 0 && this.vX < 0) || (this.x >= width && this.vX > 0)) {
      this.vX *= -1;
    } else if (
      (this.y <= 0 && this.vY < 0) ||
      (this.y >= height && this.vY > 0)
    ) {
      this.vY *= -1;
    }

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > width) {
      this.x = width;
    }
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > height) {
      this.y = height;
    }

    //
    // this.vX *= 0.99;
    // this.vY *= 0.99;

    //
    this.x += this.vX;
    this.y += this.vY;
  }

  display() {
    stroke(this.color);
    strokeWeight(this.stroke);
    point(this.x, this.y);
  }
}
