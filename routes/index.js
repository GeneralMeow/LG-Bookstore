const express = require('express')
const db = require( '../database' )

const router = express.Router()

router.get('/', (request, response, next) => {
  const page = parseInt( request.query.page ) || 1
  const search_query = request.query.search
  const genres = request.query.genres || []

  const bookQuery = search_query || genres.length > 0 ?
    db.searchForBooks( search_query, genres, page ) :
    db.getAllBooks( page )

  Promise.all([ db.getAllGenres(), bookQuery ])
  .then( results => {
    const genres = results[ 0 ]
    const books = results[ 1 ]

    response.render( 'books/index', { page, books, genres } )
  })
  .catch( renderError( response ) )
})

router.get( '/books/add', (request, response) => {
  db.getAllAuthorsAndGenres()
    .then( result => response.render( 'books/add_book', { authors: result.authors, genres: result.genres } ) )
    .catch( error => response.send({ error, message: error.message }))
})

router.get('/books/:bookId', (request, response, next) => {

  db.getBookAndAuthorsAndGenresByBookId(request.params.bookId)
    .catch(renderError(response))
    .then((book) => {
      response.render('books/show', {
        book: book
      })
    })
    .catch(renderError(response))
})

router.post( '/books', (request, response) => {
  const book = request.body
  
  db.createBook( book )
    .then( id => response.redirect( `/books/${id}` ))
    .catch( error => renderError( error ))
})

const renderError = function(response){
  return function(error){
    response.status(500).render('error',{
      error: error
    })
    throw error
  }
}

module.exports = router
