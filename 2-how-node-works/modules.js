const print = console.log;

/* print(arguments);
print(require('module').wrapper); */

// module.exports example
const Calculator = require('./test1');
const calc1 = new Calculator(); 
print(calc1.add(1,3));

// exports example
const calc2 = require('./test2');
const {multiply,add,divide} = require('./test2');
print(calc2.add(1,4));
print(add(1,4));
print(divide(1,4));

// caching example
require('./test3')();
require('./test3')();
require('./test3')();
