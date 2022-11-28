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
        const ordersCollection = client.db("BD-Mobile-Market").collection("orders");

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
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = {
                email: email
            };
            const result = await usersCollection.findOne(query);
            res.send({ isAdmin: result.role === "admin" })
        })

        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = {
                email: email
            };
            const result = await usersCollection.findOne(query);
            res.send({ isBuyer: result?.role === "buyer" });
        })

        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = {
                email: email
            }
            const result = await usersCollection.findOne(query);
            res.send({ isSeller: result?.role === "seller" })
        })
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    verified: true
                },
            };
            const result = await usersCollection.updateOne(query, updateDoc, options);
            res.send(result);

        })

        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })
        app.get('/verifieduser', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.find(query).toArray();
            res.send(user);
        })

        app.get('/allproducts', async (req, res) => {
            const query = {};
            const allProducts = await productsCollection.find(query).toArray();
            res.send(allProducts);
        })
        app.get("/allproducts/:category", async (req, res) => {
            const category = req.params.category;
            const query = { BrandName: category }
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        })
        app.get('/allproducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productsCollection.find(query).toArray();
            res.send(product);
        })

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        })
        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    status: "sold"
                },
            };
            const result = await productsCollection.updateOne(query, updateDoc, options);
            res.send(result);

        })



        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/advertising', async (req, res) => {
            const adsProduct = req.body;
            const query = { ProductName: adsProduct.ProductName, email: adsProduct.email }
            const alreadyAds = await advertisingCollection.find(query).toArray();
            if (alreadyAds.length === 0) {
                const result = await advertisingCollection.insertOne(adsProduct);
                res.send(result);
            }

        })

        app.get("/advertising", async (req, res) => {
            const query = {};
            const adsProducts = await advertisingCollection.find(query).toArray();
            res.send(adsProducts);
        })

        app.delete('/advertising/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await advertisingCollection.deleteOne(query);
            res.send(result);

        })
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const query = {
                ProductName: order.ProductName,
                SellerEmail: order.SellerEmail,
                BuyerEmail: order.BuyerEmail
            }
            const alreadyBuy = await ordersCollection.find(query).toArray();
            if (alreadyBuy.length === 0) {
                const result = await ordersCollection.insertOne(order);
                res.send(result);
            }

        })
        app.get("/orders", async (req, res) => {
            const email = req.query.BuyerEmail;
            const query = {
                BuyerEmail: email
            }
            const result = await ordersCollection.find(query).toArray();
            res.send(result);
        })


        app.put('/allproducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    Report: "Reported"
                },
            };
            const result = await productsCollection.updateOne(query, updateDoc, options)
            res.send(result);
        })

        app.get("/reportedProducts", async (req, res) => {
            const reported = req.query.report;
            const query = {
                Report: reported
            }
            const reportedProducts = await productsCollection.find(query).toArray();
            res.send(reportedProducts);
        })


    }
    finally { }
}

run().catch(err => console.log(err))




app.listen(port, () => {
    console.log(`This Server is Running by ${port}`)
})