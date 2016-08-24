var expect = require('expect.js');
const database = require('../database')

import { getBookGenres } from '../database'

describe('LG-Bookstore', function() {
  describe('getBookGenres', function() {
    it('should return SQL String with a table of genres that match a book id', function() {
      const bookId = 1
      const expectedString = "SELECT genres.name FROM genres JOIN book_genres ON genres.id book_genres.genre_id WHERE book_genres.book_id = " + bookId + ";"
      expect(getBookGenres(bookId).to.eql(expectedString))
    });
  });
});
