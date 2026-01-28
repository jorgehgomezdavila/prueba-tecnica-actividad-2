/*
 * Actividad 2 - PokeAPI Explorer
 * Autor: Jorge Humberto Gomez De Avila (DESARROLLADOR FULLSTACK)
 * Base de Datos: MySQL
 * Descripción: Persistencia de historial de búsqueda y paginación.
 */

-- 1. Crear Base de Datos
CREATE DATABASE IF NOT EXISTS PokeDB;
USE PokeDB;

-- 2. Tabla de Auditoría de Búsquedas
CREATE TABLE IF NOT EXISTS PokemonSearchHistory (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    SearchTerm VARCHAR(100) NULL COMMENT 'Nombre o Tipo buscado',
    LimitParam INT NOT NULL COMMENT 'Cantidad de items solicitados',
    OffsetParam INT NOT NULL COMMENT 'Desplazamiento de paginación',
    DateAccessed DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Prueba de inserción
INSERT INTO PokemonSearchHistory (SearchTerm, LimitParam, OffsetParam, DateAccessed)
VALUES ('ALL', 20, 0, NOW());

SELECT * FROM PokemonSearchHistory;