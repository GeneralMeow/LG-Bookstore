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

const getAuthorsForBookIdsQuery = (bookIds) =>
 `SELECT authors.*, book_authors.book_id FROM authors JOIN book_authors ON book_authors.author_id = authors.id WHERE book_authors.book_id IN ($1:csv)`

const loadAuthorsForBookIds = (bookIds) => {
  return db.any( getAuthorsForBookIdsQuery(bookIds), [bookIds] )
}

const getGenresForBookIdsQuery = (bookIds) =>
 `SELECT genres.*, book_genres.book_id FROM genres JOIN book_genres ON book_genres.genre_id = genres.id WHERE book_genres.book_id IN ($1:csv)`

const loadGenresForBookIds = (bookIds) => {
  return db.any( getGenresForBookIdsQuery(bookIds), [bookIds] )
}

const getAllQuery = (offset) =>
 `SELECT * FROM books LIMIT 10 OFFSET $1;`

const getAllBooks = (page) => {
  const offset = ( page-1 ) * 10
  return db.any( getAllQuery(offset), [offset] )
    .then(loadAuthorsAndGenresForBooks)
}

const loadAuthorsAndGenresForBooks = (books) => {
  const bookIds = books.map(book => book.id)
  return Promise.all([
    loadAuthorsForBookIds(bookIds),
    loadGenresForBookIds(bookIds),
  ]).then(results => {
    const authors = results[0]
    const genres = results[1]
    books.forEach(book => {
      book.authors = authors.filter(author => author.book_id === book.id)
      book.genres = genres.filter(genre => genre.book_id === book.id)
    })
    return books
  })
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
  getBookGenres, bookGenresQuery, getBookAuthors, bookAuthorsQuery, getBookAndAuthorsAndGenresByBookId, loadAuthorsAndGenresForBooks, loadGenresForBookIds, loadAuthorsForBookIds, getAllQuery, getAllBooks
}
