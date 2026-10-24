let catX = 50,
  catY = 160;
let laserX = 420,
  laserY = 160;
let score = 0;
const SPEED = 4;
let isMoving = false;
let facingRight = false;

// Variables para el sonido sintetizado
let osc, env;

function setup() {
  let canvas = createCanvas(560, 320);
  canvas.parent("game-container");
  noSmooth();

  // Configurar el sintetizador de sonido (Onda Sinusoidal)
  osc = new p5.Oscillator("sine");
  env = new p5.Envelope();

  // Tiempos del sonido: ataque rápido, decaimiento corto (estilo blip arcade)
  env.setADSR(0.01, 0.08, 0.1, 0.05);
  env.setRange(0.4, 0); // Volumen de salida (máx 0.4 para no ensordecer)

  osc.start();
  osc.amp(0); // Empezar en silencio
}

// Función para reproducir el efecto de sonido "Caza Láser"
function playCatchSound() {
  // Nota aguda aleatoria para que cada captura suene divertida (tipo Pop Cat)
  let freq = random(600, 900);
  osc.freq(freq);
  env.play(osc);
}

function draw() {
  background(11, 15, 25);
  drawBackgroundGrid();

  // Marco estilo terminal
  stroke("#00ffcc55");
  noFill();
  rect(0, 0, width, height);

  // Detectar movimiento por teclado
  isMoving = false;
  if (keyIsDown(LEFT_ARROW)) {
    catX -= SPEED;
    isMoving = true;
    facingRight = true;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    catX += SPEED;
    isMoving = true;
    facingRight = false;
  }
  if (keyIsDown(UP_ARROW)) {
    catY -= SPEED;
    isMoving = true;
  }
  if (keyIsDown(DOWN_ARROW)) {
    catY += SPEED;
    isMoving = true;
  }

  // Límites de pantalla
  catX = constrain(catX, 10, width - 70);
  catY = constrain(catY, 10, height - 70);

  // Dibujar elementos en pantalla
  drawLaserPixel(laserX, laserY);
  drawCatPixel(catX, catY, isMoving, facingRight);

  // Colisión: ¿El michi cazó el láser?
  let d = dist(catX + 30, catY + 30, laserX + 12, laserY + 12);
  if (d < 30) {
    score++;

    // Reproducir el MP3 nativo sin errores de AudioContext
    soundCat.currentTime = 0; // Reinicia el audio por si vuelve a tocar rápido
    soundCat
      .play()
      .catch((e) => console.log("Audio bloqueado hasta interactuar"));

    // Asegurar que el láser aparezca lejos del gato
    do {
      laserX = floor(random(40, width - 60));
      laserY = floor(random(40, height - 60));
    } while (dist(catX, catY, laserX, laserY) < 120);
  }

  // Marcador en pantalla
  noStroke();
  fill("#00ffcc");
  textFont("Courier New");
  textSize(13);
  text("AGILIDAD_FELINA: " + score, 15, 22);
}

// Requisito de los navegadores: Activar audio tras el primer clic del usuario
function mousePressed() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
}
