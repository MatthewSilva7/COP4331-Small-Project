<?php
header('Content-Type: application/json');

// 1) Read JSON request body
$inData = getRequestInfo();

$login    = trim($inData["login"] ?? "");
$password = $inData["password"] ?? "";

// 2) Basic validation
if ($login === "" || $password === "") {
    returnWithError();
    exit();
}

// 3) Connect to DB
require_once __DIR__ . "/../db_connect.php";

// 4) Look up user by login
$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login=?");
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

if (!$result || $result->num_rows === 0) {
    $stmt->close();
    $conn->close();
    returnWithError();
    exit();
}

$row = $result->fetch_assoc();
$stmt->close();

// 5) Verify password (handles both hashed and legacy plain-text for test data)
$storedHash = $row["Password"];
$passwordValid = false;

if (password_get_info($storedHash)["algo"]) {
    // Stored value looks like a hash - use password_verify
    $passwordValid = password_verify($password, $storedHash);
} else {
    // Legacy plain-text (e.g. from schema test data)
    $passwordValid = ($password === $storedHash);
}

if (!$passwordValid) {
    $conn->close();
    returnWithError();
    exit();
}

// 6) Optional: update DateLastLoggedIn
$stmt = $conn->prepare("UPDATE Users SET DateLastLoggedIn = CURRENT_TIMESTAMP WHERE ID=?");
$stmt->bind_param("i", $row["ID"]);
$stmt->execute();
$stmt->close();
$conn->close();

// 7) Return success
returnWithInfo($row["FirstName"], $row["LastName"], (int) $row["ID"]);

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    echo $obj;
}

function returnWithError()
{
    $retValue = json_encode([
        "id" => 0,
        "firstName" => "",
        "lastName" => ""
    ]);
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id)
{
    $retValue = json_encode([
        "id" => $id,
        "firstName" => $firstName,
        "lastName" => $lastName
    ]);
    sendResultInfoAsJson($retValue);
}
