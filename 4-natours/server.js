const print = console.log;
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// print(process.env);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    print(`app running on port ${port}...`);
});
