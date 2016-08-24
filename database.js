
const getBookGenres = function(bookId){
  const sql = `
    SELECT
      genres.name
    FROM
      genres
    JOIN
      book_genres
    ON
      genres.id = book_genres.genre_id
    WHERE
      book_genres.book_id = $1;
  `

  return sql  //Do we need to return [bookId]?
}

module.exports = {
  getBookGenres: getBookGenres
}
