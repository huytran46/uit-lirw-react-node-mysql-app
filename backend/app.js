const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const s3Routes = require('./routes/s3');
const app = express();

app.use(cors());
app.use(bodyParser.json());

/* Add your routes here */
//Health Checking
app.get('/health',(req,res)=>{
   res.json("Health check endpoint");
});

app.use('/api/s3', s3Routes);
app.use('/api', routes);

module.exports = app;