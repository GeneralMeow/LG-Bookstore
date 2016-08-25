const express = require('express')
const db = require( '../database' )

const router = express.Router()

router.get('/', (request, response, next) => {

  db.getBookGenres( 2 )
    .then( genres => response.render('index', { genres }) )
    .catch( error => {
      console.log( error )
      response.send( error )
    })
})

router.get('/books/:bookId', (request, response, next) => {

  db.getBookAndAuthorsAndGenresByBookId(request.params.bookId)
    .catch(renderError(response))
    .then((book) => {
      response.render('books/show', {
        book: book
      })
      // console.log('book: ', book)
    })
    .catch(renderError(response))
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
