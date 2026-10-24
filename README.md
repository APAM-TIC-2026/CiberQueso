# Ciberqueso 🧀⚡

Proyecto de videojuego desarrollado para la **TIC - Universidad Nacional de Hurlingham (UNAHUR) - 2026**.

---

## 👥 Integrantes del Equipo

* **Perla Aguilera**
* **Alejandro Zalazar**
* **Agustín Otero**
* **Melisa Bravo**

---

## 🎮 Descripción del Juego

**Ciberqueso** es un juego de acción y laberintos 2D de estilo arcade. El jugador controla a un ratón cibernético que debe desplazarse a través de diferentes sectores recolectando quesos y esquivando al gato cazador y sus trampas.

### 🕹️ Controles
* **Movimiento:** Solo movimientos en 4 direcciones (ortogonales: arriba, abajo, izquierda y derecha). No permite desplazamientos diagonales.
* **Pausa:** Tecla asignada de pausa (e.g., `ESC` o `P`).

---

## 🖥️ Flujo y Estructura de Pantallas

### 1. Pantalla de Introducción (Splash / Intro)
* Muestra el logo y título: **Ciberqueso**.
* Créditos de desarrollo: Nombres de los integrantes.
* Referencia institucional: **UNAHUR TIC 2026**.
* Transición automática o mediante pulsación de tecla hacia el Menú Principal.

### 2. Pantalla Principal (Menú)
* **Play:** Selección de nivel de dificultad:
  * **Fácil:** 3 vidas.
  * **Normal:** 2 vidas.
  * **Difícil:** 1 vida.
* **High Score:** Registro y visualización de la puntuación máxima guardada.
* **Controles:** Guía visual de teclas o comandos de movimiento.

### 3. Pantalla de Juego (In-Game HUD)
* **HUD en pantalla:**
  * Contador de vidas restantes.
  * Puntaje actual acumulado.
  * Indicador de nivel/fase en curso.
* **Menú de Pausa:**
  * *Reanudar :* Vuelve a la partida en curso.
  * *Menú Principal:* Abandona la partida y regresa al inicio.

### 4. Pantalla de Terminación (Game Over / Victoria)
* Puntuación obtenida en la partida.
* Récord histórico (Puntaje Máximo).
* Botón **Volver a jugar** (reinicia con la misma dificultad).
* Botón **Menú Principal**.

---

## 🗺️ Progresión de Niveles y Mecánicas

El juego escala en complejidad combinando laberintos, comportamientos de IA para el gato y objetos especiales:

| Nivel / Fase | Tipo de Entorno | Enemigo (Gato) | Ítems & Mecánicas Especiales |
| :--- | :--- | :--- | :--- |
| **Nivel 1: Tutorial / Básico** | Tablero abierto sin obstáculos complejos. | Sin gato. | Recolección simple de quesos estáticos. |
| **Nivel 2: Entrenamiento Ágil** | Tablero con muros sencillos. | Sin gato. | Aparece el **Queso Móvil** (se desplaza aleatoriamente por la pantalla). |
| **Nivel 3: El Primer Encuentro** | Laberinto básico. | **Gato con ruta fija:** Patrulla un circuito predefinido sin perseguir directamente al ratón. | Recolección de quesos mientras se evita el recorrido del guardia. |
| **Nivel 4: Cacería Intermedia** | Laberinto intermedio. | **Gato patrulla + Queso Móvil:** El gato recorre una ruta fija; capturar el queso móvil otorga bonificación de velocidad. | El ratón debe calcular tiempos para interceptar el queso sin cruzarse con el gato. |
| **Nivel 5: Rastreo** | Laberinto completo. | **Gato perseguidor:** Rastrea activamente la posición del ratón mediante detección de proximidad. | Rutas de escape y puntos ciegos dentro del laberinto. |
| **Nivel 6: Superqueso al Ataque** | Laberinto avanzado. | **Gato perseguidor agresivo.** | **Superqueso (Power-Up):** Concede invulnerabilidad temporal. Si el ratón toca al gato en este estado, lo neutraliza temporalmente y suma puntos extra. |
| **Nivel 7: Campo Minado** | Laberinto con zonas estrechas. | **Gato trampero:** Además de patrullar/perseguir, suelta trampas temporales en los pasillos. | Pisar una trampa descuenta 1 vida. Se requiere memorización y evasión activa. |
| **Nivel 8: Desafío Final (Ciberqueso Master)** | Laberinto complejo multinivel. | **Gato trampero + persecución total:** Alta velocidad y colocación frecuente de trampas. | Disponibilidad limitada de **Superqueso** y **Quesos Móviles** para sobrevivir y despejar el tablero. |

---

## ⚙️ Reglas de Juego & Power-Ups

* **Colisiones y Vidas:**
  * Contacto directo con el gato: Pérdida inmediata de 1 vida (salvo que el Superqueso esté activo).
  * Contacto con una trampa activa del gato: Pérdida de 1 vida.
* **Superqueso:**
  * Duración limitada (con aviso visual/parpadeo al expirar).
  * Permite derrotar temporalmente al gato al tocarlo.
* **Queso Móvil:**
  * Bonificación alta de puntos y potenciador secundario de escape.
