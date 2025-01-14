// دالة لتوليد اسم الملف تلقائيًا (بدون تاريخ)
function generateFileName(fileType, semester, index) {
    let fileName = '';

    switch (fileType) {
        case 'monthly-grades':
            fileName = `التدرجات_الشهرية`;
            break;
        case 'homework':
            fileName = `فرض_${semester}_${index + 1}`;
            break;
        case 'exams':
            fileName = `اختبار_${semester}_${index + 1}`;
            break;
        default:
            fileName = `ملف_${fileType}_${index + 1}`;
    }

    return fileName;
}

// دالة لرفع الملفات إلى GitHub
async function uploadFilesToGitHub(files, year, fileType, semester, token) {
    const repoOwner = 'linnkou'; // اسم مستخدم GitHub الخاص بك
    const repoName = 'latifmath1'; // اسم المستودع

    // تحويل FileList إلى مصفوفة
    const filesArray = Array.from(files); // أو استخدام [...files]

    const uploadPromises = filesArray.map(async (file, index) => {
        const fileName = generateFileName(fileType, semester, index);
        const path = `${year}/${fileType}/${fileName}.${file.name.split('.').pop()}`; // المسار في المستودع

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
    });

    return Promise.all(uploadPromises); // رفع جميع الملفات بشكل متوازي
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

// معالجة رفع الملفات
document.getElementById('upload-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const token = localStorage.getItem('github-token');
    if (!token) {
        alert('يرجى تسجيل الدخول أولاً.');
        window.location.href = 'login.html'; // إعادة توجيه إلى صفحة تسجيل الدخول
        return;
    }

    const year = document.getElementById('year').value;
    const fileType = document.getElementById('file-type').value;
    const semester = document.getElementById('semester').value;
    const files = document.getElementById('file-upload').files;

    if (files.length === 0) {
        alert('يرجى اختيار ملفات.');
        return;
    }

    const message = document.getElementById('message');
    message.textContent = 'جاري رفع الملفات...';

    try {
        const downloadUrls = await uploadFilesToGitHub(files, year, fileType, semester, token);
        message.innerHTML = `تم رفع الملفات بنجاح:<br>${downloadUrls.map(url => `<a href="${url}" target="_blank">${url}</a><br>`).join('')}`;
    } catch (error) {
        console.error(error); // عرض تفاصيل الخطأ في الكونسول
        message.textContent = 'حدث خطأ أثناء رفع الملفات: ' + error.message;
    }
});

// دالة لتسجيل الخروج
function logout() {
    localStorage.removeItem('github-token');
    window.location.href = 'login.html';
}

// عرض اسم المستخدم عند تحميل الصفحة
window.onload = () => {
    const token = localStorage.getItem('github-token');
    if (!token) {
        alert('يرجى تسجيل الدخول أولاً.');
        window.location.href = 'login.html'; // إعادة توجيه إلى صفحة تسجيل الدخول
    } else {
        document.getElementById('github-username').textContent = 'linnkou'; // عرض اسم مستخدم GitHub
    }
};
