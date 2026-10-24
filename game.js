// Estados: INTRO, MENU, CONTROLS, DIFFICULTY, LEVELSELECT, PLAY, PAUSE, GAMEOVER, VICTORY
let gameState = "INTRO";
let introTimer = 0;

let score = 0;
let highScore = parseInt(localStorage.getItem("ciberqueso_highscore") || "0");
let lives = 3;
let currentDifficulty = "FACIL";
let currentLevel = 1;
const MAX_LEVEL = 8;

const HUD_H = 40;
let player;
let walls = [];
let cheeses = [];
let cats = [];
let traps = [];

let osc, env, bgmOsc;
let bgmStep = 0;
const bgmNotes = [130.81, 146.83, 164.81, 196.0, 164.81, 146.83];

function setup() {
  let canvas = createCanvas(560, 360);
  canvas.parent("game-container");
  noSmooth();
  textFont("Courier New");

  osc = new p5.Oscillator("square");
  env = new p5.Envelope();
  env.setADSR(0.005, 0.06, 0.1, 0.05);
  env.setRange(0.25, 0);
  osc.start();
  osc.amp(0);

  bgmOsc = new p5.Oscillator("triangle");
  bgmOsc.start();
  bgmOsc.amp(0);
}

function playSfx(freqStart, freqEnd, dur = 0.08) {
  if (typeof soundMuted !== "undefined" && soundMuted) return;
  osc.freq(freqStart);
  osc.freq(freqEnd, dur);
  env.play(osc);
}

function updateBGM() {
  if ((typeof soundMuted !== "undefined" && soundMuted) || gameState !== "PLAY") {
    bgmOsc.amp(0);
    return;
  }
  if (frameCount % 18 === 0) {
    let f = bgmNotes[bgmStep % bgmNotes.length];
    if (player && player.superTimer > 0) f *= 1.5;
    bgmOsc.freq(f);
    bgmOsc.amp(0.06, 0.02);
    bgmStep++;
  }
}

function draw() {
  background(11, 15, 25);
  updateBGM();

  if (gameState === "INTRO") {
    drawIntroBackground();
    drawIntro();
  } else if (gameState === "MENU") {
    drawIntroBackground();
    drawMenu();
  } else if (gameState === "CONTROLS") {
    drawIntroBackground();
    drawControls();
  } else if (gameState === "DIFFICULTY") {
    drawIntroBackground();
    drawDifficulty();
  } else if (gameState === "LEVELSELECT") {
    drawIntroBackground();
    drawLevelSelect();
  } else if (gameState === "PLAY") {
    drawGameBackground();
    updateGame();
    drawGame();
  } else if (gameState === "PAUSE") {
    drawGameBackground();
    drawGame();
    drawPause();
  } else if (gameState === "GAMEOVER" || gameState === "VICTORY") {
    drawIntroBackground();
    drawEndScreen();
  }

  stroke("#00ffcc55");
  noFill();
  rect(0, 0, width, height);
}

// 1. PANTALLA INTRO
function drawIntro() {
  introTimer++;
  fill("#00ffcc");
  noStroke();
  textAlign(CENTER, CENTER);

  textSize(28);
  text("CIBERQUESO", width / 2, 85);

  textSize(14);
  fill("#ffcc00");
  text("UNAHUR TIC 2026", width / 2, 125);

  fill("#ffffff");
  textSize(13);
  text("INTEGRANTES:", width / 2, 170);
  fill("#00ffcc");
  text("Perla Aguilera  |  Alejandro Zalazar", width / 2, 195);
  text("Agustín Otero   |  Melisa Bravo", width / 2, 218);

  if (floor(frameCount / 25) % 2 === 0) {
    fill("#ff0055");
    textSize(12);
    text("[ PRESIONÁ ENTER O CLIC PARA CONTINUAR ]", width / 2, 295);
  }

  if (introTimer > 300) gameState = "MENU";
}

