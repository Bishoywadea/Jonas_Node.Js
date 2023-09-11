const fs = require('fs');

// Blocking, synchtonous way
const textIn = fs.readFileSync('./txt/input.txt','utf-8');
console.log(textIn);
const textOut = `this is the avoooocado: ${textIn} \non ${Date.now()}`;
fs.writeFileSync('./txt/output.txt',textOut);

// NonBlocking, asynchtonous way
// CallBack HELL
fs.readFile('./txt/start.txt','utf-8', (err,data) =>{
    if(err) return console.log('cant find start.txt 💩');
    fs.readFile(`./txt/${data}.txt`,'utf-8', (err,data2) =>{
        console.log(data2);
        fs.readFile(`./txt/append.txt`,'utf-8', (err,data3) =>{
            console.log(data3);
            fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',err =>{
                console.log('the file is written 👌');
            });
        });
    });
});
console.log('async');

