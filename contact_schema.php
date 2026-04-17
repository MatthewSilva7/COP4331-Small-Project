<?php

function ensureFavoriteColumn(mysqli $conn): void
{
    $result = $conn->query("SHOW COLUMNS FROM Contacts LIKE 'IsFavorite'");
    if ($result && $result->num_rows > 0) {
        $result->close();
        return;
    }

    if ($result) {
        $result->close();
    }

    $conn->query("ALTER TABLE Contacts ADD COLUMN IsFavorite TINYINT(1) NOT NULL DEFAULT 0 AFTER UserID");
}

?>
