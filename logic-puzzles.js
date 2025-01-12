function checkAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    const result = document.getElementById('result');

    if (!selectedOption) {
        result.textContent = 'يرجى اختيار إجابة.';
        result.style.color = 'red';
        return;
    }

    if (selectedOption.value === '15') {
        result.textContent = 'إجابة صحيحة! عمر أحمد هو 15 سنة.';
        result.style.color = 'green';
    } else {
        result.textContent = 'إجابة خاطئة! حاول مرة أخرى.';
        result.style.color = 'red';
    }
}

// يمكنك إضافة المزيد من الوظائف هنا إذا لزم الأمر
