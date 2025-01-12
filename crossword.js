function checkCrosswordAnswers() {
    const answer1 = document.getElementById('crossword-answer-0').value;
    const result1 = document.getElementById('crossword-result-0');
    if (answer1 === '2') {
        result1.textContent = 'إجابة صحيحة!';
        result1.style.color = 'green';
    } else {
        result1.textContent = 'إجابة خاطئة!';
        result1.style.color = 'red';
    }

    const answer2 = document.getElementById('crossword-answer-1').value;
    const result2 = document.getElementById('crossword-result-1');
    if (answer2 === '4') {
        result2.textContent = 'إجابة صحيحة!';
        result2.style.color = 'green';
    } else {
        result2.textContent = 'إجابة خاطئة!';
        result2.style.color = 'red';
    }
}
