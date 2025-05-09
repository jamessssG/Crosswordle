document.addEventListener('DOMContentLoaded', () => {
    const wordLengthInput = document.getElementById('word-length');
    const startGameBtn = document.getElementById('start-game-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const setupArea = document.getElementById('setup-area');
    const gameArea = document.getElementById('game-area');
    const gameBoard = document.getElementById('game-board');
    const keyboardArea = document.getElementById('keyboard-area');
    const gameMessage = document.getElementById('game-message');
    const errorMessage = document.getElementById('error-message');
    const wordDisplay = document.getElementById('word-display');


    const MAX_GUESSES = 6;
    let currentWordLength = 5;
    let targetWord = '';
    let currentRow = 0;
    let currentCol = 0;
    let gameActive = false;
    let isSubmitting = false;

    const wordLists = {
        3: ["cat", "dog", "sun", "run", "big", "fly", "try", "cry", "sky", "pie", "ape", "elf", "gem", "ink", "joy", "kit", "log", "map", "owl", "pen"],
        4: ["boat", "tree", "fish", "frog", "jump", "play", "read", "sing", "walk", "talk", "acid", "bake", "calm", "dark", "echo", "fade", "glow", "hike", "idea", "jazz"],
        5: ["apple", "grape", "house", "mouse", "light", "night", "plant", "stone", "water", "earth", "baker", "dream", "flash", "guide", "happy", "image", "joker", "lemon", "magic", "noble"],
        6: ["banana", "orange", "purple", "window", "garden", "forest", "summer", "winter", "spring", "autumn", "bridge", "candle", "danger", "effort", "flower", "guitar", "honest", "island", "jacket", "keeper"],
        7: ["chicken", "kitchen", "library", "morning", "evening", "picture", "journey", "country", "holiday", "example", "breathe", "capture", "diamond", "explore", "freedom", "gallery", "history", "inspire", "justice", "kindred"],
        8: ["mountain", "elephant", "umbrella", "computer", "keyboard", "language", "question", "solution", "tomorrow", "yesterday", "absolute", "champion", "discover", "educate", "festival", "generous", "hospital", "identify", "journey", "knockout"],
        9: ["adventure", "beautiful", "knowledge", "important", "different", "wonderful", "excellent", "delicious", "celebrate", "happiness", "challenge", "community", "education", "fantastic", "gratitude", "highlight", "influence", "jubilant", "landscape", "marketing"],
        10: ["connection", "experience", "technology", "foundation", "university", "restaurant", "strawberry", "watermelon", "basketball", "volleyball", "accomplish", "background", "confidence", "dedication", "efficiency", "friendship", "government", "helicopter", "innovation", "leadership"]
    };


    function getTargetWordList(length) {
        return wordLists[length] || [];
    }


    function selectRandomTargetWord(length) {
        const list = getTargetWordList(length);
        if (list.length === 0) {
            errorMessage.textContent = `No target words of length ${length} available in our list. Please choose another length.`;
            return null;
        }
        errorMessage.textContent = '';
        return list[Math.floor(Math.random() * list.length)].toUpperCase();
    }


    function initializeGame() {
        const selectedLength = parseInt(wordLengthInput.value);
        if (isNaN(selectedLength) || selectedLength < 3 || selectedLength > 10) {
            errorMessage.textContent = "Please enter a valid word length (3-10).";
            return;
        }
        errorMessage.textContent = '';
        currentWordLength = selectedLength;
        targetWord = selectRandomTargetWord(currentWordLength);


        if (!targetWord) {
            setupArea.classList.remove('hidden');
            gameArea.classList.add('hidden');
            return;
        }

        gameActive = true;
        currentRow = 0;
        currentCol = 0;
        gameMessage.textContent = 'Guess the word!';
        restartGameBtn.classList.add('hidden');

        setupArea.classList.add('hidden');
        gameArea.classList.remove('hidden');

        createGameBoard();
        createKeyboard();
        updateKeyboardColors();
        console.log("Target Word:", targetWord);
    }

    function createGameBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateRows = `repeat(${MAX_GUESSES}, 1fr)`;

        for (let i = 0; i < MAX_GUESSES; i++) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');
            rowDiv.style.gridTemplateColumns = `repeat(${currentWordLength}, 1fr)`;
            for (let j = 0; j < currentWordLength; j++) {
                const tileDiv = document.createElement('div');
                tileDiv.classList.add('tile');
                tileDiv.id = `tile-${i}-${j}`;
                rowDiv.appendChild(tileDiv);
            }
            gameBoard.appendChild(rowDiv);
        }
    }

    function createKeyboard() {
        keyboardArea.innerHTML = '';
        const keysLayout = [
            "QWERTYUIOP",
            "ASDFGHJKL",
            "ZXCVBNM"
        ];

        keysLayout.forEach(rowStr => {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('keyboard-row');
            rowStr.split('').forEach(keyChar => {
                const keyBtn = document.createElement('button');
                keyBtn.classList.add('key');
                keyBtn.textContent = keyChar;
                keyBtn.setAttribute('data-key', keyChar);
                keyBtn.addEventListener('click', () => handleKeyPress(keyChar));
                rowDiv.appendChild(keyBtn);
            });
            keyboardArea.appendChild(rowDiv);
        });

        const bottomRow = document.createElement('div');
        bottomRow.classList.add('keyboard-row');

        const enterBtn = document.createElement('button');
        enterBtn.classList.add('key');
        enterBtn.textContent = 'Enter';
        enterBtn.id = 'enter-key';
        enterBtn.style.minWidth = '60px';
        enterBtn.addEventListener('click', handleSubmit);
        bottomRow.appendChild(enterBtn);

        const backspaceBtn = document.createElement('button');
        backspaceBtn.classList.add('key');
        backspaceBtn.textContent = 'Backspace';
        backspaceBtn.id = 'backspace-key';
        backspaceBtn.style.minWidth = '80px';
        backspaceBtn.addEventListener('click', handleBackspace);
        bottomRow.appendChild(backspaceBtn);

        keyboardArea.appendChild(bottomRow);
    }

    function handleKeyPress(key) {
        if (!gameActive || currentCol >= currentWordLength) return;
   
        const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
        if (tile) {
            tile.textContent = key;
            tile.setAttribute('data-letter', key);
            tile.classList.add('filled');

            tile.style.transform = 'scale(1.1)';
            setTimeout(() => {
                tile.style.transform = 'scale(1)';
            }, 100);
            currentCol++;
        }
    }

    function handleBackspace() {
        if (!gameActive || currentCol <= 0) return;
   
        currentCol--;
        const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
        if (tile) {
            tile.textContent = '';
            tile.removeAttribute('data-letter');
            tile.classList.remove('filled', 'correct', 'present', 'absent');
        }
        gameMessage.textContent = '';
    }

    async function handleSubmit() {
        if (!gameActive || isSubmitting) return;
       
        isSubmitting = true;

        if (currentCol !== currentWordLength) {
            gameMessage.textContent = `Word must be ${currentWordLength} letters long.`;
            shakeCurrentRow();
            isSubmitting = false;
            return;
        }

        const guess = getCurrentGuess();
        gameMessage.textContent = 'Checking word...';

        const isValidWord = await checkWordValidity(guess);
        if (!isValidWord) {
            gameMessage.textContent = `'${guess}' is not a valid word.`;
            shakeCurrentRow();
            isSubmitting = false;
            return;
        }

        gameMessage.textContent = '';
        evaluateGuess(guess);

        if (guess === targetWord) {
            gameMessage.textContent = `Great job! You guessed it in ${currentRow + 1} ${currentRow + 1 === 1 ? "try" : "tries"}! 🎉`;
            gameActive = false;
            restartGameBtn.classList.remove('hidden');
            isSubmitting = false;
            return;
        }

        currentRow++;
        currentCol = 0;

        if (currentRow >= MAX_GUESSES) {
            gameMessage.textContent = `Game over. The word was ${targetWord}.`;
            gameActive = false;
            restartGameBtn.classList.remove('hidden');
        }
        setTimeout(() => {
            isSubmitting = false;
        }, 300);
    }

    async function checkWordValidity(word) {
        if (!word) return false;
   
        try {
            gameMessage.textContent = "Checking word...";
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
   
            if (!response.ok) {
                if (response.status === 404) {
                    return false;
                } else {
                    const errorData = await response.text();
                    console.error("API Error:", response.status, response.statusText, errorData);
                    gameMessage.textContent = "Error checking word. Try again.";
                    return false;
                }
            }
   
            return true;
        } catch (error) {
            console.error("Network or fetch error:", error.message || error);
            gameMessage.textContent = "Network error. Please check your internet connection.";
            return false;
        }
    }

    function getCurrentGuess() {
        let guess = '';
        for (let i = 0; i < currentWordLength; i++) {
            const tile = document.getElementById(`tile-${currentRow}-${i}`);
            guess += tile.textContent;
        }
        return guess.toUpperCase();
    }

    function evaluateGuess(guess) {
        const guessArray = guess.split('');
        const targetArray = targetWord.split('');

        const targetLetterCounts = {};
        targetArray.forEach(letter => {
            targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
        });

        for (let i = 0; i < currentWordLength; i++) {
            const tile = document.getElementById(`tile-${currentRow}-${i}`);
            const letter = guessArray[i];

            tile.setAttribute('data-letter', letter);
           
            if (letter === targetArray[i]) {
                tile.style.animationDelay = `${i * 0.1}s`;
                setTimeout(() => {
                    tile.classList.add('correct');
                    updateKeyColor(letter, 'correct');
                }, i * 100); 
                targetLetterCounts[letter]--;
            }
        }
   
        for (let i = 0; i < currentWordLength; i++) {
            const tile = document.getElementById(`tile-${currentRow}-${i}`);
            const letter = guessArray[i];

            if (letter === targetArray[i]) {
                continue;
            }

            tile.style.animationDelay = `${i * 0.1}s`;
           
            setTimeout(() => {
                if (targetArray.includes(letter) && targetLetterCounts[letter] > 0) {
                    tile.classList.add('present');
                    updateKeyColor(letter, 'present');
                    targetLetterCounts[letter]--;
                } else {
                    tile.classList.add('absent');
                    updateKeyColor(letter, 'absent');
                }
            }, i * 100);
        }
       
        if (guess === targetWord) {
            setTimeout(() => {
                for (let i = 0; i < currentWordLength; i++) {
                    const tile = document.getElementById(`tile-${currentRow}-${i}`);
                    const bounceDelay = i * 100 + 500; // Extra delay after color reveal
                    setTimeout(() => {
                        tile.style.transform = 'scale(1.15)';
                        setTimeout(() => {
                            tile.style.transform = 'scale(1)';
                        }, 200);
                    }, bounceDelay);
                }
            }, currentWordLength * 100 + 300);
        }
    }

    function updateKeyColor(letter, status) {
        const keyElement = keyboardArea.querySelector(`.key[data-key="${letter}"]`);
        if (keyElement) {
            if (status === 'correct') {
                keyElement.classList.remove('present', 'absent');
                keyElement.classList.add('correct');
            } else if (status === 'present' && !keyElement.classList.contains('correct')) {
                keyElement.classList.remove('absent');
                keyElement.classList.add('present');
            } else if (status === 'absent' && !keyElement.classList.contains('correct') && !keyElement.classList.contains('present')) {
                keyElement.classList.add('absent');
            }
        }
    }

    function updateKeyboardColors() {
        const keys = keyboardArea.querySelectorAll('.key');
        keys.forEach(key => {
            key.classList.remove('correct', 'present', 'absent');
        });
    }

    function shakeCurrentRow() {
        const rowElement = gameBoard.children[currentRow];
        if (rowElement) {
            rowElement.classList.add('shake-animation');
            setTimeout(() => {
                rowElement.classList.remove('shake-animation');
            }, 500);
        }
    }

    function resetGame() {
        setupArea.classList.remove('hidden');
        gameArea.classList.add('hidden');
        wordLengthInput.value = currentWordLength;
        errorMessage.textContent = '';
        gameMessage.textContent = '';
        restartGameBtn.classList.add('hidden');
        isSubmitting = false;
    }

    function displayWord(word) {
        wordDisplay.innerHTML = '';
     
        [...word].forEach((letter, index) => {
          const span = document.createElement('span');
          span.textContent = letter;
          span.classList.add('letter');
          span.style.animationDelay = `${index * 0.1}s`;
          wordDisplay.appendChild(span);
        });
    }

    startGameBtn.addEventListener('click', initializeGame);
    restartGameBtn.addEventListener('click', resetGame);

    document.addEventListener('keydown', (e) => {
        if (setupArea.classList.contains('hidden') && !gameArea.classList.contains('hidden')) {
            if (!gameActive && e.key !== 'Enter') return;

            const key = e.key.toUpperCase();
            if (key.length === 1 && key >= 'A' && key <= 'Z') {
                handleKeyPress(key);
            } else if (e.key === 'Enter') {
                if (!gameActive && !restartGameBtn.classList.contains('hidden')) {
                    resetGame();
                } else {
                    handleSubmit();
                }
            } else if (e.key === 'Backspace') {
                handleBackspace();
            }
        } else {
            if (e.key === 'Enter') {
                initializeGame();
            }
        }
    });
});
