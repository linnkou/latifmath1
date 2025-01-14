// دالة لتوليد اسم الملف باللغة العربية
function generateFileName(fileType, semester, index) {
    let fileName = '';
    switch (fileType) {
        case 'monthly-grades':
            fileName = `التدرجات`;
            break;
        case 'diagnostic-models':
            fileName = `تقويم_تشخيصي_${index + 1}`;
            break;
        case 'situations':
            fileName = `وضعية_${index + 1}`;
            break;
        case 'lesson-notes':
            fileName = `مذكرات_${index + 1}`;
            break;
        case 'guided-work':
            fileName = `عمل_موجه_${index + 1}`;
            break;
        case 'textbook-solutions':
            fileName = `حلول_التمارين_${index + 1}`;
            break;
        case 'homework':
            fileName = `فرض_${semester}_${index + 1}`;
            break;
        case 'exams':
            fileName = `اختبار_${semester}_${index + 1}`;
            break;
        case 'certificate':
            fileName = `شهادة_التعليم_${index + 1}`;
            break;
        default:
            fileName = `ملف_${fileType}_${index + 1}`;
    }
    return fileName;
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

// دالة لرفع الملفات إلى GitHub
async function uploadFilesToGitHub(files, year, fileType, semester, token) {
    const repoOwner = 'linnkou'; // اسم مستخدم GitHub
    const repoName = 'latifmath1'; // اسم المستودع
    const uploadPromises = Array.from(files).map(async (file, index) => {
        const fileName = generateFileName(fileType, semester, index);
        const path = `${year}/${fileType}/${fileName}.${file.name.split('.').pop()}`;
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`;
        const content = await toBase64(file);
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
            const errorData = await response.json();
            console.error('تفاصيل الخطأ:', errorData);
            throw new Error(`خطأ في الرفع: ${response.statusText}`);
        }
        const data = await response.json();
        return data.content.download_url;
    });
    return Promise.all(uploadPromises);
}

// معالجة رفع الملفات
document.getElementById('upload-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const token = localStorage.getItem('github-token');
    if (!token) {
        alert('يرجى تسجيل الدخول أولاً.');
        window.location.href = 'login.html';
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
        console.error(error);
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
        window.location.href = 'login.html';
    } else {
        document.getElementById('github-username').textContent = 'linnkou';
    }
};
