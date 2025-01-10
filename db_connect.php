<?php
session_start();
if (!isset($_SESSION['admin'])) {
    die("غير مصرح لك بالوصول إلى هذه الصفحة.");
}

require_once 'db_connect.php';

$conn = connectToDatabase();

if (isset($_GET['id'])) {
    $fileId = $_GET['id'];
    $stmt = $conn->prepare("UPDATE uploaded_files SET status = 'approved' WHERE id = ?");
    $stmt->bind_param("i", $fileId);

    if ($stmt->execute()) {
        header("Location: admin.php?message=تمت الموافقة على الملف بنجاح.");
    } else {
        header("Location: admin.php?message=حدث خطأ أثناء الموافقة على الملف.");
    }

    $stmt->close();
} else {
    header("Location: admin.php");
}

$conn->close();
?>
