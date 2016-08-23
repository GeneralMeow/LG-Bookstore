var books = require('google-books-search');
var fs = require("fs")

var options = {
    // field: 'title',
    // offset: 0,
    limit: 40,
    type: 'books',
    order: 'relevance',
    lang: 'en'
};

books.search("the", options, function(error, results, apiResponse) {
    if ( ! error ) {
        // console.log(results);
        fs.writeFile("query1.json", JSON.stringify(results), "utf8", yourCallback )
    } else {
        console.log(error);
    }
});
