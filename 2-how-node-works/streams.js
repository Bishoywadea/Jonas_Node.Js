const print = console.log;
const http = require('http');
const fs = require('fs');
const server = http.createServer();

server.on('request',(req,res)=>{
    // Solution 1 (load all the file in the memory)
    // not good if the file is big and many users 
    // usually the serves will crash
    // can't use it in production  
    /* fs.readFile('./test-file.txt',(err,data)=>{
        if(err){
            print(`can\'t read file ❌ because ${err}`);
        }
        print('file read Done ✔');
        res.end(data);
    }) */

    // Solution 2: Streams
    // has problem called backPressure
    // it is caused due to reading file on desk
    // is much more faster than sending result on network
    /* const readable = fs.createReadStream('./test-file.txt');
    readable.on('data',pieceOfData=>{
        res.write(pieceOfData);
        print('part is streamed');
    });

    readable.on('end',()=>{
        res.end();
        print('stream is finshed');

    })
    readable.on('error',(err)=>{
        print(err);
        res.statusCode = 500;
        res.end('File Not Found');
    }) */

    // Solution 3: Streams using pipes
    // best practice
    const readable = fs.createReadStream('./test-file.txt');
    //readableSource.pipe(writeableDest) 
    readable.pipe(res);
});


server.listen(8000,'127.0.0.1',()=>{
    print('waiting for requests ⏳');
})