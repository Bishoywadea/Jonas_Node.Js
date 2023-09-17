const print = console.log;
const superagent = require('superagent');
const fs= require('fs')


//////////////////////////////
//////////CallBacks///////////
//////////////////////////////

// callBack Hell not good practice at all
/* fs.readFile('./dog.txt','utf-8',(err,data)=>{
    print(data);
    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, response) => {
        if (err) {
        console.error('Error:', err);
        } 
        else {
        print(response.body.message);
        fs.writeFile('./dog-image.txt', response.body.message, 'utf-8', (err) => {
            if (err) {
                print('Error saving the image:', err);
            } else {
                print('Image downloaded and saved:');
            }
        });
        }
    });
}); */


// create function to read file and return promise
const readFilePromise = file =>{
    return new Promise((resolvve,rejject) => {
        fs.readFile(file,'utf-8',(err,data)=>{
            if (err) {
            rejject('cant read file');
            }
            resolvve(data);
        })
    })
}

// create function to write file and return promise
const writeFilePromise = (fileName,content) =>{
    return new Promise((resolvve,rejject) => {
        fs.writeFile(fileName,content,'utf-8',(err)=>{
            if (err) {
            rejject('could not write file');
            }
            resolvve('Done Saving');
        })
    })
}

//////////////////////////////
//////////Promises////////////
//////////////////////////////

/*// flat chain structure of promises good for reading and good practice
readFilePromise('./dog.txt').then(data=>{
    print(data);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
    })
    .then(response=>{
        print(response.body.message);
        return writeFilePromise('./dog-image.txt',response.body.message)
    }).then(()=>{
        print('Saved');
    }).catch(err=>{
        console.error(err);
    }); */


//////////////////////////////
//////////Async&await/////////
//////////////////////////////
// Best Way 
const getDogPic = async ()=>{
    try{
    const data = await readFilePromise('./dog.txt');
    print(data);
    //we do this to make all the promises // to each other 
    //not one after another
    const response1Promise =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const response2Promise =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const response3Promise =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const all = await Promise.all([response1Promise,response2Promise,response3Promise]);
    const imgs = all.map(el=>el.body.message);
    print(imgs);

    await writeFilePromise('./dog-image.txt',imgs.join('\n'));
    print('Done Saving');
    }
    catch(err){
        print(err);
        throw(err);
    }
    return '2-Ready';
}

//this pattern is called immediately invoked function expression. (IIFE)
//to get return value from async function
(async()=>{
    try {
    print('1-i will get dog pics');
    const x= await getDogPic();
    print(x);
    print('3-Done getting dog pics');
    } catch (err) {
        print("ERROR 💣");
    }
})();

