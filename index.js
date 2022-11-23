const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const port = process.env.PORT || 5000


const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();


app.get('/', (Req, res) => {
    res.send("Hello, Welcome to Assignment 12")
})


app.listen(port, () => {
    console.log(`This Server is Running by ${port}`)
})