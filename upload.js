// دالة لتحويل الملف إلى صيغة Base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // تجاهل الجزء "data:"
        reader.onerror = (error) => reject(error);
    });
}

// دالة لتحديد آخر رقم مستخدم
async function getLastFileIndex(repoOwner, repoName, fileType, year, token) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${year}/${fileType}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                // إذا كان المجلد غير موجود
                return 0;
            }
            const errorData = await response.json();
            console.error('تفاصيل الخطأ:', errorData);
            throw new Error(`خطأ أثناء قراءة الملفات: ${response.statusText}`);
        }

        const data = await response.json();
        const fileNames = data.map(file => file.name);
        const indices = fileNames
            .map(name => parseInt(name.match(/_(\d+)\./)?.[1])) // استخراج الأرقام
            .filter(Number.isFinite); // تصفية الأرقام الصحيحة فقط

        return indices.length > 0 ? Math.max(...indices) : 0; // أكبر رقم موجود
    } catch (error) {
        console.error('خطأ أثناء تحديد آخر رقم:', error);
        return 0;
    }
}

// دالة لتوليد اسم الملف باللغة العربية
function generateFileName(fileType, semester, index) {
    let fileName = '';
    switch (fileType) {
        case 'monthly-grades':
            fileName = `التدرجات`;
            break;
        case 'diagnostic-models':
            fileName = `تقويم_تشخيصي_${index}`;
            break;
        case 'situations':
            fileName = `وضعية_${index}`;
            break;
        case 'lesson-notes':
            fileName = `مذكرات_${index}`;
            break;
        case 'guided-work':
            fileName = `عمل_موجه_${index}`;
            break;
        case 'textbook-solutions':
            fileName = `حلول_التمارين_${index}`;
            break;
        case 'homework':
            fileName = `فرض_${semester}_${index}`;
            break;
        case 'exams':
            fileName = `اختبار_${semester}_${index}`;
            break;
        case 'certificate':
            fileName = `شهادة_التعليم_${index}`;
            break;
        default:
            fileName = `ملف_${fileType}_${index}`;
    }
    return fileName;
}

// دالة لرفع الملفات إلى GitHub
async function uploadFilesToGitHub(files, year, fileType, semester, token) {
    const repoOwner = 'linnkou'; // اسم مستخدم GitHub
    const repoName = 'latifmath1'; // اسم المستودع
    const lastIndex = await getLastFileIndex(repoOwner, repoName, fileType, year, token);
    let currentIndex = lastIndex;

    const uploadPromises = Array.from(files).map(async (file) => {
        currentIndex += 1; // الترقيم المستمر
        const path = `${year}/${fileType}/${file.name}`; // استخدام الاسم الأصلي للملف
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`;
        
        const content = await toBase64(file);
        
        console.log('البيانات قبل الرفع:', { path, contentPreview: content.slice(0, 50) });

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `رفع ملف: ${file.name}`, // استخدام الاسم الأصلي في الرسالة
                content: content
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('تفاصيل الخطأ من API:', errorData);
            throw new Error(`خطأ في الرفع: ${response.statusText}, التفاصيل: ${errorData.message || 'غير متوفرة'}`);
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
        message.innerHTML = `تم رفع الملفات بنجاح:${downloadUrls.map(url => `${url}`).join('')}`;
    } catch (error) {
        console.error(error);
        message.textContent = 'حدث خطأ أثناء رفع الملفات: ' + error.message;
    }
});
