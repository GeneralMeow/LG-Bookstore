# LG-Bookstore


## General Commands for local setup:

  1. Clone into git directory:
    
      ```
      git clone https://github.com/EthanJStark/LG-Bookstore.git
      ```
  
  2. Change into bookstore directory:
      
      ```
      cd LG-Bookstore
      ```
  3. Setup the database:
      We used homebrew to install postgres. There are two options for starting the postres server; this process chooses the automatic start up on login.
    
      ```
      > brew install postgres
      > brew services start postgresql
      > psql createdb bookstore
      > createdb bookstore
      > psql bookstore < schema.sql
      ```
      
      View our database schema:
      [schema!](screenshots/Screen Shot 2016-08-25 at 3.56.01 PM.png)
  
  3. Start Server:
      
      ```
      > npm start
      ```
  
  4. View our app by going to [The Bookstore](http://localhost:3000/) on your browser once you have started the server locally.

Thanks for checking out our bookstore app!
