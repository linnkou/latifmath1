<?php
require_once 'db_connect.php';

function isAdmin() {
    session_start();
    return isset($_SESSION['admin']) && $_SESSION['admin'] === true;
}

function getApprovedFiles($level, $subject) {
    $conn = connectToDatabase();
    $stmt = $conn->prepare("SELECT * FROM uploaded_files WHERE level = ? AND subject = ? AND status = 'approved'");
    $stmt->bind_param("ss", $level, $subject);
    $stmt->execute();
    return $stmt->get_result();
}

function getPendingFiles() {
    $conn = connectToDatabase();
    $result = $conn->query("SELECT * FROM uploaded_files WHERE status = 'pending'");
    return $result;
}

function uploadFile($file, $level, $subject) {
    $conn = connectToDatabase();
    $uploadDirectory = "./uploads/";

    if (!is_dir($uploadDirectory . $level)) {
        mkdir($uploadDirectory . $level, 0777, true);
    }

    $fileName = basename($file["name"]);
    $uploadFilePath = $uploadDirectory . $level . "/" . $fileName;

    if (move_uploaded_file($file["tmp_name"], $uploadFilePath)) {
        $stmt = $conn->prepare("INSERT INTO uploaded_files (file_name, file_path, level, subject) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $fileName, $uploadFilePath, $level, $subject);
        if ($stmt->execute()) {
            return true;
        }
    }
    return false;
}

function approveFile($fileId) {
    $conn = connectToDatabase();
    $stmt = $conn->prepare("UPDATE uploaded_files SET status = 'approved' WHERE id = ?");
    $stmt->bind_param("i", $fileId);
    return $stmt->execute();
}

function rejectFile($fileId) {
    $conn = connectToDatabase();
    $stmt = $conn->prepare("DELETE FROM uploaded_files WHERE id = ?");
    $stmt->bind_param("i", $fileId);
    return $stmt->execute();
}

function getFilesByStatus($status) {
    $conn = connectToDatabase();
    $stmt = $conn->prepare("SELECT * FROM uploaded_files WHERE status = ?");
    $stmt->bind_param("s", $status);
    $stmt->execute();
    return $stmt->get_result();
}

function loadApprovedFiles($level, $subject) {
    $files = getApprovedFiles($level, $subject);
    $fileList = [];
    if ($files->num_rows > 0) {
        while ($row = $files->fetch_assoc()) {
            $fileList[] = $row;
        }
    }
    return $fileList;
}
?>
