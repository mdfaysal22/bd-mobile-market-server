const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');





app.use(cors());
app.use(express.json());
dotenv.config();


app.get('/', (Req, res) => {
    res.send("Hello, Welcome to Assignment 12")
})

// MongoDB Atlas --- Info 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k8emzbd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const usersCollection = client.db("BD-Mobile-Market").collection("users");

        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
        app.get('/users', async(req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })
    }
    finally{}
}

run().catch(err => console.log(err))




app.listen(port, () => {
    console.log(`This Server is Running by ${port}`)
})