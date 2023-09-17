const print = console.log;
const express = require('express');

const app = express();

app.get('/',(req,res)=>{
    res.status(200);
    res.json({message:'Hello from the server i hear the get',number:'1'});
});

app.post('/',(req,res)=>{
    res.status(200);
    res.json({message:'Hello from the server i hear the post',number:'1'});
})

const port = 3000;
app.listen(port,()=>{
    print(`app running on port ${port}...`);
});

