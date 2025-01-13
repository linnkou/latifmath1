function checkAnswer() {
    const questions = [
        { question: "ما هو العدد الذي إذا ضربته في نفسه يكون الناتج 25؟", answer: "5" },
        { question: "ما هو العدد الأولي الذي يلي العدد 7؟", answer: "11" },
        { question: "ما هو العدد الذي يمثل مجموع الأعداد من 1 إلى 10؟", answer: "55" },
        { question: "ما هو العدد الذي إذا أضفت إليه 5 يكون الناتج 20؟", answer: "15" },
        { question: "ما هو العدد الذي يمثل نصف العدد 100؟", answer: "50" }
    ];

    let score = 0;
    questions.forEach((q, index) => {
        const userAnswer = document.getElementById(`math-answer-${index}`).value;
        const result = document.getElementById(`math-result-${index}`);
        if (userAnswer === q.answer) {
            result.textContent = "إجابة صحيحة!";
            result.style.color = "green";
            score++;
        } else {
            result.textContent = "إجابة خاطئة!";
            result.style.color = "red";
        }
    });

    const finalResult = document.getElementById("math-final-result");
    finalResult.textContent = `نتيجتك: ${score} من ${questions.length}`;
    finalResult.style.color = score === questions.length ? "green" : "red";
}
