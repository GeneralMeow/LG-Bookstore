DROP DATABASE IF EXISTS bookstore;

DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  published VARCHAR(255) NOT NULL,
  image_link VARCHAR(255),
  description TEXT
);

DROP TABLE IF EXISTS genres;

CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS book_genres;

CREATE TABLE book_genres (
  book_id INTEGER PRIMARY KEY,
  genre_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS book_authors;

CREATE TABLE book_authors (
  book_id INTEGER PRIMARY KEY,
  author_id INTEGER NOT NULL
);

--Fixture Data

-- INSERT INTO
--   genres (name)
-- VALUES
--   ('Economics'),
--   ('Fantasy'),
--   ('Romance'),
--   ('Horror'),
--   ('Sci-Fi'),
--   ('Historical Drama');

-- INSERT INTO
--   books (title, published, fiction)
-- VALUES
--   ('blasd kdjsfkjsdf jsdkfksdf', now(), false),
--   ('blasd kdjsfkjsdf jsdkfksdf', now(), false),
--   ('blasd kdjsfkjsdf jsdkfksdf', now(), false),
--   ('blasd kdjsfkjsdf jsdkfksdf', now(), false),
--   ('blasd kdjsfkjsdf jsdkfksdf', now(), false),
--   ('blasd kdjsfkjsdf jsdkfksdf', now(), false),
--   ('blasd kdjsfkjsdf jsdkfksdf', now(), false),
--   ('blasd kdjsfkjsdf jsdkfksdf', now(), false);