// 2. MENÚ PRINCIPAL
function drawMenu() {
  textAlign(CENTER, CENTER);
  noStroke();
  fill("#00ffcc");
  textSize(26);
  text("CIBERQUESO", width / 2, 45);

  fill("#ffcc00");
  textSize(13);
  text("PUNTAJE MÁXIMO: " + highScore, width / 2, 80);

  drawCanvasButton("1. JUGAR", width / 2 - 110, 105, 220, 34);
  drawCanvasButton("2. SELECCIÓN DE NIVEL", width / 2 - 110, 150, 220, 34);
  drawCanvasButton("3. CONTROLES", width / 2 - 110, 195, 220, 34);
  drawCanvasButton("4. CRÉDITOS / INTRO", width / 2 - 110, 240, 220, 34);
}

function drawControls() {
  textAlign(CENTER, CENTER);
  fill("#00ffcc");
  textSize(18);
  text("CONTROLES Y REGLAS", width / 2, 45);

  textAlign(LEFT, TOP);
  textSize(12);
  fill("#ffffff");
  let lines = [
    "- MOVIMIENTO: Flechas o WASD (Solo horizontal/vertical).",
    "- PAUSA: Tecla P o ESC.",
    "- QUESO ESTÁTICO: +10 pts.",
    "- QUESO MÓVIL (Naranja): +25 pts + Velocidad extra.",
    "- SUPERQUESO (Cian): +50 pts + Elimina gatos al tocarlos.",
    "- RATONERAS: Dejadas por gatos tramperos (-1 vida)."
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], 35, 85 + i * 26);
  }

  drawCanvasButton("VOLVER AL MENÚ [ESC]", width / 2 - 110, 295, 220, 34);
}

function drawDifficulty() {
  textAlign(CENTER, CENTER);
  fill("#00ffcc");
  textSize(20);
  text("SELECCIONAR DIFICULTAD", width / 2, 60);

  drawCanvasButton("1. FÁCIL (3 VIDAS)", width / 2 - 120, 115, 240, 38);
  drawCanvasButton("2. NORMAL (2 VIDAS)", width / 2 - 120, 170, 240, 38);
  drawCanvasButton("3. DIFÍCIL (1 VIDA)", width / 2 - 120, 225, 240, 38);
  drawCanvasButton("VOLVER", width / 2 - 70, 290, 140, 32);
}

// PANTALLA DE SELECCIÓN DE NIVEL
function drawLevelSelect() {
  textAlign(CENTER, CENTER);
  fill("#00ffcc");
  textSize(18);
  text("SELECCIONAR NIVEL (1-8)", width / 2, 40);

  let btnW = 110;
  let btnH = 34;
  let startX = width / 2 - 120;
  let startY = 85;

  for (let i = 1; i <= MAX_LEVEL; i++) {
    let col = (i - 1) % 2;
    let row = floor((i - 1) / 2);
    let bx = startX + col * 135;
    let by = startY + row * 46;
    drawCanvasButton("NIVEL " + i, bx, by, btnW, btnH);
  }

  drawCanvasButton("VOLVER", width / 2 - 70, 305, 140, 30);
}

function startLevelGame(lvl) {
  currentLevel = lvl;
  lives = currentDifficulty === "FACIL" ? 3 : currentDifficulty === "NORMAL" ? 2 : 1;
  score = 0;
  setupLevel(currentLevel);
  gameState = "PLAY";
}

function startGame(diff) {
  currentDifficulty = diff;
  lives = diff === "FACIL" ? 3 : diff === "NORMAL" ? 2 : 1;
  score = 0;
  currentLevel = 1;
  setupLevel(currentLevel);
  gameState = "PLAY";
}

function resetPlayerPos() {
  player = {
    x: 24,
    y: HUD_H + 24,
    size: 20,
    baseSpeed: 2.5,
    dir: "RIGHT",
    superTimer: 0,
    speedTimer: 0,
    invulnTimer: 90
  };
}

