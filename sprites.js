let imgClosed, imgOpen;

// preload() carga los archivos de imagen antes de iniciar el juego
function preload() {
    imgClosed = loadImage(BOCA_CERRADA_B64);
    imgOpen   = loadImage(BOCA_ABIERTA_B64);
    soundCat = new Audio(MAULLIDO_B64);
}

// Dibujar al Pop Cat usando las imágenes de assets con animación de boca
function drawCatPixel(x, y, isMoving, facingRight) {
    push();
    translate(x, y);
    
    let w = 60; // Ancho de la imagen en pantalla
    let h = 60; // Alto de la imagen en pantalla

    // Soporte para espejar la imagen si camina hacia el otro lado
    if (facingRight) {
        scale(-1, 1);
        translate(-w, 0);
    }

    // Elegir qué imagen mostrar según si se está moviendo
    let currentImg = imgClosed;
    if (isMoving) {
        if (floor(frameCount / 6) % 2 === 0) {
            currentImg = imgOpen;
        } else {
            currentImg = imgClosed;
        }
    }

    // Dibujar la imagen en el canvas
    image(currentImg, 0, 0, w, h);
    pop();
}

// Matriz y funciones para el Puntero Láser (por código)
const SPRITE_LASER = [
    [0,0,3,3,3,3,0,0],
    [0,3,1,1,1,1,3,0],
    [3,1,1,2,2,1,1,3],
    [3,1,2,2,2,2,1,3],
    [3,1,2,2,2,2,1,3],
    [3,1,1,2,2,1,1,3],
    [0,3,1,1,1,1,3,0],
    [0,0,3,3,3,3,0,0]
];

function drawPixel(x, y, colorCode) {
    fill(colorCode);
    noStroke();
    rect(x * 3, y * 3, 3, 3);
}

// Dibuja el láser con rayo proyectado, destellos y auras de luz
function drawLaserPixel(x, y) {
    push();

    // 1. ORIGEN DEL LÁSER (Esquina superior derecha fuera de la pantalla)
    let originX = width + 20;
    let originY = -20;
    
    // Centro del impacto del láser
    let targetX = x + 12;
    let targetY = y + 12;

    // 2. RAYO / HAZ LUMINOSO PROYECTADO
    // Variación sutil de intensidad para simular el parpadeo del diodo
    let beamAlpha = map(sin(frameCount * 0.3), -1, 1, 70, 110);
    
    // Resplandor exterior del rayo (ancho y translúcido)
    stroke(255, 0, 85, beamAlpha * 0.4);
    strokeWeight(6);
    line(originX, originY, targetX, targetY);

    // Núcleo del rayo (fino y brillante)
    stroke(255, 200, 220, beamAlpha);
    strokeWeight(2);
    line(originX, originY, targetX, targetY);

    // 3. EFECTO DE IMPACTO EN EL SUELO (PUNTO Y AURAS)
    translate(x, y);

    // Aura exterior pulsante (Glow neón)
    let pulseSize = 26 + sin(frameCount * 0.2) * 6;
    noStroke();
    fill(255, 0, 85, 40);
    ellipse(12, 12, pulseSize * 1.5, pulseSize * 1.5);

    fill(255, 0, 85, 90);
    ellipse(12, 12, pulseSize, pulseSize);

    // Renderizado del punto píxel art central
    for (let row = 0; row < SPRITE_LASER.length; row++) {
        for (let col = 0; col < SPRITE_LASER[row].length; col++) {
            let val = SPRITE_LASER[row][col];
            if (val === 1) drawPixel(col, row, '#ff0055');
            if (val === 2) drawPixel(col, row, '#ffffff'); // Centro blanco encandilante
            if (val === 3) drawPixel(col, row, '#ff66aa');
        }
    }

    // 4. MICRO-PARTÍCULAS DE DESTELLO (Chispas alrededor del punto)
    for (let i = 0; i < 3; i++) {
        let angle = (frameCount * 0.1) + (i * TWO_PI / 3);
        let px = 12 + cos(angle) * 14;
        let py = 12 + sin(angle) * 14;
        fill(255, 150, 200, 180);
        rect(px, py, 2, 2);
    }

    pop();
}

// Fondo Grid Cyberpunk
function drawBackgroundGrid() {
    stroke(0, 255, 204, 15);
    strokeWeight(1);
    for (let x = 0; x < width; x += 16) line(x, 0, x, height);
    for (let y = 0; y < height; y += 16) line(0, y, width, y);
}