"use strict"

const linkedInScraper = require('./lib/scraper.js')

//query method will be accessible via like so linkedIn.query()
// exporting the query function that is inside of our scraper.js file

module.exports.query = (queryObject) => {
    return linkedInScraper.query(queryObject)
}


