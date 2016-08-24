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

module.exports = router
