function checkNumberAnswer() {
    const questions = [
        { question: "ما هو العدد الذي يمثل الجذر التربيعي لـ 16؟", answer: "4" },
        { question: "ما هو العدد الذي يمثل ضعف العدد 12؟", answer: "24" },
        { question: "ما هو العدد الذي يمثل نصف العدد 50؟", answer: "25" },
        { question: "ما هو العدد الذي إذا أضفت إليه 10 يكون الناتج 30؟", answer: "20" },
        { question: "ما هو العدد الذي يمثل مجموع الأعداد من 1 إلى 5؟", answer: "15" }
    ];

    let score = 0;
    questions.forEach((q, index) => {
        const userAnswer = document.getElementById(`number-answer-${index}`).value;
        const result = document.getElementById(`number-result-${index}`);
        if (userAnswer === q.answer) {
            result.textContent = "إجابة صحيحة!";
            result.style.color = "green";
            score++;
        } else {
            result.textContent = "إجابة خاطئة!";
            result.style.color = "red";
        }
    });

    const finalResult = document.getElementById("number-final-result");
    finalResult.textContent = `نتيجتك: ${score} من ${questions.length}`;
    finalResult.style.color = score === questions.length ? "green" : "red";
}
