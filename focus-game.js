function checkFocusAnswer() {
    const questions = [
        { question: "ما هو العدد الأولي الأصغر؟", answer: "2" },
        { question: "ما هو الجذر التربيعي لـ 64؟", answer: "8" },
        { question: "ما هو العدد الذي إذا ضربته في نفسه يكون الناتج 49؟", answer: "7" },
        { question: "ما هو العدد الذي يمثل نصف العدد 20؟", answer: "10" },
        { question: "ما هو العدد الذي يمثل ضعف العدد 15؟", answer: "30" }
    ];

    let score = 0;
    questions.forEach((q, index) => {
        const userAnswer = document.getElementById(`focus-answer-${index}`).value;
        const result = document.getElementById(`focus-result-${index}`);
        if (userAnswer === q.answer) {
            result.textContent = "إجابة صحيحة!";
            result.style.color = "green";
            score++;
        } else {
            result.textContent = "إجابة خاطئة!";
            result.style.color = "red";
        }
    });

    const finalResult = document.getElementById("focus-final-result");
    finalResult.textContent = `نتيجتك: ${score} من ${questions.length}`;
    finalResult.style.color = score === questions.length ? "green" : "red";
}
