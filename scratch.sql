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

test function:

getBookById(4).then( data => console.log(data))

loadGenresForBookIds([1,2,3,4]).then( data => console.log(data))
