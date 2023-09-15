const EventEmitter = require('events')
const http = require('http')
class Sales extends EventEmitter{
    constructor(){
        super();
    }
}

const myEmitter = new Sales();

myEmitter.on('newSale',()=>{
    console.log('newSale event received');
})

myEmitter.on('newSale',()=>{
    console.log('newSale event received part2');
})

myEmitter.on('newSale',(number)=>{
    console.log(`newSale event received with number ${number}`);
})

myEmitter.emit('newSale',9);

////////////////////////////////////////

const server = http.createServer();

//note:YOu cant send more than one response

server.on('request',(request,response)=>{
    console.log('request received');
    response.end('Request Received')
});

server.on('request',(request,response)=>{
    console.log('request received with emoji 💀');
});

server.on('close',()=>{
    console.log('server closed');
});

server.listen(8000,'127.0.0.1',()=>{
    console.log('waiting for requests')
});