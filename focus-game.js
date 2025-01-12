function checkFocusAnswer() {
    const answer = document.getElementById('focus-answer').value;
    const result = document.getElementById('focus-result');
    if (answer.toLowerCase() === 'التركيز') {
        result.textContent = 'إجابة صحيحة!';
        result.style.color = 'green';
    } else {
        result.textContent = 'إجابة خاطئة!';
        result.style.color = 'red';
    }
}
