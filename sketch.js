// Simulation
let simulationTime = 0;
let simulationSpeed = 1;
let isRunning = false;
let startPause = 0;
let pauseLength = 0;
let organisms = [];

// Globals

// P5.js framework functions

function setup() {
  const simulation = new Simulation(800, 600);

  createCanvas(simulation.width, simulation.height);

  // Add buttons to control the simulation
  createButton('Pause/Resume')
    .style('font-size', '16px')
    .style('padding', '10px')
    .mousePressed(pauseSimulation);

  // createButton('Speed Up')
  //   .style('font-size', '16px')
  //   .style('padding', '10px')
  //   .mousePressed(speedUpSimulation);

  // createButton('Slow Down')
  //   .style('font-size', '16px')
  //   .style('padding', '10px')
  //   .mousePressed(slowDownSimulation);

  createButton('Export')
    .style('font-size', '16px')
    .style('padding', '10px')
    .mousePressed(exportOrganisms);

  // Create file input button for importing organism positions
  inputbtn = createFileInput(handleFile)
    .style('font-size', '14px')
    .style('padding', '8px');
}

function draw() {
  background(220);

  // Calculate elapsed time regardless of visualization speed
  let deltaTime = isRunning ? millis() * simulationSpeed : 0;

  // Update and display each organism with the calculated time
  for (let organism of organisms) {
    organism.tick();
    organism.display();
  }

  displayisRunning();

  // Display the simulation speed value
  displaySimulationSpeed();
}

// Handlers

function pauseResumeButtonIsPressed() {}
// function speedUpButtonIsPressed() {}
// function speedDownButtonIsPressed() {}
function ExportButtonIsPressed() {}
function ImportButtonIsPressed() {}

//

function displayisRunning() {
  fill(0);
  textSize(16);
  text(`pauseLength: ${pauseLength}`, 20, height - 100);
  if (!isRunning) text(`Paused`, 20, height - 40);
}

function displaySimulationSpeed() {
  fill(0);
  textSize(16);
  text(`Simulation Speed: ${nf(simulationSpeed, 1, 2)}`, 20, height - 20);
  text(`mills: ${millis()}`, 20, height - 80);
}

function exportOrganisms() {
  // Create an array of strings containing organism positions
  let organismPositions = organisms.map((organism) => organism.toString());

  // Save the strings to a text file
  saveStrings(organismPositions, 'organism_positions.txt');
}

function handleFile(file) {
  // Split the file data into lines
  data = split(file.data, '\n');

  // Restore organism positions based on the loaded strings
  organisms = data
    .filter((line) => line.trim() !== '') // Exclude empty lines
    .map((line) => {
      let values = split(line, ',');

      return new Organism(
        float(values[0]),
        float(values[1]),
        float(values[2]),
        float(values[3])
      );
    })
    .filter((org) => org !== undefined); // Exclude undefined values

  inputbtn.value('');
}

//- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- -//

class Simulation {
  static generateOrganisms() {
    let orgs = [];
    for (let i = 0; i < 50; i++) {
      orgs.push(new Organism(random(width), random(height)));
    }
    return orgs;
  }

  constructor(simulationWidth, simulationHeight, organisms) {
    // Map data
    this.width = simulationWidth;
    this.height = simulationHeight;
    // TODO: add map obstacles
    // Entities data
    this.organisms =
      organisms && Array.isArray(organisms) && organisms.length > 0
        ? organisms
        : Simulation.generateOrganisms();
  }
}

//- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- -//

class Entity {
  constructor(x, y, velocityX, velocityY) {
    this.x = typeof x === 'number' ? constrain(x, 0, width) : random(width);
    this.y = typeof y === 'number' ? constrain(y, 0, height) : random(height);
    this.velocityX = typeof velocityX === 'number' ? velocityX : random(-2, 2);
    this.velocityY = typeof velocityY === 'number' ? velocityY : random(-2, 2);

    this.lastUpdateTime = millis();
  }

  tick() {
    if (!isRunning) return;

    // Calcola il tempo trascorso dall'ultimo aggiornamento
    let currentTime = millis();
    let deltaTime = (currentTime - this.lastUpdateTime) * 0.001;

    // Implementa la logica di aggiornamento degli organismi qui
    this.update(deltaTime);

    // Aggiorna il tempo dell'ultimo aggiornamento
    this.lastUpdateTime = currentTime;
  }

  update(deltaTime) {
    // Implementa la logica per la collisione ai bordi del canvas
    const radius = 10; // Raggio dell'organismo (metà del diametro)

    // Verifica la collisione con i bordi orizzontali
    if (this.x - radius < 0 || this.x + radius > width) {
      this.velocityX *= -1; // Inverti la direzione orizzontale
    }

    // Verifica la collisione con i bordi verticali
    if (this.y - radius < 0 || this.y + radius > height) {
      this.velocityY *= -1; // Inverti la direzione verticale
    }

    // Aggiorna la posizione basata sulla velocità
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
  }

  display() {
    // Draw the organism on the canvas
    fill(0, 255, 0);
    ellipse(this.x, this.y, 20, 20);
  }

  toString() {
    return `${this.x},${this.y},${this.velocityX},${this.velocityY}`;
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
