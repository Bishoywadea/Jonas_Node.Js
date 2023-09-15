const fs = require('fs')
const crypto = require('crypto')
const start = Date.now();
// to change number of thread pool
process.env.UV_THREADPOOL_SIZE = 1;

setImmediate(()=> console.log('Immediate1 callBack finshed'));
setTimeout(()=> console.log('timer1 callBack finshed'),0);

fs.readFile('test-file.txt',()=>{
    console.log('IO1 callBack finshed')

    console.log('----------event loop starts from here--------------')
    setTimeout(()=> console.log('timer2 callBack finshed'),0);
    setImmediate(()=> console.log('Immediate2 callBack finshed'));
    setTimeout(()=> console.log('timer3 callBack finshed'),3000);
    process.nextTick(()=>console.log('process.nextTick'));

    //process done in threadpool not event loop
    crypto.pbkdf2('password','salt',100000,1024,'sha512',()=>{
        console.log(Date.now()-start,'password encrypted');
    });
    crypto.pbkdf2('password','salt',100000,1024,'sha512',()=>{
        console.log(Date.now()-start,'password encrypted');
    });
    crypto.pbkdf2('password','salt',100000,1024,'sha512',()=>{
        console.log(Date.now()-start,'password encrypted');
    });
    crypto.pbkdf2('password','salt',100000,1024,'sha512',()=>{
        console.log(Date.now()-start,'password encrypted');
    });

    /* EVENT LOOP ORDER OF EXECUTION PROCESSES
        1-> expired timer callbacks
        2-> I/O polling and callbacks
        3-> setimmediate callbacks
        4-> close callbacks
        5->  if (thier is any process) {start again} 
             else {close the program}
        note: process.nextTick && microTasks is exeucted after the current queue is finshed 
    */
});

console.log('Top level code')