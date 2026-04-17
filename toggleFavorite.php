<?php

header('Content-Type: application/json');

include 'db_connect.php';
require_once 'contact_schema.php';
ensureFavoriteColumn($conn);

$inData = json_decode(file_get_contents('php://input'), true);
$isFavorite = !empty($inData["isFavorite"]) ? 1 : 0;

$stmt = $conn->prepare("UPDATE Contacts SET IsFavorite=? WHERE ID=? AND UserID=?");
$stmt->bind_param("iii", $isFavorite, $inData["id"], $inData["userId"]);

if ($stmt->execute()) {
    echo json_encode(["error" => ""]);
} else {
    echo json_encode(["error" => "Failed to update favorite: " . $stmt->error]);
}

$stmt->close();
$conn->close();

?>
