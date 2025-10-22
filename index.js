// import {express} from 'express';
// import connectDB from './db/config';

const express = require('express');
const connectDB = require('./db/config');
const cors = require('cors');

const routes = require('./routes/routes');

const app = express();

connectDB();

const port = process.env.PORT || 3000;

// Middleware & routes
app.use(express.json());

app.use(cors());

app.use('/api', routes);

app.listen( port ,()=>{
    console.log(`server is running at port number http://localhost:${port}`)
});