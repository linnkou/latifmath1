// تأثيرات الأزرار
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
    });
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
});

// وظيفة البحث
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query.length < 3) {
        alert('يرجى إدخال كلمة بحث تحتوي على 3 أحرف على الأقل.');
        return;
    }
    alert(`بحث عن: ${query}`);
});

// تسجيل الدخول
const loginButton = document.querySelector('.login-button');
if (loginButton) {
    loginButton.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}

// اختبار الجبر
const algebraTestForm = document.getElementById('algebraTestForm');
if (algebraTestForm) {
    algebraTestForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const q1 = document.querySelector('input[name="q1"]:checked');
        const q2 = document.querySelector('input[name="q2"]:checked');
        let score = 0;

        if (q1 && q1.value === 'b') score++;
        if (q2 && q2.value === 'b') score++;

        const result = document.getElementById('algebraResult');
        result.innerHTML = `نتيجتك: ${score} من 2`;
        result.style.color = score === 2 ? 'green' : 'red';
    });
}

// اختبار الهندسة
const geometryTestForm = document.getElementById('geometryTestForm');
if (geometryTestForm) {
    geometryTestForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const q1 = document.querySelector('input[name="q1"]:checked');
        const q2 = document.querySelector('input[name="q2"]:checked');
        let score = 0;

        if (q1 && q1.value === 'b') score++;
        if (q2 && q2.value === 'a') score++;

        const result = document.getElementById('geometryResult');
        result.innerHTML = `نتيجتك: ${score} من 2`;
        result.style.color = score === 2 ? 'green' : 'red';
    });
}

// تفاعل البطاقات
const testCards = document.querySelectorAll('.test-card');
testCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// إظهار الاختبارات عند النقر على الزر
const startAlgebraTest = document.getElementById('start-algebra-test');
if (startAlgebraTest) {
    startAlgebraTest.addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('algebra-test').style.display = 'block';
    });
}

const startGeometryTest = document.getElementById('start-geometry-test');
if (startGeometryTest) {
    startGeometryTest.addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('geometry-test').style.display = 'block';
    });
}

// تحسين تجربة تحميل الملفات
function toggleSubjects(levelId) {
    const subjects = document.getElementById(levelId);
    if (subjects.style.display === "none" || subjects.style.display === "") {
        subjects.style.display = "block";
    } else {
        subjects.style.display = "none";
    }
}

function uploadFile(level, subject) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx';
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('حجم الملف أكبر من المسموح به (5MB).');
                return;
            }
            alert(`تم رفع الملف: ${file.name} للمستوى: ${level} والعنوان: ${subject}`);
        }
    };
    fileInput.click();
}
