const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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
    const token = process.env.GITHUB_TOKEN || process.env.EASYMATH; // قراءة التوكن من متغير البيئة

    if (!token) {
        console.error('لم يتم توفير GitHub Token.');
        console.error('يرجى تعيين التوكن باستخدام السر EASYMATH في GitHub Secrets.');
        process.exit(1); // إنهاء البرنامج
    }

    // إنشاء واجهة لإدخال المستخدم
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // طلب إدخال اسم الملف
    rl.question('أدخل اسم الملف الذي تريد رفعه: ', async (fileName) => {
        const filePath = path.join('./uploads', fileName); // المسار إلى الملف
        const year = 'first-year'; // المستوى الدراسي
        const fileType = 'monthly-grades'; // نوع الملف

        if (!fs.existsSync(filePath)) {
            console.error('الملف غير موجود:', filePath);
            rl.close();
            process.exit(1); // إنهاء البرنامج
        }

        try {
            // رفع الملف
            const downloadUrl = await uploadFileToGitHub(filePath, fileName, year, fileType, token);
            console.log(`تم رفع الملف بنجاح: ${downloadUrl}`);
        } catch (error) {
            console.error('حدث خطأ أثناء رفع الملف:', error.message);
        } finally {
            rl.close(); // إغلاق واجهة الإدخال
        }
    });
}

// تشغيل الدالة الرئيسية
main();
