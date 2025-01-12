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

searchButton?.addEventListener('click', () => {
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

// إظهار الاختبارات عند النقر على الزر
document.getElementById('start-algebra-test')?.addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('algebra-test').style.display = 'block';
});

document.getElementById('start-geometry-test')?.addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('geometry-test').style.display = 'block';
});

document.getElementById('start-statistics-test')?.addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('statistics-test').style.display = 'block';
});

// تقييم اختبار الجبر
document.getElementById('algebraTestForm')?.addEventListener('submit', function (e) {
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

// تقييم اختبار الهندسة
document.getElementById('geometryTestForm')?.addEventListener('submit', function (e) {
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

// تقييم اختبار الإحصاء
document.getElementById('statisticsTestForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    let score = 0;

    if (q1 && q1.value === 'a') score++;
    if (q2 && q2.value === 'b') score++;

    const result = document.getElementById('statisticsResult');
    result.innerHTML = `نتيجتك: ${score} من 2`;
    result.style.color = score === 2 ? 'green' : 'red';
});

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

// إظهار أو إخفاء قائمة المواد
function toggleSubjects(levelId) {
    const subjects = document.getElementById(levelId);
    if (subjects.style.display === "none" || subjects.style.display === "") {
        subjects.style.display = "block";
    } else {
        subjects.style.display = "none";
    }
}

// رفع الملف إلى GitHub
document.getElementById('upload-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const year = document.getElementById('year').value;
    const section = document.getElementById('section').value;
    const fileName = document.getElementById('file-name').value;
    const file = document.getElementById('file-upload').files[0];

    console.log("السنة:", year); // تحقق من قيمة السنة
    console.log("القسم:", section); // تحقق من قيمة القسم
    console.log("اسم الملف:", fileName); // تحقق من اسم الملف
    console.log("الملف:", file); // تحقق من الملف

    if (!file) {
        alert('يرجى اختيار ملف.');
        return;
    }

    if (!fileName) {
        alert('يرجى إدخال اسم الملف.');
        return;
    }

    const message = document.getElementById('message');
    message.textContent = 'جاري رفع الملف...';

    try {
        const downloadUrl = await uploadFileToGitHub(file, fileName, year, section);
        console.log("تم رفع الملف بنجاح:", downloadUrl); // تحقق من رابط التحميل
        message.innerHTML = `تم رفع الملف بنجاح: <a href="${downloadUrl}" target="_blank">${fileName}</a>`;
    } catch (error) {
        console.error("حدث خطأ أثناء رفع الملف:", error); // تحقق من الخطأ
        message.textContent = 'حدث خطأ أثناء رفع الملف: ' + error.message;
    }
});

async function uploadFileToGitHub(file, fileName, year, section) {
    const token = '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'; // الرمز المميز الخاص بك
    const repoOwner = 'linnkou'; // اسم مستخدم GitHub الخاص بك
    const repoName = 'latifmath1'; // اسم المستودع
    const path = `${year}/${section}/${fileName}`; // المسار في المستودع

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`;

    const content = await toBase64(file); // تحويل الملف إلى Base64

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `رفع ملف: ${fileName}`,
            content: content
        })
    });

    if (!response.ok) {
        throw new Error(`خطأ في الرفع: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content.download_url; // رابط التحميل
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}
