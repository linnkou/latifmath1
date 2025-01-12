function checkAnswer() {
    const answer = document.getElementById('answer').value;
    const result = document.getElementById('result');
    if (answer == 5) {
        result.textContent = "إجابة صحيحة! أحسنت!";
        result.style.color = "green";
    } else {
        result.textContent = "إجابة خاطئة، حاول مرة أخرى!";
        result.style.color = "red";
    }
}