function setupLevel(lvl) {
  walls = [];
  cheeses = [];
  cats = [];
  traps = [];
  resetPlayerPos();

  if (lvl === 2) {
    walls.push({ x: 180, y: HUD_H + 60, w: 200, h: 16 });
    walls.push({ x: 180, y: HUD_H + 240, w: 200, h: 16 });
  } else if (lvl === 3 || lvl === 4) {
    walls.push({ x: 140, y: HUD_H + 50, w: 16, h: 180 });
    walls.push({ x: 400, y: HUD_H + 90, w: 16, h: 180 });
    walls.push({ x: 240, y: HUD_H + 150, w: 100, h: 16 });
  } else if (lvl === 5 || lvl === 6) {
    walls.push({ x: 120, y: HUD_H + 50, w: 140, h: 16 });
    walls.push({ x: 300, y: HUD_H + 50, w: 140, h: 16 });
    walls.push({ x: 120, y: HUD_H + 250, w: 140, h: 16 });
    walls.push({ x: 300, y: HUD_H + 250, w: 140, h: 16 });
    walls.push({ x: 272, y: HUD_H + 110, w: 16, h: 100 });
  } else if (lvl >= 7) {
    walls.push({ x: 110, y: HUD_H + 45, w: 16, h: 100 });
    walls.push({ x: 110, y: HUD_H + 185, w: 16, h: 100 });
    walls.push({ x: 430, y: HUD_H + 45, w: 16, h: 100 });
    walls.push({ x: 430, y: HUD_H + 185, w: 16, h: 100 });
    walls.push({ x: 200, y: HUD_H + 95, w: 160, h: 16 });
    walls.push({ x: 200, y: HUD_H + 215, w: 160, h: 16 });
  }

  let staticCount = 5 + lvl;
  let mobileCount = lvl === 2 || lvl === 4 || lvl >= 7 ? 2 : 0;
  let superCount = lvl === 6 || lvl === 8 ? 2 : 0;

  for (let i = 0; i < staticCount; i++) spawnCheese("normal");
  for (let i = 0; i < mobileCount; i++) spawnCheese("mobile");
  for (let i = 0; i < superCount; i++) spawnCheese("super");

  if (lvl === 3 || lvl === 4) {
    cats.push(
      createCat(
        180,
        HUD_H + 40,
        "patrol",
        [
          { x: 180, y: HUD_H + 40 },
          { x: 360, y: HUD_H + 40 },
          { x: 360, y: HUD_H + 110 },
          { x: 180, y: HUD_H + 110 },
          { x: 180, y: HUD_H + 240 },
          { x: 360, y: HUD_H + 240 },
          { x: 360, y: HUD_H + 180 },
          { x: 180, y: HUD_H + 180 }
        ],
        1.7
      )
    );
  } else if (lvl === 5) {
    cats.push(createCat(490, HUD_H + 250, "chase", [], 1.5));
  } else if (lvl === 6) {
    cats.push(createCat(490, HUD_H + 250, "chase", [], 1.65));
    cats.push(
      createCat(
        480,
        HUD_H + 15,
        "patrol",
        [
          { x: 480, y: HUD_H + 15 },
          { x: 80, y: HUD_H + 15 },
          { x: 80, y: HUD_H + 80 },
          { x: 480, y: HUD_H + 80 }
        ],
        1.7
      )
    );
  } else if (lvl === 7) {
    cats.push(createCat(480, HUD_H + 150, "trapper", [], 1.65));
    cats.push(
      createCat(
        150,
        HUD_H + 40,
        "patrol",
        [
          { x: 150, y: HUD_H + 40 },
          { x: 390, y: HUD_H + 40 },
          { x: 390, y: HUD_H + 145 },
          { x: 150, y: HUD_H + 145 },
          { x: 150, y: HUD_H + 255 },
          { x: 390, y: HUD_H + 255 },
          { x: 390, y: HUD_H + 145 },
          { x: 150, y: HUD_H + 145 }
        ],
        1.75
      )
    );
  } else if (lvl === 8) {
    cats.push(createCat(490, HUD_H + 40, "trapper", [], 1.8));
    cats.push(createCat(490, HUD_H + 260, "chase", [], 1.75));
    cats.push(
      createCat(
        150,
        HUD_H + 145,
        "patrol",
        [
          { x: 150, y: HUD_H + 145 },
          { x: 390, y: HUD_H + 145 }
        ],
        2.0
      )
    );
  }
}

