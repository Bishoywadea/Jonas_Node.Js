const fs = require('fs');

const textIn = fs.readFileSync('./txt/input.txt','utf-8');
console.log(textIn);

const textOut = `this is the avoooocado: ${textIn} \non ${Date.now()}`;
fs.writeFileSync('./txt/output.txt',textOut);