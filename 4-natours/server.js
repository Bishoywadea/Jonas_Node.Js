const print = console.log;
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    print(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// @ts-ignore
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
}).then(() => print('DB connection is Done'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    print(`app running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    // @ts-ignore
    print(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
});