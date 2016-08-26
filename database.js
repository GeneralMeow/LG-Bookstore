const pgp = require( 'pg-promise' )()
const connection = { database: 'bookstore' }
const db = pgp( connection )

const PAGE_SIZE = 10

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
 `SELECT * FROM books LIMIT ${PAGE_SIZE} OFFSET $1;`

const insertBookQuery = () =>
  `INSERT INTO books( title, published, thumbnail, description ) VALUES ($1, $2, $3, $4) RETURNING id`

const insertBookGenre = () =>
  `INSERT INTO book_genres( book_id, genre_id ) VALUES ( $1, $2 )`

const insertBookAuthor = () =>
  `INSERT INTO book_authors( book_id, author_id ) VALUES ( $1, $2 )`

const createBook = data => {
  const { title, published, thumbnail, description, genre_id, author_id } = data

  return db.one( insertBookQuery(), [ title, published, thumbnail, description ] )
    .then( result => {
      const { id } = result

      return Promise.all([
        new Promise( (resolve, reject) => resolve( id ) ),
        db.any( insertBookGenre(), [id, genre_id] ),
        db.any( insertBookAuthor(), [id, author_id] )
      ])
    })
    .then( results => results[ 0 ] )
}

const getAllBooks = (page) => {
  const offset = ( page-1 ) * PAGE_SIZE
  return db.any( getAllQuery(offset), [offset] )
    .then(loadAuthorsAndGenresForBooks)
}

const getAllGenres = () => {
  return db.any( 'SELECT * FROM genres' )
}

const loadAuthorsAndGenresForBooks = (books) => {
  const bookIds = books.map(book => book.id)

  return Promise.all([
    loadAuthorsForBookIds(bookIds),
    loadGenresForBookIds(bookIds),
  ])
  .catch( error => console.log( error ))
  .then(results => {
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

const searchForBooks = ( search_query, genres, page ) => {
  let variables = []
  let sql = `SELECT DISTINCT(books.*) FROM books`

  let whereConditions = []

  if( genres.length > 0 ) {
    sql += ` LEFT JOIN book_genres ON book_genres.book_id=books.id`

    variables.push( genres )
    whereConditions.push( ` book_genres.genre_id IN ($${variables.length}:csv)` )
  }

  if( search_query.length > 0 ) {
    sql += ` LEFT JOIN book_authors ON book_authors.book_id=books.id
      LEFT JOIN authors ON authors.id=book_authors.author_id`

    variables.push( search_query.toLowerCase()
      .replace(/^ */, '%')
      .replace(/ *$/, '%')
      .replace(/ +/g, '%')
    )

    whereConditions.push(
      ` (LOWER(books.title) LIKE $${variables.length} OR
      LOWER(authors.name) LIKE $${variables.length})`
    )
  }

  if( whereConditions.length > 0 ) {
    sql += ` WHERE ${whereConditions.join(' AND ')}`
  }

  variables.push( ( page - 1 ) * PAGE_SIZE )
  sql += ` LIMIT ${PAGE_SIZE} OFFSET $${variables.length}`

  console.log('SQL --->', sql, variables)

  return db.any( sql, variables )
    .catch( error => console.log( error ) )
    .then( books => loadAuthorsAndGenresForBooks( books ))
}

const getAllAuthorsAndGenres = () => {
  return Promise.all([
    db.any( 'SELECT * FROM authors' ),
    db.any( 'SELECT * FROM genres' )
  ]).then( results => { return { authors: results[ 0 ], genres: results[ 1 ] } })
}

module.exports = {
  getBookGenres, bookGenresQuery, getBookAuthors, bookAuthorsQuery,
  getBookAndAuthorsAndGenresByBookId, loadAuthorsAndGenresForBooks,
  loadGenresForBookIds, loadAuthorsForBookIds, getAllQuery, getAllBooks,
  searchForBooks, getAllGenres, createBook, getAllAuthorsAndGenres
}
