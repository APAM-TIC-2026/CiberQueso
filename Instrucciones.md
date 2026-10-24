# UNAHUR TIC 2026

## HACKATON PIA

### ¿Se puede programar un juego sin saber programar? (IA help me)

¿Alguna vez te preguntaste si realmente con IA se soluciona todo? Vamos a probar, ¡bienvenidxs a una experiencia práctica usando IA generativa!

La propuesta es, trabajando en equipo y partiendo de una base mínima, crear un juego completo, sencillo y divertido. La buena noticia es que no necesitan saber nada previamente (excepto escribir, copiar y pegar), porque van a poner a trabajar a la IA (cualquier LLM de su preferencia, GPT, Claude, DeepSeek, Gemini, etc, no hace falta que sea solo uno). Ustedes tomarán el rol de "directorxs del proyecto".

## 🗺️ 1. ¿Con qué se van a encontrar? (el paso a paso)

Les damos como base un juego muy sencillo que usa la biblioteca `p5.js` de JavaScript. Van a encontrarse **5 archivos**:

1. **`index.html`**
   - **¿Qué es?** Es la "página web" que sostiene el juego. Tiene un simpático michi interactivo (cruelmente engañado por un láser), un botón para ver instrucciones (Ok... ¿qué hago?), y el control de audio on/off.
   - **¿Qué hacen con esto?** Es el archivo que abren con doble clic para jugar en el navegador. También es donde van a editar el título, el modal de instrucciones, las opciones y todo lo que necesiten.
2. **`sprites.js`**
   - **¿Qué es?** El taller de arte. Acá están dibujados el michi, el láser con su rayo proyectado y el fondo grid píxel por píxel.
   - **¿Qué hacen con esto?** Acá es donde le van a pedir a la IA que cambie colores, diseñe nuevos personajes o agregue objetos.
3. **`game.js`**
   - **¿Qué es?** El cerebro del juego. Acá está la lógica de las teclas, las colisiones, la velocidad, el puntaje y el sonido sintetizado de cada captura.
   - **¿Qué hacen con esto?** Acá la IA va a meter las reglas nuevas, los niveles, la música y las pantallas de victoria/derrota.
4. **`assets.js`**
   - **¿Qué es?** El depósito de recursos (imágenes, sonidos, etc). En el juego base, por ejemplo, están en formato base64.
   - **¿Qué hacen con esto?** Acá pueden reemplazar los recursos existentes por otros que consigan o generen. Recuerden que también pueden convertir imágenes o audios a base64 con herramientas como <a href="https://base64.guru/converter/encode">esta</a>.
5. Este markdown con instrucciones.

Editen estos archivos, modifiquen, agreguen más, modularicen, organicen en carpetas, lo que quieran. La idea es que experimenten y aprendan. El único límite es no usar otras bibliotecas, lenguajes o dependencias, todo debe ser puro `p5.js` para mantener simpleza y evitar fricciones.

---

## 🎯 2. Pautas mínimas y logros

El objetivo de la jornada es transformar el prototipo simple recibido en un juego completo. Hacia el final veremos cuántos logros desbloquea cada equipo ¡y quiénes son lxs ganadorxs!

### Tablero de logros

- 🟢 **Logro "Bienvenidos" (+75 pts):** el juego incluye una pantalla principal visualmente copada, con el título del juego (25 pts) y un menú de opciones interactivo (50 pts).
- 🟢 **Logro "Manual de supervivencia" (+100 pts):** el juego incluye una sección clara y fácilmente visible que le explique al jugador cómo jugar y cuál es el objetivo.
- 🟢 **Logro "Too easy for me" (+150 pts):** el juego incluye al menos 2 niveles de dificultad o escenarios diferentes.
- 🟢 **Logro "Hable más fuerte que tengo una toalla" (+125 pts):** el juego incluye sonidos, sean fx (+50 pts) o música de fondo (+75 pts).
- 🟢 **Logro "Auditoría severa" (+100 pts):** el juego incluye un contador de prompts/iteraciones que se requirieron para programarlo. Va a servir en caso de empates.
- 🟢 **Logro "Democracia, aún te tengo fe" (+200 pts):** el juego resulta el más votado por los participantes del hackatón (hacia el final hacemos la votación).

---

## 🤖 3. ¿Cómo trabajar en grupo y con IA de copiloto?

La idea es que cada equipo se organice y trabaje como mejor le parezca o guste. Debatir, organizarse e incluso asignarse roles es parte de la actividad.

Hay distintas formas de plantearle a un LLM el problema que se pretende solucionar, y distintas maneras de darle contexto, diviértanse charlando y probando cuál les resulta más conveniente.

Única regla imprescindible: cada vez que modifiquen los archivos (sea cual sea) no olviden **guardar** y luego **refrescar** la pestaña donde están viendo el `html`.

Cualquier duda que surja pueden preguntarla al tutor o, claro, ¡a su IA de preferencia!

---

## ⚠️ 4. Limitaciones de p5.js (¡no pierdan tiempo acá!)

La librería que usamos (`p5.js`) es genial para juegos 2d retro, pero tiene límites. Esperen problemas si intentan implementar, por ejemplo:

- ❌ Gráficos 3d o mundos complejos.
- ❌ Motores de física realista (gravedad compleja, rebotes hiperrealistas).
- ❌ Modalidad multijugador online en tiempo real.

---

## 🚀 ¡Manos a la obra!

Abran `index.html`, prueben el prototipo base, divídanse los roles en el equipo y empiecen a pedirle a la IA sus primeras modificaciones. ¡Que disfruten el taller!

**Regla de oro irrompible: ¡divertirse!**