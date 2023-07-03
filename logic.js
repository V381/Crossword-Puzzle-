const categories = {
  animals: [
    "SKU",
    "DOG",
    "BIRD",
    "LION",
    "TIGER",
    "ELEPHANT",
    "MONKEY",
    "ZEBRA"
  ],
  technology: [
    "COMPUTER",
    "INTERNET",
    "PHONE",
    "WEBSITE",
    "DEVOPS",
    "DIGITAL",
    "NETWORK",
    "SOFTWARE"
  ],
  nature: [
    "TREE",
    "FLOWER",
    "SUN",
    "RAINBOW",
    "MOUNTAIN",
    "RIVER",
    "OCEAN",
    "FOREST"
  ],
  life: [
    "LOVE",
    "FAMILY",
    "FRIENDS",
    "HAPPINESS",
    "SUCCESS",
    "HEALTH",
    "ADVENTURE",
    "DREAM"
  ],
};

const generateGrid = (gridSize) => {
  return Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => "")
  );
};

const getRandomDirection = () => {
  return Math.random() < 0.5 ? "horizontal" : "vertical";
};

const canPlaceWord = (word, grid, row, col, direction) => {
  const wordLength = word.length;

  if (direction === "horizontal") {
    if (col + wordLength > grid.length) {
      return false;
    }

    for (let i = 0; i < wordLength; i++) {
      const cellValue = grid[row][col + i];
      const wordChar = word.charAt(i);
      if (cellValue !== "" && cellValue !== wordChar) {
        return false;
      }
    }
  } else {
    if (row + wordLength > grid.length) {
      return false;
    }

    for (let i = 0; i < wordLength; i++) {
      const cellValue = grid[row + i][col];
      const wordChar = word.charAt(i);
      if (cellValue !== "" && cellValue !== wordChar) {
        return false;
      }
    }
  }

  return true;
};

const placeWord = (word, grid, row, col, direction) => {
  const wordLength = word.length;
  let updatedGrid = [...grid];

  if (direction === "horizontal") {
    for (let i = 0; i < wordLength; i++) {
      const cellValue = grid[row][col + i];
      const wordChar = word.charAt(i);
      if (cellValue === "" || cellValue === wordChar) {
        updatedGrid[row][col + i] = word.charAt(i);
      } else {
        // Handle overlapping characters to create new words
        updatedGrid[row][col + i] += word.charAt(i);
      }
    }
  } else {
    for (let i = 0; i < wordLength; i++) {
      const cellValue = grid[row + i][col];
      const wordChar = word.charAt(i);
      if (cellValue === "" || cellValue === wordChar) {
        updatedGrid[row + i][col] = word.charAt(i);
      } else {
        // Handle overlapping characters to create new words
        updatedGrid[row + i][col] += word.charAt(i);
      }
    }
  }

  return updatedGrid;
};

const generateRandomGrid = (words, gridSize) => {
  let grid = generateGrid(gridSize);
  const placedWords = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let row, col, direction;

    do {
      row = Math.floor(Math.random() * gridSize);
      col = Math.floor(Math.random() * gridSize);
      direction = getRandomDirection();
    } while (!canPlaceWord(word, grid, row, col, direction));

    grid = placeWord(word, grid, row, col, direction);

    placedWords.push({
      word: word,
      row: row,
      col: col,
      direction: direction
    });
  }

  return { grid, placedWords };
};

const clearGrid = (puzzleGrid) => {
  while (puzzleGrid.firstChild) {
    puzzleGrid.firstChild.remove();
  }
};

const renderGrid = (grid, puzzleGrid, checkAnswer) => {
  grid.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");

    row.forEach((cell, colIndex) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("maxlength", "1");
      input.setAttribute("placeholder", " ");

      if (cell === "") {
        td.classList.add("dark");
        input.setAttribute("disabled", "disabled");
      } else {
        td.classList.add("input-cell");
        td.setAttribute("data-answer", cell);
        input.addEventListener("input", checkAnswer);
      }

      td.appendChild(input);
      tr.appendChild(td);
    });

    puzzleGrid.appendChild(tr);
  });
};

const renderPlacedWords = (placedWords) => {
  const inputs = document.querySelectorAll(".crossword input");

  inputs.forEach((input) => {
    const row = parseInt(
      input.parentElement.parentElement.getAttribute("data-row")
    );
    const col = parseInt(input.parentElement.cellIndex);

    placedWords.forEach((word) => {
      if (row === word.row && col === word.col) {
        input.setAttribute("data-direction", word.direction);
      }
    });
  });
};

const checkAnswer = (event) => {
  const input = event.target;
  const answer = input.value.toUpperCase();
  const correctAnswer = input.parentElement.getAttribute("data-answer");

  if (answer === correctAnswer) {
    input.classList.remove("incorrect");
    input.classList.add("correct");
  } else {
    input.classList.remove("correct");
    input.classList.add("incorrect");
  }
  
  // Apply flip animation
  input.classList.add("flip-animation");
  setTimeout(() => {
    input.classList.remove("flip-animation");
  }, 300);
};

const showAnswers = () => {
  const inputs = document.querySelectorAll(".crossword input");

  inputs.forEach((input) => {
    input.value = input.parentElement.getAttribute("data-answer");
    input.classList.remove("incorrect");
    input.classList.add("correct");
  });
};

const regeneratePuzzle = () => {
  const category = document.getElementById("category").value;
  const words = categories[category];
  const gridSize = 10;
  const puzzleGrid = document.getElementById("puzzle-grid");

  clearGrid(puzzleGrid);

  const { grid, placedWords } = generateRandomGrid(words, gridSize);

  renderGrid(grid, puzzleGrid, checkAnswer);
  renderPlacedWords(placedWords);
};

document.querySelector("#category").addEventListener("change", () => {
  regeneratePuzzle();
});