function createCat(x, y, mode, waypoints, speed) {
  return {
    x,
    y,
    spawnX: x,
    spawnY: y,
    size: 28,
    mode,
    waypoints,
    wpIndex: 0,
    speed,
    facingRight: false,
    deadTimer: 0,
    trapCooldown: 180
  };
}

function spawnCheese(type) {
  let size = 16;
  let cx, cy, valid;
  let attempts = 0;
  do {
    valid = true;
    cx = floor(random(20, width - 36));
    cy = floor(random(HUD_H + 20, height - 36));
    for (let w of walls) {
      if (rectOverlap(cx, cy, size, size, w.x, w.y, w.w, w.h)) valid = false;
    }
    if (dist(cx, cy, 24, HUD_H + 24) < 70) valid = false;
    attempts++;
  } while (!valid && attempts < 200);

  let dirs = [
    { vx: 1.5, vy: 0 },
    { vx: -1.5, vy: 0 },
    { vx: 0, vy: 1.5 },
    { vx: 0, vy: -1.5 }
  ];
  let d = random(dirs);

  cheeses.push({
    x: cx,
    y: cy,
    size,
    type,
    vx: type === "mobile" ? d.vx : 0,
    vy: type === "mobile" ? d.vy : 0
  });
}

function rectOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

function canMoveTo(nx, ny, size) {
  if (nx < 6 || nx + size > width - 6 || ny < HUD_H + 6 || ny + size > height - 6) {
    return false;
  }
  for (let w of walls) {
    if (rectOverlap(nx, ny, size, size, w.x, w.y, w.w, w.h)) return false;
  }
  return true;
}

