<?php
header('Content-Type: application/json');

// 1) Read JSON request body
$inData = getRequestInfo();

$firstName = trim($inData["firstName"] ?? "");
$lastName  = trim($inData["lastName"] ?? "");
$login     = trim($inData["login"] ?? "");
$password  = $inData["password"] ?? "";

// 2) Basic validation
if ($firstName === "" || $lastName === "" || $login === "" || $password === "") {
    returnWithError("Missing required fields");
    exit();
}

// 3) Connect to DB
require_once __DIR__ . "/../db_connect.php";

// 4) Check if login already exists
$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();
if ($result && $result->num_rows > 0) {
    $stmt->close();
    $conn->close();
    returnWithError("Login already exists");
    exit();
}
$stmt->close();

// 5) Hash password (do NOT store plain text)
$hashed = password_hash($password, PASSWORD_DEFAULT);

// 6) Insert new user
$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?,?,?,?)");
$stmt->bind_param("ssss", $firstName, $lastName, $login, $hashed);

if ($stmt->execute()) {
    $newId = $stmt->insert_id;
    $stmt->close();
    $conn->close();
    returnWithInfo($firstName, $lastName, $newId);
} else {
    $stmt->close();
    $conn->close();
    returnWithError("Database error");
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    echo $obj;
}

function returnWithError($err)
{
    $retValue = json_encode([
        "id" => 0,
        "firstName" => "",
        "lastName" => "",
        "error" => $err
    ]);
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id)
{
    $retValue = json_encode([
        "id" => (int) $id,
        "firstName" => $firstName,
        "lastName" => $lastName,
        "error" => ""
    ]);
    sendResultInfoAsJson($retValue);
}
