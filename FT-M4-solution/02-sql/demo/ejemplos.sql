create table personas (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   nombre TEXT NOT NULL,
   apellido TEXT,
   ciudad INTEGER,
   FOREIGN KEY(ciudad) REFERENCES ciudades(id)
);


create table ciudades (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   nombre TEXT NOT NULL
);

## .tables
## .schema personas

INSERT INTO ciudades (nombre) VALUES ('Tucuman');
INSERT INTO ciudades (nombre) VALUES ('Buenos Aires');
INSERT INTO ciudades (nombre) VALUES ('New York');
INSERT INTO ciudades (nombre) VALUES ('Caracas');
INSERT INTO ciudades (nombre) VALUES ('Santa Cruz');
INSERT INTO ciudades (nombre) VALUES ('Maracaibo');

INSERT INTO personas (nombre, apellido, ciudad)
VALUES ('Toni', 'Tralice', 1);
INSERT INTO personas (nombre, apellido, ciudad)
VALUES ('Nepo', 'Neme', 1);
INSERT INTO personas (nombre, apellido, ciudad)
VALUES ('Romi', 'Moyano', 3);
INSERT INTO personas (nombre, apellido, ciudad)
VALUES ('Santi', 'Scanlan', 2);
INSERT INTO personas (nombre, apellido, ciudad)
VALUES ('Ceci', 'Schrupp', 4);
INSERT INTO personas (nombre, apellido, ciudad)
VALUES ('Luis', 'Pinki', 5);

INSERT INTO personas (nombre, apellido, ciudad)
VALUES ('Solano', 'Palacio', 99);

SELECT * from personas;
SELECT * from ciudades;

SELECT * FROM personas
  ORDER BY apellido;

SELECT * FROM personas
  ORDER BY nombre;

SELECT * FROM personas
  WHERE nombre = 'Toni';

SELECT * FROM personas
  WHERE nombre = 'Toni'
  AND apellido = 'Tralice';

SELECT * from personas
JOIN ciudades
  ON ciudades.id = personas.ciudad;

SELECT p.nombre, p.apellido, c.nombre  from personas p
JOIN ciudades c
  ON c.id = p.ciudad;

SELECT p.nombre, p.apellido, c.nombre  from personas p
JOIN ciudades c
  ON c.id = p.ciudad
WHERE apellido = 'Neme';

SELECT p.nombre, p.apellido, c.nombre  from personas p
JOIN ciudades c
  ON c.id = p.ciudad
ORDER BY c.nombre;

SELECT p.nombre, p.apellido, c.nombre  from personas p
LEFT JOIN ciudades c
  ON c.id = p.ciudad
ORDER BY c.nombre;

SELECT per.nombre, per.apellido, c.nombre  from ciudades c
LEFT JOIN personas per
  ON c.id = per.ciudad
WHERE per.ciudad IS NULL
ORDER BY c.nombre;

SELECT p.nombre, p.apellido, c.nombre  from personas p
JOIN ciudades c
  ON c.id != p.ciudad;


INSERT INTO personas (nombre, apellido, ciudad)
  VALUES ('Luis', 'Pinki', 5);

SELECT * from personas
LEFT JOIN ciudades
  ON ciudades.id = personas.ciudad;



