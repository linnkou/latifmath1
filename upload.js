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

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

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

window.onload = () => {
    const token = localStorage.getItem('github-token');
    if (token) {
        document.getElementById('github-token').value = token;
        displayUploadedFiles(token);
    }
};
