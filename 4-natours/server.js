const print = console.log;
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//This code sets up an event listener for the 'uncaughtException' event. This event is emitted when an unhandled exception occurs in the Node.js process.
//When an unhandled exception is caught, it logs the error's name and message to the console and then exits the process with a status code of 1, indicating an error.
process.on('uncaughtException', err => {
    print(err.name, err.message);
    process.exit(1);
});

//This code uses the 'dotenv' library to load environment variables from a file named 'config.env'. These environment variables are typically used to configure the application.
dotenv.config({ path: './config.env' });


const app = require('./app');

// @ts-ignore
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
}).then(() => print('DB connection is Done'));

const port = process.env.PORT || 3000;
const server = app.listen(3000, () => {
    print(`app running on port ${3000}...`);
});

process.on('unhandledRejection', err => {
    // @ts-ignore
    print(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
});