let timeLeft = 30;
let timerId;

function startTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            alert("انتهى الوقت!");
        }
    }, 1000);
}

function checkFocusAnswer() {
    const answer = document.getElementById('focus-answer').value;
    const result = document.getElementById('focus-result');
    if (answer.toLowerCase() === "focus") {
        result.textContent = "إجابة صحيحة!";
        result.style.color = "green";
    } else {
        result.textContent = "إجابة خاطئة!";
        result.style.color = "red";
    }
}