function updateGame() {
  if (player.superTimer > 0) player.superTimer--;
  if (player.speedTimer > 0) player.speedTimer--;
  if (player.invulnTimer > 0) player.invulnTimer--;

  let currentSpeed = player.baseSpeed + (player.speedTimer > 0 ? 1.2 : 0);
  let dx = 0,
    dy = 0;

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    dx = -currentSpeed;
    player.dir = "LEFT";
  } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    dx = currentSpeed;
    player.dir = "RIGHT";
  } else if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    dy = -currentSpeed;
    player.dir = "UP";
  } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    dy = currentSpeed;
    player.dir = "DOWN";
  }

  if (dx !== 0 && canMoveTo(player.x + dx, player.y, player.size)) {
    player.x += dx;
  } else if (dy !== 0 && canMoveTo(player.x, player.y + dy, player.size)) {
    player.y += dy;
  }

  for (let i = cheeses.length - 1; i >= 0; i--) {
    let c = cheeses[i];
    if (c.type === "mobile") {
      if (canMoveTo(c.x + c.vx, c.y + c.vy, c.size)) {
        c.x += c.vx;
        c.y += c.vy;
      } else {
        let dirs = [
          { vx: 1.5, vy: 0 },
          { vx: -1.5, vy: 0 },
          { vx: 0, vy: 1.5 },
          { vx: 0, vy: -1.5 }
        ];
        let d = random(dirs);
        c.vx = d.vx;
        c.vy = d.vy;
      }
    }

    if (rectOverlap(player.x, player.y, player.size, player.size, c.x, c.y, c.size, c.size)) {
      if (c.type === "normal") {
        score += 10;
        playSfx(600, 850, 0.07);
      } else if (c.type === "mobile") {
        score += 25;
        player.speedTimer = 240;
        playSfx(700, 1100, 0.1);
      } else if (c.type === "super") {
        score += 50;
        player.superTimer = 360;
        playSfx(500, 1200, 0.15);
      }
      cheeses.splice(i, 1);
    }
  }

  for (let i = traps.length - 1; i >= 0; i--) {
    traps[i].ttl--;
    if (traps[i].ttl <= 0) {
      traps.splice(i, 1);
      continue;
    }
    if (
      player.invulnTimer <= 0 &&
      player.superTimer <= 0 &&
      rectOverlap(player.x, player.y, player.size, player.size, traps[i].x, traps[i].y, traps[i].size, traps[i].size)
    ) {
      traps.splice(i, 1);
      handlePlayerHit();
      return;
    }
  }

  for (let cat of cats) {
    if (cat.deadTimer > 0) {
      cat.deadTimer--;
      if (cat.deadTimer === 0) {
        cat.x = cat.spawnX;
        cat.y = cat.spawnY;
        cat.wpIndex = 0;
      }
      continue;
    }

    if (cat.mode === "patrol" && cat.waypoints.length > 0) {
      let wp = cat.waypoints[cat.wpIndex];
      let diffX = wp.x - cat.x;
      let diffY = wp.y - cat.y;
      let moved = false;

      if (abs(diffX) > 0) {
        let stepX = constrain(diffX, -cat.speed, cat.speed);
        if (canMoveTo(cat.x + stepX, cat.y, cat.size)) {
          cat.x += stepX;
          cat.facingRight = stepX < 0;
          moved = true;
        }
      } else if (abs(diffY) > 0) {
        let stepY = constrain(diffY, -cat.speed, cat.speed);
        if (canMoveTo(cat.x, cat.y + stepY, cat.size)) {
          cat.y += stepY;
          moved = true;
        }
      }

      if (dist(cat.x, cat.y, wp.x, wp.y) < 2 || !moved) {
        cat.wpIndex = (cat.wpIndex + 1) % cat.waypoints.length;
      }
    } else {
      let diffX = player.x - cat.x;
      let diffY = player.y - cat.y;
      let stepX = 0,
        stepY = 0;

      if (abs(diffX) > abs(diffY)) {
        stepX = diffX > 0 ? cat.speed : -cat.speed;
        if (!canMoveTo(cat.x + stepX, cat.y, cat.size)) {
          stepX = 0;
          stepY = diffY > 0 ? cat.speed : -cat.speed;
        }
      } else {
        stepY = diffY > 0 ? cat.speed : -cat.speed;
        if (!canMoveTo(cat.x, cat.y + stepY, cat.size)) {
          stepY = 0;
          stepX = diffX > 0 ? cat.speed : -cat.speed;
        }
      }

      if (canMoveTo(cat.x + stepX, cat.y + stepY, cat.size)) {
        cat.x += stepX;
        cat.y += stepY;
      }
      if (stepX !== 0) cat.facingRight = stepX < 0;
    }

    if (cat.mode === "trapper") {
      cat.trapCooldown--;
      if (cat.trapCooldown <= 0 && traps.length < 5) {
        traps.push({ x: cat.x + 4, y: cat.y + 4, size: 18, ttl: 420, maxTtl: 420 });
        cat.trapCooldown = 210;
      }
    }

    let hitPad = 4;
    if (
      rectOverlap(
        player.x + 2,
        player.y + 2,
        player.size - 4,
        player.size - 4,
        cat.x + hitPad,
        cat.y + hitPad,
        cat.size - hitPad * 2,
        cat.size - hitPad * 2
      )
    ) {
      if (player.superTimer > 0) {
        cat.deadTimer = 240;
        score += 100;
        playSfx(900, 300, 0.15);
      } else if (player.invulnTimer <= 0) {
        handlePlayerHit();
        return;
      }
    }
  }

  if (cheeses.length === 0) {
    playSfx(500, 1000, 0.2);
    if (currentLevel < MAX_LEVEL) {
      currentLevel++;
      setupLevel(currentLevel);
    } else {
      saveHighScore();
      gameState = "VICTORY";
    }
  }
}

