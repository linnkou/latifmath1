<?php
session_start();
if (!isset($_SESSION['user'])) {
    die("غير مصرح لك بالوصول إلى هذه الصفحة.");
}

require_once 'db_connect.php';

$conn = connectToDatabase();

// استرجاع المستوى والعنوان من الرابط
$level = isset($_GET['level']) ? $_GET['level'] : '';
$subject = isset($_GET['subject']) ? $_GET['subject'] : '';

// استعلام لاسترجاع الملفات المعتمدة
$stmt = $conn->prepare("SELECT * FROM uploaded_files WHERE level = ? AND subject = ? AND status = 'approved'");
$stmt->bind_param("ss", $level, $subject);
$stmt->execute();
$result = $stmt->get_result();
?>
<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>عرض الملفات المعتمدة</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="main-title">
            <h1>عرض الملفات المعتمدة</h1>
        </div>
        <nav>
            <a href="index.html">الرئيسية</a>
            <a href="upload-files.html">رفع الملفات</a>
            <a href="login.html" class="login-button">تسجيل الدخول</a>
        </nav>
    </header>

    <div class="view-files-section">
        <h2>الملفات المعتمدة</h2>
        <?php if ($result->num_rows > 0) : ?>
            <?php while ($row = $result->fetch_assoc()) : ?>
                <a href="<?php echo $row['file_path']; ?>" class="file-link" download>
                    <?php echo $row['file_name']; ?>
                </a>
            <?php endwhile; ?>
        <?php else : ?>
            <p>لا توجد ملفات معتمدة لهذا العنوان.</p>
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
$stmt->close();
$conn->close();
?>
