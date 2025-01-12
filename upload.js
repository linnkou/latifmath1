// دالة لرفع الملف إلى GitHub
async function uploadFileToGitHub(file, fileName, year, section, token) {
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
    const section = document.getElementById('section').value;
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
        const downloadUrl = await uploadFileToGitHub(file, fileName, year, section, token);
        message.innerHTML = `تم رفع الملف بنجاح: <a href="${downloadUrl}" target="_blank">${fileName}</a>`;
        displayUploadedFiles(token); // تحديث قائمة الملفات بعد الرفع
    } catch (error) {
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
