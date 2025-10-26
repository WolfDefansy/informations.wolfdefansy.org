// oneko.js: https://github.com/adryd325/oneko.js

(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const nekoEl = document.createElement("div");

  let nekoPosX = 32;
  let nekoPosY = 32;

  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const nekoSpeed = 10;
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };

  function init() {
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "none";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = 2147483647;

    let nekoFile = "/js/oneko.gif"
    const curScript = document.currentScript
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat
    }
    nekoEl.style.backgroundImage = `url(${nekoFile})`;

    document.body.appendChild(nekoEl);

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    // Stops execution if the neko element is removed from DOM
    if (!nekoEl.isConnected) {
      return;
    }
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp
      frame()
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // every ~ 20 seconds
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < 32) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (nekoPosY < 32) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (nekoPosX > window.innerWidth - 32) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (nekoPosY > window.innerHeight - 32) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation =
        avalibleIdleAnimations[
          Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction;
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  init();
})();


// Définition des cellules à remplir par colonne
      const filledCells = {
        1: [6],
        2: [5, 6, 7, 8],
        3: [5, 6, 7],
        4: [5, 6, 7],
        5: [5, 6, 7, 8],
        6: [5, 6, 7, 8, 9, 10, 11, 12],
        7: [4, 5, 6, 7, 8, 9, 10, 11, 12],
        8: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        9: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15],
        10: [4, 6, 9, 10, 11, 12, 15],
        11: [2, 3, 10, 11, 12, 14, 16, 17],
        12: [3, 5, 8, 9, 10, 11, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        13: [1, 6, 8, 9, 16, 17, 18, 19, 20, 21, 22],
        14: [2, 3, 4, 16, 17, 18, 19, 20, 21],
        15: [2, 3, 4, 5, 6, 17, 18, 19, 20],
        16: [2, 3, 4, 5, 17, 18, 19],
        17: [6],
        19: [14, 15],
        20: [8, 9, 11, 12, 13, 14, 15],
        21: [10, 11, 12, 13, 14, 15, 16, 17],
        22: [6, 7, 9, 10, 13, 14, 15, 16, 17],
        23: [3, 5, 6, 9, 10, 13, 14, 15, 16, 17, 18, 19, 20],
        24: [2, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20],
        25: [5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18],
        26: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 19],
        27: [6, 7, 8, 9, 10, 11, 12, 13, 14],
        28: [5, 6, 7, 8, 9, 10, 11, 12, 13],
        29: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        30: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        31: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        32: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        33: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16],
        34: [4, 5, 6, 7, 8, 9, 10, 11, 12],
        35: [4, 5, 6, 7, 8, 9, 10, 15, 19, 20],
        36: [4, 5, 6, 7, 8, 9, 18, 19],
        37: [5, 6, 7, 8, 9, 10, 12, 16, 18, 19, 20],
        38: [4, 5, 6, 7, 11, 19, 20],
        39: [5, 6, 7],
        40: [5, 6, 8, 22],
        41: [5, 6, 7],
        42: [6],
      };

      // Générer la grille
      const container = document.getElementById("grid-container");

      for (let col = 1; col <= 42; col++) {
        const columnDiv = document.createElement("div");
        columnDiv.className = "column";

        for (let row = 1; row <= 24; row++) {
          const cell = document.createElement("div");
          cell.className = "cell";

          if (filledCells[col] && filledCells[col].includes(row)) {
            cell.classList.add("filled");
          }

          columnDiv.appendChild(cell);
        }

        container.appendChild(columnDiv);
      }