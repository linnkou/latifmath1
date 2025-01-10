<?php
session_start();
if (!isset($_SESSION['admin'])) {
    die("غير مصرح لك بالوصول إلى هذه الصفحة.");
}

require_once 'db_connect.php';

$conn = connectToDatabase();

// استعلام لاسترجاع الملفات المرفوعة
$result = $conn->query("SELECT * FROM uploaded_files WHERE status = 'pending'");

// معالجة الموافقة على الملف
if (isset($_GET['approve'])) {
    $fileId = $_GET['approve'];
    $stmt = $conn->prepare("UPDATE uploaded_files SET status = 'approved' WHERE id = ?");
    $stmt->bind_param("i", $fileId);
    if ($stmt->execute()) {
        echo "<script>alert('تمت الموافقة على الملف بنجاح.');</script>";
    } else {
        echo "<script>alert('حدث خطأ أثناء الموافقة على الملف.');</script>";
    }
    $stmt->close();
}

// معالجة رفض الملف
if (isset($_GET['reject'])) {
    $fileId = $_GET['reject'];
    $stmt = $conn->prepare("DELETE FROM uploaded_files WHERE id = ?");
    $stmt->bind_param("i", $fileId);
    if ($stmt->execute()) {
        echo "<script>alert('تم رفض الملف بنجاح.');</script>";
    } else {
        echo "<script>alert('حدث خطأ أثناء رفض الملف.');</script>";
    }
    $stmt->close();
}
?>
<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة الملفات</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="main-title">
            <h1>إدارة الملفات</h1>
        </div>
        <nav>
            <a href="index.html">الرئيسية</a>
            <a href="admin.php" class="active">إدارة الملفات</a>
            <a href="login.html" class="login-button">تسجيل الدخول</a>
        </nav>
    </header>

    <div class="admin-section">
        <h2>الملفات المرفوعة قيد الانتظار</h2>
        <?php if ($result->num_rows > 0) : ?>
            <?php while ($row = $result->fetch_assoc()) : ?>
                <div class="file-item">
                    <p>اسم الملف: <?php echo $row['file_name']; ?></p>
                    <p>المستوى: <?php echo $row['level']; ?></p>
                    <p>العنوان: <?php echo $row['subject']; ?></p>
                    <div class="file-actions">
                        <a href="approve_file.php?id=<?php echo $row['id']; ?>">موافقة</a>
                        <a href="reject_file.php?id=<?php echo $row['id']; ?>">رفض</a>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php else : ?>
            <p style="color: #ff0000; font-weight: bold;">لا توجد ملفات قيد الانتظار.</p>
        <?php endif; ?>
    </div>

    <footer>
        <div class="footer-content">
            <p>&copy; 2025 الرياضيات السهلة - جميع الحقوق محفوظة</p>
            <div class="social-links">
                <a href="#"><i class="fab fa-facebook"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
            </div>
        </div>
    </footer>
</body>
</html>
<?php
$conn->close();
?>
