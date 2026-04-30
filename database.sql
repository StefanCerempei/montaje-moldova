CREATE DATABASE IF NOT EXISTS montaj_db;
USE montaj_db;

CREATE TABLE IF NOT EXISTS users (
                                     id INT PRIMARY KEY AUTO_INCREMENT,
                                     type ENUM('client', 'montator') NOT NULL,
    nume VARCHAR(50) NOT NULL,
    prenume VARCHAR(50) NOT NULL,
    telefon VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    parola VARCHAR(255) NOT NULL,
    adresa TEXT,
    idnp VARCHAR(13),
    salariu_total DECIMAL(10,2) DEFAULT 0
    );

CREATE TABLE IF NOT EXISTS comenzi (
                                       id INT PRIMARY KEY AUTO_INCREMENT,
                                       client_id INT NOT NULL,
                                       montator_id INT DEFAULT NULL,
                                       locatie VARCHAR(255) NOT NULL,
    oras VARCHAR(100) NOT NULL,
    nume_client VARCHAR(100),
    telefon_client VARCHAR(20),
    status ENUM('asteapta', 'asignata', 'finalizata') DEFAULT 'asteapta',
    semnatura TEXT,
    data_creare TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (montator_id) REFERENCES users(id)
    );

-- Adaugă utilizatori de test (opțional)
INSERT INTO users (type, nume, prenume, telefon, email, parola, idnp)
VALUES ('montator', 'Popa', 'Andrei', '069123456', 'andrei@montaj.md', '123', '1234567890123');

INSERT INTO users (type, nume, prenume, telefon, email, parola, adresa)
VALUES ('client', 'Ionescu', 'Ana', '068123456', 'ana@client.md', '123', 'Str. Stefan cel Mare 10, Chisinau');