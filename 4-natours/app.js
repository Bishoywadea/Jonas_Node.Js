const print = console.log;
const express = require('express');
const fs = require('fs');
const app = express();

// "express.json()" is called middleware
app.use(express.json());

const tours = JSON.parse(
    fs.readFileSync('./dev-data/data/tours-simple.json')
);

// types of http methods:
// GET method is to read data
// POST to create new resource
// PUT to update the resource by sending the entire updated object
// PATCH to update the resource by sending only the updated part
// DELETE to delete but you must be authenticated

app.get('/api/v1/tours',(req,res)=>{
    res.status(200).json({
        status:'success',
        results:tours.length,
        data:{
            tours:tours
        }
    });
});

// this how to add variable to url
// id is a must but x is optional
app.get('/api/v1/tours/:id/:x?',(req,res)=>{

    const tour = tours.find(el=> el.id === (req.params.id*1));
    if(!tour){
        return res.status(404).json({
            status:'fail',
            message : 'not valid id'
        })
    }

    res.status(200).json({
        status:'success', 
        data :{
            tour:tour,
        }
    });
});

// the data from post method is not defined without
// Express but we must use middleware to be able to handle it 
// using .body
app.post('/api/v1/tours',(req,res)=>{
    // print(req.body);
    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id:newId},req.body);
    tours.push(newTour);

    fs.writeFile('./dev-data/data/tours-simple.json',JSON.stringify(tours),(err)=>{
        res.status(201).json({
            status:"success",
            data:{
                tour:newTour,
            }
        });
    })
});


app.patch('/api/v1/tours/:id',(req,res)=>{
    if((req.params.id*1)>tours.length){
        return res.status(404).json({
            status:'fail',
            message : 'not valid id'
        })
    }
    res.status(200).json({
        status:'success',
        data:{
            tour:'<updated tour here ....>'
        }
    })
});

app.delete('/api/v1/tours/:id',(req,res)=>{
    if((req.params.id*1)>tours.length){
        return res.status(404).json({
            status:'fail',
            message : 'not valid id'
        })
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
});

const port = 3000;
app.listen(port,()=>{
    print(`app running on port ${port}...`);
});

