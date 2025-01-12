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

// دالة لرفع الملف إلى GitHub
async function uploadFileToGitHub(file, fileName, year, fileType, token) {
    const repoOwner = 'linnkou'; // اسم مستخدم GitHub الخاص بك
    const repoName = 'latifmath1'; // اسم المستودع
    const path = `${year}/${fileType}/${fileName}`; // المسار في المستودع

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
        const errorData = await response.json(); // تحقق من استجابة API
        console.error('تفاصيل الخطأ:', errorData);
        throw new Error(`خطأ في الرفع: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content.download_url; // رابط التحميل
}

// دالة لتحويل الملف إلى Base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

// دالة لجلب الملفات المرفوعة من GitHub
async function fetchUploadedFiles(token) {
    const repoOwner = 'linnkou'; // اسم مستخدم GitHub الخاص بك
    const repoName = 'latifmath1'; // اسم المستودع

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `token ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`خطأ في جلب الملفات: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

// دالة لعرض الملفات المرفوعة
async function displayUploadedFiles(token) {
    const filesList = document.getElementById('files-list');
    filesList.innerHTML = 'جاري تحميل الملفات...';

    try {
        const files = await fetchUploadedFiles(token);
        filesList.innerHTML = files.map(file => `
            <div class="file-item">
                <a href="${file.download_url}" target="_blank">${file.name}</a>
            </div>
        `).join('');
    } catch (error) {
        filesList.innerHTML = 'حدث خطأ أثناء جلب الملفات: ' + error.message;
    }
}

// معالجة رفع الملفات
document.getElementById('upload-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const year = document.getElementById('year').value;
    const fileType = document.getElementById('file-type').value;
    const fileName = document.getElementById('file-name').value;
    const file = document.getElementById('file-upload').files[0];
    const token = document.getElementById('github-token').value; // الحصول على التوكن

    if (!file) {
        alert('يرجى اختيار ملف.');
        return;
    }

    if (!fileName) {
        alert('يرجى إدخال اسم الملف.');
        return;
    }

    if (!token) {
        alert('يرجى إدخال GitHub Token.');
        return;
    }

    const message = document.getElementById('message');
    message.textContent = 'جاري رفع الملف...';

    try {
        const downloadUrl = await uploadFileToGitHub(file, fileName, year, fileType, token);
        message.innerHTML = `تم رفع الملف بنجاح: <a href="${downloadUrl}" target="_blank">${fileName}</a>`;
        displayUploadedFiles(token); // تحديث قائمة الملفات بعد الرفع
    } catch (error) {
        console.error(error); // عرض تفاصيل الخطأ في الكونسول
        message.textContent = 'حدث خطأ أثناء رفع الملف: ' + error.message;
    }
});

// عرض الملفات عند تحميل الصفحة (إذا كان التوكن مخزنًا في localStorage)
window.onload = () => {
    const token = localStorage.getItem('github-token');
    if (token) {
        document.getElementById('github-token').value = token;
        displayUploadedFiles(token);
    }
};
