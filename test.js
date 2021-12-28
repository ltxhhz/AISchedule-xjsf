const fs = require('fs');
let str = fs.readFileSync('./providerResult.txt').toString()
const cheerio = require('cheerio');
eval(fs.readFileSync('./parser.js').toString())
console.log(scheduleHtmlParser(str))