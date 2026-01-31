-- Create Users Table
CREATE TABLE Users (
    ID INT NOT NULL AUTO_INCREMENT,
    DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DateLastLoggedIn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FirstName VARCHAR(50) NOT NULL DEFAULT '',
    LastName VARCHAR(50) NOT NULL DEFAULT '',
    Login VARCHAR(50) NOT NULL DEFAULT '',
    Password VARCHAR(255) NOT NULL DEFAULT '',
    PRIMARY KEY (ID),
    UNIQUE (Login)
) ENGINE=InnoDB;

-- Create Contacts Table
CREATE TABLE Contacts (
    ID INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL DEFAULT '',
    LastName VARCHAR(50) NOT NULL DEFAULT '',
    Phone VARCHAR(50) NOT NULL DEFAULT '',
    Email VARCHAR(50) NOT NULL DEFAULT '',
    UserID INT NOT NULL DEFAULT '0',
    DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID),
    FOREIGN KEY (UserID) REFERENCES Users(ID)
) ENGINE=InnoDB;

-- Insert Test Users
INSERT INTO Users (FirstName, LastName, Login, Password) VALUES 
('Rick', 'Leinecker', 'RickL', 'COP4331'),
('Sam', 'Smith', 'SamS', 'Sam123'),
('John', 'Doe', 'JohnD', 'John123');

-- Insert Test Contacts
INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES 
('Alice', 'Wonderland', '123-456-7890', 'alice@example.com', 1),
('Bob', 'Builder', '987-654-3210', 'bob@example.com', 1),
('Charlie', 'Chocolate', '555-555-5555', 'charlie@example.com', 3);