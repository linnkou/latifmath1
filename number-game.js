function checkNumberAnswer() {
    const answer = document.getElementById('number-answer').value;
    const result = document.getElementById('number-result');
    if (answer == 7) {
        result.textContent = "إجابة صحيحة!";
        result.style.color = "green";
    } else {
        result.textContent = "إجابة خاطئة!";
        result.style.color = "red";
    }
}
