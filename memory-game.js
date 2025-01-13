const cards = [
    { value: "2 + 2", answer: "4" },
    { value: "3 * 3", answer: "9" },
    { value: "10 - 5", answer: "5" },
    { value: "8 / 2", answer: "4" },
    { value: "7 + 3", answer: "10" },
    { value: "6 * 2", answer: "12" },
    { value: "15 - 7", answer: "8" },
    { value: "20 / 4", answer: "5" }
];

let flippedCards = [];
let matchedCards = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    const gameBoard = document.getElementById('memory-game');
    gameBoard.innerHTML = '';

    // إنشاء البطاقات
    const allCards = [...cards, ...cards]; // مضاعفة البطاقات للمطابقة
    shuffle(allCards);

    allCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.textContent = card.value;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard(event) {
    const card = event.target;

    // تجنب النقر على بطاقة مطابقة أو مقلوبة بالفعل
    if (flippedCards.length < 2 && !flippedCards.includes(card) && !matchedCards.includes(card)) {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const index1 = card1.dataset.index;
    const index2 = card2.dataset.index;

    if (cards[index1 % cards.length].answer === cards[index2 % cards.length].answer) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);

        if (matchedCards.length === cards.length * 2) {
            document.getElementById('result').textContent = "لقد فزت! جميع البطاقات مطابقة.";
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
    }

    flippedCards = [];
}

window.onload = createBoard;
