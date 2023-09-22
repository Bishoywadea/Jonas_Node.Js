const print = console.log;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
}).then(() => print('DB connection is Done'));
// print(process.env);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    print(`app running on port ${port}...`);
});
