const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// دالة لرفع الملف إلى GitHub
async function uploadFileToGitHub(filePath, fileName, year, fileType, token) {
    const repoOwner = 'linnkou'; // اسم مستخدم GitHub الخاص بك
    const repoName = 'latifmath1'; // اسم المستودع
    const fileContent = fs.readFileSync(filePath, { encoding: 'base64' }); // قراءة الملف وتحويله إلى Base64

    // المسار في المستودع
    const filePathInRepo = `${year}/${fileType}/${fileName}`;
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePathInRepo}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `رفع ملف: ${fileName}`,
                content: fileContent
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('تفاصيل الخطأ:', errorData);
            throw new Error(`خطأ في الرفع: ${response.statusText}`);
        }

        const data = await response.json();
        return data.content.download_url; // رابط التحميل
    } catch (error) {
        console.error('حدث خطأ أثناء رفع الملف:', error.message);
        throw error;
    }
}

// دالة رئيسية لتشغيل البرنامج
async function main() {
    const token = process.env.GITHUB_TOKEN; // قراءة التوكن من متغير البيئة

    if (!token) {
        console.error('لم يتم توفير GitHub Token.');
        process.exit(1); // إنهاء البرنامج
    }

    // تحديد الملفات المطلوب رفعها
    const uploadFolder = './uploads'; // المسار إلى المجلد
    const year = 'first-year'; // المستوى الدراسي
    const fileType = 'monthly-grades'; // نوع الملف

    // التحقق من وجود المجلد
    if (!fs.existsSync(uploadFolder)) {
        console.error('المجلد غير موجود:', uploadFolder);
        process.exit(1); // إنهاء البرنامج
    }

    // قراءة جميع الملفات في المجلد
    const files = fs.readdirSync(uploadFolder);

    if (files.length === 0) {
        console.error('لا توجد ملفات في المجلد:', uploadFolder);
        process.exit(1); // إنهاء البرنامج
    }

    // رفع كل ملف
    for (const file of files) {
        const filePath = path.join(uploadFolder, file); // المسار الكامل إلى الملف
        const fileName = path.basename(file); // اسم الملف

        try {
            // رفع الملف
            const downloadUrl = await uploadFileToGitHub(filePath, fileName, year, fileType, token);
            console.log(`تم رفع الملف بنجاح: ${downloadUrl}`);
        } catch (error) {
            console.error(`حدث خطأ أثناء رفع الملف ${fileName}:`, error.message);
        }
    }
}

// تشغيل الدالة الرئيسية
main();
