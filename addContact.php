<?php

    header('Content-Type: application/json');
    
    //Include database connection file
    include 'db_connect.php'; 
    require_once 'contact_schema.php';
    ensureFavoriteColumn($conn);

    //Read JSON data sent from frontend
    $inData = json_decode(file_get_contents('php://input'), true);

    //SQL to add a specific contact
    $isFavorite = !empty($inData["isFavorite"]) ? 1 : 0;
    $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID, IsFavorite) VALUES (?,?,?,?,?,?)");
    $stmt->bind_param("ssssii", $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["userId"], $isFavorite);

    //Execute and return JSON response
    if ($stmt->execute()) {
        echo json_encode(["error" => ""]);
    } else {
        echo json_encode(["error" => "Failed to add contact: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();

?>
