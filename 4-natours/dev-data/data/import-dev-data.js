const print = console.log;
const fs = require('fs');
const Tour = require('../../models/tourModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// @ts-ignore
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
}).then(() => print('DB connection is Done'));

// Read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// import data into db
const importData = async () => {
    try {
        await Tour.create(tours);
        print('successful imported');
    } catch (err) {
        print(err);
    }
    process.exit();
}

// delete all data from collection
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        print('successful deleted');
    } catch (err) {
        print(err);
    }
    process.exit();
}
if (process.argv[2] == '--import') importData();
else if (process.argv[2] == '--delete') deleteData();