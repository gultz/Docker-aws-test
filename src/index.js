const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const getItems = require('./routes/getItems')
const addItem = require('./routes/addItem')
const db = require('./persistence')

app.use(express.json());
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('hello world');
})
app.get('/items',getItems);
app.post('/items',addItem);
db.init().then(() => {
    app.listen(3000, () => console.log('Listening on port 3000'));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});


const gracefulShutdown = ()=>{
    db.teardown()
    .catch(()=>{})
    .then(()=>process.exit());
}



process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown);



