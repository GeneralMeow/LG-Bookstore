const pgp = require( 'pg-promise' )()
const connection = { database: 'bookstore' }
const db = pgp( connection )

const bookGenresQuery = () =>
 `SELECT genres.name FROM genres JOIN book_genres ON genres.id=book_genres.genre_id WHERE book_genres.book_id=$1;`

const getBookGenres = bookId => {
  return db.any( bookGenresQuery(), [ bookId ] )
}

const bookAuthorsQuery = () =>
 `SELECT authors.name FROM authors JOIN book_authors ON authors.id=book_authors.author_id WHERE book_authors.book_id=$1;`

const getBookAuthors = bookId => {
  return db.any( bookAuthorsQuery(), [ bookId ] )
}

const getBookQuery = () =>
 `SELECT * FROM books WHERE id=$1;`

const getBookById = bookId => {
  return db.one( getBookQuery(), [bookId] )
}

const getBookAndAuthorsAndGenresByBookId = (bookId) => {
  return Promise.all([
    getBookById(bookId),
    getBookAuthors(bookId),
    getBookGenres(bookId),
  ])
  .catch(function(error){
    console.log(error)
    throw error;
  })
  .then(function(results){
    const book = results[0]
    const authors = results[1]
    const genres = results[2]

    book.authors = authors
    book.genres = genres
    return book;
  })
}

module.exports = {
  getBookGenres, bookGenresQuery, getBookAuthors, bookAuthorsQuery, getBookAndAuthorsAndGenresByBookId
}
