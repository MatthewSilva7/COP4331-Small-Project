<?php

    //Database credentials
    $host = "localhost";
    $dbName = "smallproj";
    $dbUser = "smallproj_user";
    $dbPass = "smallproj_pass";
    $port = 3308; // XAMPP MySQL port temp for now

    //Establish connection
    $conn = @new mysqli($host, $dbUser, $dbPass, $dbName, $port);

    //Check for errors
    if ($conn->connect_error) {
        header('Content-Type: application/json');
        echo json_encode([
            "error" => "Connection failed",
            "details" => $conn->connect_error
        ]);
        exit;
    }

?>
