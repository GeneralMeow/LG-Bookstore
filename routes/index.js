const express = require('express')
const db = require( '../database' )

const router = express.Router()

router.get('/', (request, response, next) => {
  let page = parseInt(request.query.page, 10);
  if (isNaN(page)) page = 1;

  db.getAllBooks(page)
  .catch(renderError(response))
  .then(function(books){
    response.render('books/index', {
      page: page,
      books: books
    })
  })
  .catch(function(error){
    throw error
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