function handlePlayerHit() {
  lives--;
  if (typeof soundCat !== "undefined" && soundCat && !soundMuted) {
    soundCat.currentTime = 0;
    soundCat.play().catch(() => {});
  } else {
    playSfx(300, 120, 0.2);
  }

  if (lives <= 0) {
    saveHighScore();
    gameState = "GAMEOVER";
  } else {
    resetPlayerPos();
  }
}

function saveHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("ciberqueso_highscore", highScore);
  }
}

function drawGame() {
  fill("#111b2b");
  stroke("#00ffcc55");
  rect(0, 0, width, HUD_H);

  noStroke();
  fill("#00ffcc");
  textAlign(LEFT, CENTER);
  textSize(13);
  text("NIVEL: " + currentLevel + "/" + MAX_LEVEL, 12, HUD_H / 2);
  text("PUNTAJE: " + score, 115, HUD_H / 2);
  text("VIDAS: " + "❤".repeat(max(0, lives)), 260, HUD_H / 2);

  if (player.superTimer > 0) {
    fill("#00ffcc");
    text("SUPER: " + ceil(player.superTimer / 60) + "s", 380, HUD_H / 2);
  } else if (player.speedTimer > 0) {
    fill("#ff9900");
    text("VELOZ: " + ceil(player.speedTimer / 60) + "s", 380, HUD_H / 2);
  }

  drawCanvasButton("PAUSA [P]", width - 85, 7, 75, 26);

  fill(22, 40, 54, 215);
  stroke("#00ffcc");
  strokeWeight(1);
  for (let w of walls) {
    rect(w.x, w.y, w.w, w.h);
  }

  for (let t of traps) {
    drawTrapSprite(t.x, t.y, t.size, t.ttl, t.maxTtl);
  }

  for (let c of cheeses) {
    drawCheeseSprite(c.x, c.y, c.size, c.type);
  }

  for (let cat of cats) {
    if (cat.deadTimer <= 0) {
      drawCatSprite(cat.x, cat.y, cat.size, true, cat.facingRight, cat.mode);
    }
  }

  if (player.invulnTimer % 6 < 4) {
    drawMouseSprite(
      player.x,
      player.y,
      player.size,
      player.dir,
      player.superTimer > 0,
      player.speedTimer > 0
    );
  }
}

function drawPause() {
  fill(11, 15, 25, 210);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  fill("#00ffcc");
  textSize(22);
  text("JUEGO EN PAUSA", width / 2, 110);

  drawCanvasButton("1. REANUDAR", width / 2 - 115, 165, 230, 38);
  drawCanvasButton("2. MENÚ PRINCIPAL", width / 2 - 115, 220, 230, 38);
}

// 4. PANTALLA DE TERMINACIÓN
function drawEndScreen() {
  textAlign(CENTER, CENTER);
  noStroke();

  if (gameState === "VICTORY") {
    fill("#00ffcc");
    textSize(24);
    text("¡VICTORIA CIBERQUESO!", width / 2, 75);
  } else {
    fill("#ff0055");
    textSize(24);
    text("FIN DEL JUEGO", width / 2, 75);
  }

  fill("#ffffff");
  textSize(15);
  text("PUNTAJE OBTENIDO: " + score, width / 2, 130);
  fill("#ffcc00");
  text("PUNTAJE MÁXIMO: " + highScore, width / 2, 160);

  drawCanvasButton("1. VOLVER A JUGAR", width / 2 - 115, 210, 230, 38);
  drawCanvasButton("2. MENÚ PRINCIPAL", width / 2 - 115, 265, 230, 38);
}

function drawCanvasButton(label, x, y, w, h) {
  let hover = mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
  stroke("#00ffcc");
  strokeWeight(1);
  fill(hover ? "#00ffcc" : "#111b2b");
  rect(x, y, w, h);

  noStroke();
  fill(hover ? "#0b0f19" : "#00ffcc");
  textAlign(CENTER, CENTER);
  textSize(12);
  text(label, x + w / 2, y + h / 2);
}

function insideButton(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}

