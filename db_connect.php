<?php

    //Database credentials
    $host = "localhost";
    $dbName = "smallproj";
    $dbUser = "smallproj_user";
    $dbPass = "smallproj_pass";

    //Establish connection
    $conn = new mysqli($host, $dbUser, $dbPass, $dbName);

    // Check for errors
    if ($conn->connect_error) {
        header('Content-Type: application/json');
        echo json_encode([
            "error" => "Connection failed",
            "details" => $conn->connect_error
        ]);
        exit;
    }

?>