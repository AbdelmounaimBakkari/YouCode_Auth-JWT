const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

//connect to DB
mongoose.connect(process.env.DB_CONNECT, () => console.log('Connected to DataBase'));

//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//Middlewares
app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);



const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on: http://localhost:${PORT}`));