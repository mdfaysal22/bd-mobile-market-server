const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');





app.use(cors());
app.use(express.json());
dotenv.config();


app.get('/', (Req, res) => {
    res.send("Hello, Welcome to Assignment 12")
})

// MongoDB Atlas --- Info 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k8emzbd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const usersCollection = client.db("BD-Mobile-Market").collection("users");
        const productsCollection = client.db("BD-Mobile-Market").collection("products");
        const advertisingCollection = client.db("BD-Mobile-Market").collection('advertising');

        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await usersCollection.find(query).toArray()
            if (existingUser.length === 0) {
                const result = await usersCollection.insertOne(user);
                res.send(result);
            }

        })
        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })


        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        })
        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })

        app.post('/advertising', async(req, res) => {
            const adsProduct = req.body;
            const query = {ProductName : adsProduct.ProductName}
            const alreadyAds = await advertisingCollection.find(query).toArray();
            // console.log(alreadyAds);
            // console.log(console.log(query));
            if(alreadyAds.length === 0){
                const result = await advertisingCollection.insertOne(adsProduct);
                res.send(result);
            }
            
        })

        app.get("/advertising", async(req, res) => {
            const query = {};
            const adsProducts = await advertisingCollection.find(query).toArray();
            res.send(adsProducts);
        })

        
    }
    finally { }
}

run().catch(err => console.log(err))




app.listen(port, () => {
    console.log(`This Server is Running by ${port}`)
})