/* 1. Birthyear */

SELECT *
FROM movies 
WHERE year=1997;

/* 2. 1982 */
    /*  
        Count: https://www.sqltutorial.org/sql-aggregate-functions/sql-count/ 
    */

SELECT COUNT(*) AS total 
FROM movies 
WHERE year=1982;

/* 3. Stacktors */
    /*  
        Like: https://www.sqltutorial.org/sql-like/ 
    */

SELECT *
FROM actors
WHERE last_name LIKE '%stack%';

/* 4. Fame Name Game */
    /*  
        Group By: https://www.sqltutorial.org/sql-group-by/
        Lower: https://www.sqltutorial.org/sql-string-functions/sql-lower/
        Order By: https://www.sqltutorial.org/sql-order-by/
        Limit: https://www.sqltutorial.org/sql-limit/
    */

SELECT first_name, last_name, COUNT(*) AS total
FROM actors
GROUP BY LOWER(first_name), LOWER(last_name)
ORDER BY total DESC
LIMIT 10;

/* 5. Prolific */
    /*
        Join: https://www.dofactory.com/sql/join
        As: https://www.sqltutorial.org/sql-alias/
        On: https://www.geeksforgeeks.org/sql-on-clause/
    */

SELECT a.first_name, a.last_name, COUNT(*) AS total
FROM actors AS a
JOIN roles AS r ON a.id = r.actor_id
GROUP BY a.id
ORDER BY total DESC
LIMIT 100;

/* 6. Bottom of the Barrel */

SELECT genre, COUNT(*) AS total
FROM movies_genres
GROUP BY genre
ORDER BY total;

/* 7. Braveheart */

SELECT a.first_name, a.last_name
FROM actors AS a
JOIN roles AS r ON r.actor_id = a.id
JOIN movies AS m ON r.movie_id = m.id
WHERE m.name = 'Braveheart' AND m.year = 1995
ORDER BY a.last_name, a.first_name;

/* 8. Leap Noir */

SELECT d.first_name, d.last_name, m.name, m.year
FROM directors AS d
JOIN movies_directors AS md ON md.director_id = d.id
JOIN movies AS m ON m.id = md.movie_id
JOIN movies_genres AS mg ON m.id = mg.movie_id
WHERE mg.genre = 'Film-Noir' AND m.year % 4 = 0
ORDER BY m.name;

/* 9.° Bacon */

SELECT a.first_name, a.last_name
FROM actors AS a
JOIN roles AS r ON a.id = r.actor_id
JOIN movies AS m ON r.movie_id = m.id
JOIN movies_genres AS mg ON m.id = mg.movie_id
WHERE mg.genre = 'Drama' AND m.id IN (
    SELECT r.movie_id
    FROM roles AS r
    JOIN actors AS a ON r.actor_id = a.id
    WHERE a.first_name = 'Kevin' AND a.last_name = 'Bacon'
)
AND (a.first_name || ' ' || a.last_name != 'Kevin Bacon');

/* 10. Immortal Actors */

SELECT *
FROM actors
WHERE id IN (
    SELECT r.actor_id
    FROM roles AS r
    JOIN movies AS m ON r.movie_id = m.id
    WHERE m.year < 1900
) AND id IN (
    SELECT r.actor_id
    FROM roles AS r
    JOIN movies AS m ON r.movie_id = m.id
    WHERE m.year > 2000
);

/* 11. Busy Filming */

SELECT a.first_name, a.last_name, COUNT(DISTINCT(role)) AS total
FROM roles AS r
JOIN actors AS a ON r.actor_id = a.id
JOIN movies AS m ON r.movie_id = m.id
WHERE m.year > 1990
GROUP BY actor_id, movie_id
HAVING total > 5;

/* 12. ♀ */

SELECT year, COUNT(DISTINCT id) AS total
FROM movies
WHERE id NOT IN (
    SELECT movie_id
    FROM roles AS r
    JOIN actors AS a ON r.actor_id = a.id
    WHERE a.gender = 'M'
)
GROUP BY year;
