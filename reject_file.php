<?php
session_start();
if (!isset($_SESSION['admin'])) {
    die("غير مصرح لك بالوصول إلى هذه الصفحة.");
}

require_once 'db_connect.php';

$conn = connectToDatabase();

if (isset($_GET['id'])) {
    $fileId = $_GET['id'];
    $stmt = $conn->prepare("DELETE FROM uploaded_files WHERE id = ?");
    $stmt->bind_param("i", $fileId);

    if ($stmt->execute()) {
        header("Location: admin.php?message=تم رفض الملف بنجاح.");
    } else {
        header("Location: admin.php?message=حدث خطأ أثناء رفض الملف.");
    }

    $stmt->close();
} else {
    header("Location: admin.php");
}

$conn->close();
?>
