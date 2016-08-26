# LG-Bookstore

## Setting up the database
I used homebrew to install postgres.  There are two options for starting the postres server; this process chooses the automatic start up on login.

```
> brew install postgres
> brew services start postgresql
> psql createdb bookstore
> createdb bookstore
> psql bookstore < schema.sql
```

Database Schema:
[schema!](screenshots/Screen Shot 2016-08-25 at 3.56.01 PM.png)
