const print = console.log;
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const app = express();

//////////////////////////////
/////////MIDDLEWARES//////////
//////////////////////////////

app.use(morgan('dev'));

// "express.json()" is called middleware
// this "use" function is to add middleware to the stack
// that will be applied to every request
app.use(express.json());

// this is our custom middleware
app.use((req, res, next) => {
  print('hello from the middleware in the begin of program');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

//////////////////////////////
/////////ROUTEHANDLERS////////
//////////////////////////////

// types of http methods:
// GET method is to read data
// POST to create new resource
// PUT to update the resource by sending the entire updated object
// PATCH to update the resource by sending only the updated part
// DELETE to delete but you must be authenticated

const getAllTours = (req, res) => {
  print(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  const tour = tours.find((el) => el.id === req.params.id * 1);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'not valid id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

// the data from post method is not defined without
// Express but we must use middleware to be able to handle it
// using .body
const createTour = (req, res) => {
  // print(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'not valid id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here ....>',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'not valid id',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this is not defined",
  })
};

const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this is not defined",
  })
};

const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this is not defined",
  })
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this is not defined",
  })
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this is not defined",
  })
};

//////////////////////////////
////////////ROUTES////////////
//////////////////////////////

/* app.get('/api/v1/tours', getAllTours);
// this how to add variable to url
// id is a must but x is optional
app.get('/api/v1/tours/:id/:x?',getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);
 */

const tourRouter = express.Router();
const userRouter = express.Router();

// it is calling mounting the routers
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);

tourRouter.route('/').get(getAllTours).post(createTour);
app.use((req, res, next) => {
  print('hello from the middleware after get all tours and createTour');
  next();
});
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

//////////////////////////////
////////STARTSERVER///////////
//////////////////////////////
const port = 3000;
app.listen(port, () => {
  print(`app running on port ${port}...`);
});
