<?php
header('Content-Type: application/json');

// 1) Read JSON request body
$inData = getRequestInfo();

$userId = (int) ($inData["userId"] ?? 0);
$search  = trim($inData["search"] ?? "");

// 2) Require at least userId (whose contacts to search)
if ($userId <= 0) {
    returnWithError("User ID required");
    exit();
}

// 3) Connect to DB
require_once __DIR__ . "/../db_connect.php";

// 4) Search contacts for this user (FirstName, LastName, Phone, Email)
$searchPattern = "%{$search}%";
$stmt = $conn->prepare(
    "SELECT ID, FirstName, LastName, Phone, Email, DateCreated FROM Contacts 
     WHERE UserID = ? AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)
     ORDER BY FirstName, LastName"
);
$stmt->bind_param("issss", $userId, $searchPattern, $searchPattern, $searchPattern, $searchPattern);
$stmt->execute();
$result = $stmt->get_result();

$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = [
        "id"        => (int) $row["ID"],
        "firstName" => $row["FirstName"],
        "lastName"  => $row["LastName"],
        "phone"     => $row["Phone"],
        "email"     => $row["Email"],
        "dateCreated" => $row["DateCreated"]
    ];
}

$stmt->close();
$conn->close();

returnWithResult($contacts);

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
    sendResultInfoAsJson(json_encode(["error" => $err]));
}

function returnWithResult($contacts)
{
    sendResultInfoAsJson(json_encode(["contacts" => $contacts, "error" => ""]));
}
