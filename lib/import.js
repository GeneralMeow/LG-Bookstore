const _ = require( 'lodash' )
const pgp = require( 'pg-promise' )()

const books = require( '../query' )

var connection = { database: 'bookstore' }
var db = pgp( connection )

const authors = _.uniq( books.reduce(
  (memo, book) => book.authors ? memo.concat( book.authors ) : memo, []
))
const author_values = authors.map( a => `('${a}')` ).join( ', ' )

db.any(`INSERT INTO authors (name) VALUES ${author_values};`)
  .then( data => pgp.end() )
  .catch( error => pgp.end() )

const genres = _.uniq( books.reduce(
  (memo, book) => book.genres ? memo.concat( book.genres ) : memo, []
))
const genre_values = genres.map( a => `('${a}')` ).join( ', ' )

db.any(`INSERT INTO genres (name) VALUES ${genre_values};`)
  .then( data => pgp.end() )
  .catch( error => pgp.end() )

const book_values = books.map( book =>
  `('${book.title}', '${book.published}', '${book.thumbnail}', '${book.description || ""}')`
).join( ', ' )

const book_query = `INSERT INTO books( title, published, thumbnail, description ) VALUES ${book_values};`

db.any( book_query )
  .then( data => pgp.end() )
  .catch( error => {
    console.log( error )
    pgp.end()
  })

const book_genres = books.map( (book, index) => {
  const indeces = ( book.genres || [] ).map( genre => genres.indexOf( genre ) + 1 )

  return indeces.map( genreIndex => `(${index + 1}, ${genreIndex})` ).join( ', ' )
})
db.any(`INSERT INTO book_genres( book_id, genre_id ) VALUES ${book_genres};` )
  .then( data => pgp.end() )
  .catch( error => pgp.end() )

const book_authors = books.map( (book, index) => {
  const indeces = ( book.authors || [] ).map( genre => authors.indexOf( genre ) + 1 )

  return indeces.map( authorIndex => `(${index + 1}, ${authorIndex})` ).join( ', ' )
})

db.any(`INSERT INTO book_authors( book_id, author_id ) VALUES ${book_authors};`)
  .then( data => pgp.end() )
  .catch( error => pgp.end() )
