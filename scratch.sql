SELECT
  authors.name
FROM
  authors
JOIN
  book_authors
ON
  authors.id = book_authors.author_id
WHERE
  book_authors.book_id = 1;
