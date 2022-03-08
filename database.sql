CREATE DATABASE groupomania;
USE groupomania;
CREATE TABLE commentaires (id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT, nom TEXT, idproduit INT(11), date TEXT, commentaire TEXT, utilisateur TEXT);
CREATE TABLE forum (id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT, utilisateur TEXT, contenu TEXT, type TEXT, date TEXT, nom TEXT);
CREATE TABLE inscription (id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT, nom TEXT, email TEXT, motdepasse TEXT, derniereparticipation TEXT);