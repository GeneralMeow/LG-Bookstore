const expect = require('expect.js')
const db = require('../database')

describe( 'bookGenresQuery', () => {
  it( 'returns a SQL string to obtain a specified book\'s genres', () => {
    expect( db.bookGenresQuery() ).to.eql(
      "SELECT genres.name FROM genres JOIN book_genres ON genres.id=book_genres.genre_id WHERE book_genres.book_id=$1;"
    )
  })
})