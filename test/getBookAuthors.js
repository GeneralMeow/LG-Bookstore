const expect = require('expect.js')
const db = require('../database')

describe( 'bookAuthorsQuery', () => {
  it( 'returns a SQL string to obtain a specified book\'s authors', () => {
    expect( db.bookAuthorsQuery() ).to.eql(
      "SELECT authors.name FROM authors JOIN book_authors ON authors.id=book_authors.author_id WHERE book_authors.book_id=$1;"
    )
  })
})
