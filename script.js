// Game variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 10;
let currentPlayer = 1;
let scores = { 1: 0, 2: 0 };
let canFlip = true;
let playerCount = 2;
let symbols = ['♠', '♥', '♦', '♣', '★', '☆', '♫', '♪', '☀', '☁'];

// DOM elements
const gameBoard = document.getElementById('game-board');
const player1Element = document.getElementById('player1');
const player2Element = document.getElementById('player2');
const score1Element = document.getElementById('score1');
const score2Element = document.getElementById('score2');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restart');
const playerCountSelect = document.getElementById('playerCount');

// Initialize the game
function initGame() {
    // Reset game state
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    currentPlayer = 1;
    scores = { 1: 0, 2: 0 };
    canFlip = true;
    
    // Update UI
    updateScores();
    updatePlayerTurn();
    messageElement.textContent = '';
    
    // Clear the game board
    gameBoard.innerHTML = '';
    
    // Create card pairs
    let cardPairs = [];
    for (let i = 0; i < totalPairs; i++) {
        cardPairs.push(symbols[i]);
        cardPairs.push(symbols[i]);
    }
    
    // Shuffle the cards
    shuffleArray(cardPairs);
    
    // Create card elements
    cardPairs.forEach((symbol, index) => {
        const card = createCard(symbol, index);
        gameBoard.appendChild(card);
        cards.push({
            element: card,
            symbol: symbol,
            index: index,
            isFlipped: false,
            isMatched: false
        });
    });
}

// Create a card element
function createCard(symbol, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.textContent = symbol;
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', () => flipCard(index));
    
    return card;
}

// Flip a card
function flipCard(index) {
    const card = cards[index];
    
    // Check if card can be flipped
    if (!canFlip || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
        return;
    }
    
    // Flip the card
    card.isFlipped = true;
    card.element.classList.add('flipped');
    flippedCards.push(card);
    
    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        canFlip = false;
        checkForMatch();
    }
}

// Check if the flipped cards match
function checkForMatch() {
    const [card1, card2] = flippedCards;
    
    setTimeout(() => {
        if (card1.symbol === card2.symbol) {
            // Cards match
            handleMatch();
        } else {
            // Cards don't match
            handleMismatch();
        }
    }, 1000);
}

// Handle matching cards
function handleMatch() {
    const [card1, card2] = flippedCards;
    
    // Mark cards as matched
    card1.isMatched = true;
    card2.isMatched = true;
    
    // Update score
    scores[currentPlayer]++;
    updateScores();
    
    // Check if all pairs are found
    matchedPairs++;
    if (matchedPairs === totalPairs) {
        endGame();
    } else {
        // Player gets another turn
        messageElement.textContent = `اللاعب ${currentPlayer} وجد زوجاً! دور إضافي.`;
        resetFlippedCards();
    }
}

// Handle mismatched cards
function handleMismatch() {
    const [card1, card2] = flippedCards;
    
    // Flip cards back
    card1.isFlipped = false;
    card2.isFlipped = false;
    card1.element.classList.remove('flipped');
    card2.element.classList.remove('flipped');
    
    // Switch player turn if in two-player mode
    if (playerCount > 1) {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updatePlayerTurn();
        messageElement.textContent = `دور اللاعب ${currentPlayer}`;
    } else {
        messageElement.textContent = 'حاول مرة أخرى!';
    }
    
    resetFlippedCards();
}

// Reset flipped cards array
function resetFlippedCards() {
    flippedCards = [];
    canFlip = true;
}

// End the game
function endGame() {
    canFlip = false;
    
    if (playerCount === 1) {
        messageElement.textContent = 'مبروك! لقد وجدت جميع الأزواج!';
    } else {
        const winner = scores[1] > scores[2] ? 1 : scores[2] > scores[1] ? 2 : 'تعادل';
        if (winner === 'تعادل') {
            messageElement.textContent = 'انتهت اللعبة بالتعادل!';
        } else {
            messageElement.textContent = `مبروك! اللاعب ${winner} هو الفائز بـ ${scores[winner]} نقطة!`;
        }
    }
}

// Update player scores in the UI
function updateScores() {
    score1Element.textContent = scores[1];
    score2Element.textContent = scores[2];
}

// Update active player in the UI
function updatePlayerTurn() {
    if (playerCount > 1) {
        player1Element.classList.toggle('active', currentPlayer === 1);
        player2Element.classList.toggle('active', currentPlayer === 2);
    } else {
        player1Element.classList.add('active');
        player2Element.classList.remove('active');
    }
}

// Shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Handle player count change
function handlePlayerCountChange() {
    playerCount = parseInt(playerCountSelect.value);
    player2Element.style.display = playerCount > 1 ? 'block' : 'none';
    initGame();
}

// Event listeners
restartButton.addEventListener('click', initGame);
playerCountSelect.addEventListener('change', handlePlayerCountChange);

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    player2Element.style.display = playerCount > 1 ? 'block' : 'none';
    initGame();
});
