const print = console.log;
const app = require('./app')

const port = 3000;
app.listen(port, () => {
    print(`app running on port ${port}...`);
});