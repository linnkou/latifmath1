function checkAnswer() {
    const questions = [
        { question: "إذا كان أحمد أكبر من علي بـ 5 سنوات، وعمر علي الآن 10 سنوات، فكم عمر أحمد؟", answer: "15" },
        { question: "إذا كان لديك 3 تفاحات وأخذت منها تفاحتين، فكم تفاحة لديك الآن؟", answer: "1" },
        { question: "إذا كان اليوم هو الخميس، فما هو اليوم بعد غد؟", answer: "السبت" },
        { question: "إذا كان لديك 10 دراهم وأنفقت 4 دراهم، فكم درهماً بقي معك؟", answer: "6" },
        { question: "إذا كان لديك 5 كتب وأضفت إليها 3 كتب أخرى، فكم كتاب لديك الآن؟", answer: "8" }
    ];

    let score = 0;
    questions.forEach((q, index) => {
        const userAnswer = document.querySelector(`input[name="answer-${index}"]:checked`)?.value;
        const result = document.getElementById(`logic-result-${index}`);
        if (userAnswer === q.answer) {
            result.textContent = "إجابة صحيحة!";
            result.style.color = "green";
            score++;
        } else {
            result.textContent = "إجابة خاطئة!";
            result.style.color = "red";
        }
    });

    const finalResult = document.getElementById("logic-final-result");
    finalResult.textContent = `نتيجتك: ${score} من ${questions.length}`;
    finalResult.style.color = score === questions.length ? "green" : "red";
}
