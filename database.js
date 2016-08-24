const pgp = require( 'pg-promise' )()
const connection = { database: 'bookstore' }
const db = pgp( connection )

const bookGenresQuery = () =>
 `SELECT genres.name FROM genres JOIN book_genres ON genres.id=book_genres.genre_id WHERE book_genres.book_id=$1;`

const getBookGenres = bookId => {
  return db.any( bookGenresQuery(), [ bookId ] )
}

module.exports = {
  getBookGenres, bookGenresQuery
}
