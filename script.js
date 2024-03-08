import wordArray from "./words.js";

const spawnLine = document.querySelector(".spawn-line");
const gameContainer = document.querySelector(".game-container");
const gameOverDiv = document.querySelector(".game-over");
const gameOverHeading = document.querySelector(".game-over h1");
const timeDisplay = document.querySelector(".game-over h2:nth-of-type(1)");
const monstersKilledDisplay = document.querySelector(
  ".game-over h2:nth-of-type(2)"
);
const newGameButton = document.querySelector(".game-over button");
const gameStartContainer = document.querySelector(".game-start");
const gameStartButton = document.querySelector(".game-start button");

let levelNum = 0;
const levelsNum = [6, 5, 4, 3, 1];
const levels = ["easy", "normal", "intermediate", "hard", "impossible"];

const randomWord = function () {
  const randomIndex = Math.floor(Math.random() * wordArray.length);
  return wordArray[randomIndex];
};

const randomColor = () => {
  const colorArray = ["blue", "red", "white", "orange", "green"];
  const position = Math.floor(Math.random() * colorArray.length);
  return colorArray[position];
};

let monsterTimeouts = [];
let monsterWords = [];
let gameStartTime;
let gameEndTime;
let killedMonsters = 0;
let numOfMonsters = 20;

const generateMonster = function () {
  resetGame();

  if (!gameStartTime) {
    gameStartTime = new Date();
  }

  for (let i = 1; i <= numOfMonsters; i++) {
    const timeout = setTimeout(() => {
      const topPosition = Math.floor(
        Math.random() * (spawnLine.clientHeight - 180)
      );
      const word = randomWord();
      const html = `
          <div class="monster" id="monster-${i}" style="top: ${topPosition}px;">
              <h2 style="color: ${randomColor()}">${word}</h2>
              <img src="img/Flatwoods_monster_v3.png" alt="monster">
          </div>
          `;
      spawnLine.insertAdjacentHTML("afterbegin", html);
      monsterWords.push(word);
    }, Math.random() * levelsNum[levelNum] * 5000); // this number sets the difficulty

    monsterTimeouts.push(timeout);
  }
};

const removeMonster = function (word) {
  const monsters = document.querySelectorAll(".monster");
  monsters.forEach((monster) => {
    if (monster.querySelector("h2").textContent === word) {
      monster.remove();
      killedMonsters++;
      gameEnd();
    }
  });
};

const gameEnd = () => {
  if (numOfMonsters === killedMonsters) {
    gameEndTime = new Date();
    const gameDurationTime = gameEndTime - gameStartTime;
    const seconds = Math.floor(gameDurationTime / 1000);
    gameContainer.style.display = "none";
    gameOverDiv.style.display = "";

    if (levelNum === levelsNum.length - 1) {
      gameOverHeading.textContent = `WINNER, ${levels[levelNum]} LEVEL BEATEN!`;
      newGameButton.textContent = "NEW GAME";
      decreaseLevel();
    } else {
      gameOverHeading.textContent = `YOU BEAT ${levels[levelNum]} LEVEL!`;
      newGameButton.textContent = "NEXT LEVEL";
      increaseLevel();
    }

    // gameOverHeading.textContent = `YOU WON ${levels[levelNum]} level!`;
    timeDisplay.textContent = `Your time: ${seconds} seconds`;
    monstersKilledDisplay.textContent = `Monsters killed: ${killedMonsters}`;

    blackAndWhiteSwitching(newGameButton);
    newGameButton.addEventListener("click", () => {
      gameStartContainer.style.display = "none";
      gameOverDiv.style.display = "none";
      gameContainer.style.display = "";
      start();
    });
  }
};

const blackAndWhiteSwitching = (item) => {
  const arr = ["black", "white"];
  let num = 0;

  clearInterval(item.interval);

  item.interval = setInterval(() => {
    if (num === 0) {
      item.style.backgroundColor = arr[1];
      item.style.color = arr[0];
      item.style.border = `1px solid ${arr[0]}`;
      num++;
    } else {
      item.style.backgroundColor = arr[0];
      item.style.color = arr[1];
      item.style.border = `1px solid ${arr[1]}`;
      num--;
    }
  }, 1000);
};

const movePicture = function () {
  const monsters = document.querySelectorAll(".monster");
  monsters.forEach((monster) => {
    let num = parseFloat(monster.style.left) || 0;
    num += 50;
    monster.style.left = `${num}%`;

    if (num >= 900) {
      gameEndTime = new Date();
      const gameDurationTime = gameEndTime - gameStartTime;
      const seconds = Math.floor(gameDurationTime / 1000);
      monsters.forEach((monster) => monster.remove());
      monsterTimeouts.forEach((timeout) => clearTimeout(timeout));
      clearInterval(moveInterval);

      gameOverDiv.style.display = "";
      gameContainer.style.display = "none";

      gameOverHeading.textContent = "GAME OVER!";
      timeDisplay.textContent = `Your time: ${seconds} seconds`;
      monstersKilledDisplay.textContent = `Monsters killed: ${killedMonsters}`;
      newGameButton.textContent = "NEW GAME";

      decreaseLevel();

      blackAndWhiteSwitching(newGameButton);
      newGameButton.addEventListener("click", () => {
        gameStartContainer.style.display = "none";
        gameOverDiv.style.display = "none";
        gameContainer.style.display = "";
        start();
      });
    }
  });
};
let moveInterval;

const userInput = [];

document.body.addEventListener("keydown", function (event) {
  const keyPressed = event.key.toLowerCase();

  if (keyPressed === "escape") {
    userInput.splice(0, userInput.length);
    return;
  }

  userInput.push(keyPressed);

  let matchedWord = null;

  for (let i = 0; i < monsterWords.length; i++) {
    const word = monsterWords[i].toLowerCase();
    if (word.startsWith(userInput.join("").toLowerCase())) {
      if (word === userInput.join("").toLowerCase()) {
        matchedWord = monsterWords[i];
        break;
      }
    }
  }

  if (matchedWord !== null) {
    removeMonster(matchedWord);
    const index = monsterWords.indexOf(matchedWord);
    if (index !== -1) {
      monsterWords.splice(index, 1);
      userInput.splice(0, userInput.length);
    }
  }
});

const resetGame = () => {
  gameStartTime = null;
  gameEndTime = null;
  killedMonsters = 0;
};

const start = () => {
  resetGame();

  monsterTimeouts.forEach((timeout) => clearTimeout(timeout));
  monsterTimeouts = [];

  generateMonster();
  clearInterval(moveInterval);
  moveInterval = setInterval(movePicture, 1000);
};

const increaseLevel = () => {
  levelNum++;
  if (levelNum >= levelsNum.length) {
    levelNum = levelsNum.length - 1;
  }
};

const decreaseLevel = () => {
  levelNum = 0;
};

const startGame = () => {
  gameStartContainer.style.display = "none";
  gameContainer.style.display = "";
  start();
};
gameStartButton.addEventListener("click", startGame);
blackAndWhiteSwitching(gameStartButton);
