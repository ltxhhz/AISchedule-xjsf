const fs = require('fs');
let str = fs.readFileSync('./providerResult.txt').toString()
const cheerio = require('cheerio');
eval(fs.readFileSync('./src/强智教务/新疆师范大学/parser.js').toString())
console.log(scheduleHtmlParser(str))