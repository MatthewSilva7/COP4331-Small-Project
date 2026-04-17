<?php

    header('Content-Type: application/json');

    //Include database connection file
    include 'db_connect.php';
    require_once 'contact_schema.php';
    ensureFavoriteColumn($conn);

    //Read JSON data sent from frontend
    $inData = json_decode(file_get_contents('php://input'), true);

    //SQL to update a specific contact
    $isFavorite = !empty($inData["isFavorite"]) ? 1 : 0;
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=?, IsFavorite=? WHERE ID=? AND UserID=?");
    $stmt->bind_param("ssssiii", $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $isFavorite, $inData["id"], $inData["userId"]);
    
    //Execute and return JSON response
    if ($stmt->execute()) {
        echo json_encode(["error" => ""]);
    } else {
        echo json_encode(["error" => "Failed to update contact: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();

?>
