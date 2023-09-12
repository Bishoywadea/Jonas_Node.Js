const fs = require('fs');
const http  = require('http');
const url  = require('url');

///////////////////////////////////////////
////////////Files Handling/////////////////
///////////////////////////////////////////
/*
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
*/

///////////////////////////////////////////
///////////////Servers/////////////////////
///////////////////////////////////////////

const replaceTemplate = (temp,product) => {
    // </{%PRODUCTNAME%}/g> this means to replace all the place holders not the first one
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

// the "." means the directory we are running the script from
// the "__dirname" means the current directory of the file
 /* we used the sync version because it will be executed one time 
 in the beginning instead of executed each time a response come  */
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((request,response)=>{
    //Note: Express is tool to handle complex routes in big project
    //console.log(request);
    const routeName = request.url;
    //note === means compare the value and the type
    // Overview page
    if(routeName==='/' || routeName === '/overview'){
        response.writeHead(200,{
            'Content-type': 'text/html'
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
        response.end(output);
    }
    // Product page
    else if (routeName === '/product'){
        response.end('this is the product');
    }
    // Api page
    else if (routeName === '/api'){
        response.writeHead(200,{
            'Content-type': 'application/json'
        });
        response.end(data);
    }
    // Notfound page
    else{
        //this to set the response status
        //the headers&status must be written before response itself
        response.writeHead(404,{
            'Content-type': 'text/html',
            'my-header': 'hello-world'
        });

        response.end('<h1>page not found!</h1>');
    }
});

//server.listen(portNumber,localHost,optionalFunction)
server.listen(8000,'127.0.0.1',()=>{
    console.log('listening request on port 8000');
})