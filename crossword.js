const crosswordData = [
    { question: "ما هو العدد الأولي الأصغر؟", answer: "2" },
    { question: "ما هو العدد الذي يمثل الجذر التربيعي لـ 16؟", answer: "4" },
    { question: "ما هو العدد الذي إذا ضربته في نفسه يكون الناتج 25؟", answer: "5" }
];

function checkCrosswordAnswers() {
    crosswordData.forEach((item, index) => {
        const userAnswer = document.getElementById(`crossword-answer-${index}`).value;
        const result = document.getElementById(`crossword-result-${index}`);
        if (userAnswer.toLowerCase() === item.answer.toLowerCase()) {
            result.textContent = "إجابة صحيحة!";
            result.style.color = "green";
        } else {
            result.textContent = "إجابة خاطئة!";
            result.style.color = "red";
        }
    });
}
