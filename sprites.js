let imgClosed, imgOpen, soundCat;
let bgIntro, bgGame;

function preload() {
  imgClosed = loadImage(BOCA_CERRADA_B64);
  imgOpen = loadImage(BOCA_ABIERTA_B64);
  soundCat = new Audio(MAULLIDO_B64);

  if (typeof BG_INTRO_B64 !== "undefined" && BG_INTRO_B64.length > 30) {
    bgIntro = loadImage(BG_INTRO_B64);
  }
  if (typeof BG_GAME_B64 !== "undefined" && BG_GAME_B64.length > 30) {
    bgGame = loadImage(BG_GAME_B64);
  }
}

function drawIntroBackground() {
  if (bgIntro && bgIntro.width > 1) {
    image(bgIntro, 0, 0, width, height);
    noStroke();
    fill(11, 15, 25, 165);
    rect(0, 0, width, height);
  } else {
    drawBackgroundGrid();
  }
}

function drawGameBackground() {
  if (bgGame && bgGame.width > 1) {
    image(bgGame, 0, 40, width, height - 40);
    noStroke();
    fill(11, 15, 25, 115);
    rect(0, 40, width, height - 40);
  } else {
    drawBackgroundGrid();
  }
}

function drawCatSprite(x, y, size, isMoving, facingRight, mode) {
  push();
  translate(x, y);

  if (facingRight) {
    scale(-1, 1);
    translate(-size, 0);
  }

  if (mode === "chase") tint(255, 120, 120);
  else if (mode === "trapper") tint(220, 120, 255);
  else noTint();

  let currentImg = imgClosed;
  if (isMoving && floor(frameCount / 6) % 2 === 0) {
    currentImg = imgOpen;
  }

  image(currentImg, 0, 0, size, size);
  noTint();
  pop();
}

function drawMouseSprite(x, y, size, dir, superActive, speedActive) {
  push();
  translate(x + size / 2, y + size / 2);

  if (dir === "RIGHT") rotate(0);
  else if (dir === "LEFT") rotate(PI);
  else if (dir === "UP") rotate(-HALF_PI);
  else if (dir === "DOWN") rotate(HALF_PI);

  if (superActive) {
    fill(0, 255, 204, 70 + sin(frameCount * 0.4) * 50);
    noStroke();
    ellipse(0, 0, size * 1.4, size * 1.4);
  } else if (speedActive) {
    fill(255, 180, 0, 60);
    noStroke();
    ellipse(0, 0, size * 1.25, size * 1.25);
  }

  stroke("#ff66aa");
  strokeWeight(2);
  noFill();
  line(-size * 0.35, 0, -size * 0.6, sin(frameCount * 0.3) * 3);

  noStroke();
  fill(superActive ? "#00ffcc" : "#b0bec5");
  ellipse(0, 0, size * 0.75, size * 0.55);

  fill("#78909c");
  ellipse(-2, -size * 0.25, size * 0.28, size * 0.28);
  ellipse(-2, size * 0.25, size * 0.28, size * 0.28);

  fill("#ff0055");
  ellipse(size * 0.35, 0, 4, 4);
  fill("#00ffcc");
  rect(2, -4, 3, 2);
  rect(2, 2, 3, 2);

  pop();
}

function drawCheeseSprite(x, y, size, type) {
  push();
  translate(x, y);
  noStroke();

  if (type === "super") {
    let pulse = 4 + sin(frameCount * 0.25) * 3;
    fill(0, 255, 204, 60);
    ellipse(size / 2, size / 2, size + pulse, size + pulse);
    fill(frameCount % 10 < 5 ? "#00ffcc" : "#ffffaa");
  } else if (type === "mobile") {
    fill("#ff9900");
  } else {
    fill("#ffd700");
  }

  triangle(2, size - 2, size / 2, 2, size - 2, size - 2);

  fill("#b8860b");
  ellipse(size * 0.45, size * 0.65, 3, 3);
  ellipse(size * 0.6, size * 0.8, 2.5, 2.5);
  pop();
}

function drawTrapSprite(x, y, size, ttl, maxTtl) {
  push();
  translate(x, y);
  let alpha = map(ttl, 0, maxTtl, 60, 255);

  stroke(255, 50, 50, alpha);
  strokeWeight(1.5);
  fill(90, 40, 20, alpha);
  rect(2, 4, size - 4, size - 8, 2);

  stroke(200, 200, 200, alpha);
  line(size / 2, 4, size / 2, size - 4);

  noStroke();
  fill(255, 0, 60, alpha);
  ellipse(size / 2, size / 2, 5, 5);
  pop();
}

function drawBackgroundGrid() {
  stroke(0, 255, 204, 15);
  strokeWeight(1);
  for (let x = 0; x < width; x += 20) line(x, 0, x, height);
  for (let y = 40; y < height; y += 20) line(0, y, width, y);
}