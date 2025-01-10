<?php
session_start();
if (!isset($_SESSION['user'])) {
    die("غير مصرح لك بالوصول إلى هذه الصفحة.");
}

require_once 'db_connect.php';

$conn = connectToDatabase();

// مجلد حفظ الملفات
$uploadDirectory = "./uploads/";

// التحقق من وجود الملف المرسل
if ($_FILES["file"]["error"] === UPLOAD_ERR_OK) {
    $fileName = basename($_FILES["file"]["name"]);
    $level = $_POST["level"];
    $subject = $_POST["subject"];
    $uploadFilePath = $uploadDirectory . $level . "/" . $fileName;

    // إنشاء مجلد المستوى إذا لم يكن موجودًا
    if (!is_dir($uploadDirectory . $level)) {
        mkdir($uploadDirectory . $level, 0777, true);
    }

    // نقل الملف إلى المجلد المحدد
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $uploadFilePath)) {
        // إدخال معلومات الملف في قاعدة البيانات
        $stmt = $conn->prepare("INSERT INTO uploaded_files (file_name, file_path, level, subject) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $fileName, $uploadFilePath, $level, $subject);
        if ($stmt->execute()) {
            echo "<script>alert('تم رفع الملف بنجاح وانتظار الموافقة.'); window.location.href = 'upload-files.html';</script>";
        } else {
            echo "<script>alert('حدث خطأ أثناء حفظ معلومات الملف.'); window.location.href = 'upload-files.html';</script>";
        }
        $stmt->close();
    } else {
        echo "<script>alert('حدث خطأ أثناء رفع الملف.'); window.location.href = 'upload-files.html';</script>";
    }
} else {
    echo "<script>alert('لم يتم رفع أي ملف أو حدث خطأ.'); window.location.href = 'upload-files.html';</script>";
}

$conn->close();
?>