function mousePressed() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }

  if (gameState === "INTRO") {
    gameState = "MENU";
  } else if (gameState === "MENU") {
    if (insideButton(width / 2 - 110, 105, 220, 34)) gameState = "DIFFICULTY";
    else if (insideButton(width / 2 - 110, 150, 220, 34)) gameState = "LEVELSELECT";
    else if (insideButton(width / 2 - 110, 195, 220, 34)) gameState = "CONTROLS";
    else if (insideButton(width / 2 - 110, 240, 220, 34)) {
      introTimer = 0;
      gameState = "INTRO";
    }
  } else if (gameState === "CONTROLS") {
    if (insideButton(width / 2 - 110, 295, 220, 34)) gameState = "MENU";
  } else if (gameState === "DIFFICULTY") {
    if (insideButton(width / 2 - 120, 115, 240, 38)) startGame("FACIL");
    else if (insideButton(width / 2 - 120, 170, 240, 38)) startGame("NORMAL");
    else if (insideButton(width / 2 - 120, 225, 240, 38)) startGame("DIFICIL");
    else if (insideButton(width / 2 - 70, 290, 140, 30)) gameState = "MENU";
  } else if (gameState === "LEVELSELECT") {
    let btnW = 110, btnH = 34;
    let startX = width / 2 - 120;
    let startY = 85;
    let selected = false;
    for (let i = 1; i <= MAX_LEVEL; i++) {
      let col = (i - 1) % 2;
      let row = floor((i - 1) / 2);
      let bx = startX + col * 135;
      let by = startY + row * 46;
      if (insideButton(bx, by, btnW, btnH)) {
        startLevelGame(i);
        selected = true;
        break;
      }
    }
    if (!selected && insideButton(width / 2 - 70, 305, 140, 30)) {
      gameState = "MENU";
    }
  } else if (gameState === "PLAY") {
    if (insideButton(width - 85, 7, 75, 26)) gameState = "PAUSE";
  } else if (gameState === "PAUSE") {
    if (insideButton(width / 2 - 115, 165, 230, 38)) gameState = "PLAY";
    else if (insideButton(width / 2 - 115, 220, 230, 38)) gameState = "MENU";
  } else if (gameState === "GAMEOVER" || gameState === "VICTORY") {
    if (insideButton(width / 2 - 115, 210, 230, 38)) startGame(currentDifficulty);
    else if (insideButton(width / 2 - 115, 265, 230, 38)) gameState = "MENU";
  }
}

function keyPressed() {
  if (gameState === "INTRO" && keyCode === ENTER) {
    gameState = "MENU";
  } else if (gameState === "MENU") {
    if (key === "1") gameState = "DIFFICULTY";
    if (key === "2") gameState = "LEVELSELECT";
    if (key === "3") gameState = "CONTROLS";
    if (key === "4") {
      introTimer = 0;
      gameState = "INTRO";
    }
  } else if (gameState === "CONTROLS" && keyCode === ESCAPE) {
    gameState = "MENU";
  } else if (gameState === "DIFFICULTY") {
    if (key === "1") startGame("FACIL");
    if (key === "2") startGame("NORMAL");
    if (key === "3") startGame("DIFICIL");
    if (keyCode === ESCAPE) gameState = "MENU";
  } else if (gameState === "LEVELSELECT") {
    if (keyCode === ESCAPE) gameState = "MENU";
  } else if (gameState === "PLAY") {
    if (key === "p" || key === "P" || keyCode === ESCAPE) {
      gameState = "PAUSE";
    }
  } else if (gameState === "PAUSE") {
    if (key === "p" || key === "P" || key === "1" || keyCode === ESCAPE) {
      gameState = "PLAY";
    } else if (key === "2") {
      gameState = "MENU";
    }
  } else if (gameState === "GAMEOVER" || gameState === "VICTORY") {
    if (key === "1" || keyCode === ENTER) startGame(currentDifficulty);
    if (key === "2" || keyCode === ESCAPE) gameState = "MENU";
  }
}