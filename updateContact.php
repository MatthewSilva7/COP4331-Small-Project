<?php

    header('Content-Type: application/json');

    //Include database connection file
    include 'db_connect.php';

    //Read JSON data sent from frontend
    $inData = json_decode(file_get_contents('php://input'), true);

    //SQL to update a specific contact
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
    $stmt->bind_param("ssssii", $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["id"], $inData["userId"]);
    
    //Execute and return JSON response
    if ($stmt->execute()) {
        echo json_encode(["error" => ""]);
    } else {
        echo json_encode(["error" => "Failed to update contact: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();

?>