function checkAnswer() {
    const answer = document.getElementById('answer').value;
    const result = document.getElementById('result');
    if (answer === '5') {
        result.textContent = 'إجابة صحيحة!';
        result.style.color = 'green';
    } else {
        result.textContent = 'إجابة خاطئة!';
        result.style.color = 'red';
    }
}
