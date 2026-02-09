<?php

    header('Content-Type: application/json');

    //Include database connection file
    include 'db_connect.php';

    //Read JSON data sent from frontend
    $inData = json_decode(file_get_contents('php://input'), true);

    //SQL to delete a specific contact
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
    $stmt->bind_param("ii", $inData["id"], $inData["userId"]);

    //Execute and return JSON response
    if ($stmt->execute()) {
        echo json_encode(["error" => ""]);
    } else {
        echo json_encode(["error" => "Failed to delete contact: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();

?>