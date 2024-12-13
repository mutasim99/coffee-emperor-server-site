const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1xmeg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const database = client.db("coffedb");
        const coffiesCollection = database.collection("coffies");
        

        app.get('/coffe', async(req, res)=>{
            const cursor = coffiesCollection.find()
            const result =await cursor.toArray()
            res.send(result)
            
        })

        app.get('/coffe/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await coffiesCollection.findOne(query)
            res.send(result)
        })

        app.post('/addCoffe', async (req, res) => {
            const coffee = req.body
            const result = await coffiesCollection.insertOne(coffee)
            res.send(result)
            
        })

        app.put('/coffe/:id', async(req, res)=>{
            const id = req.params.id
            const coffe = req.body
            const filter = {_id: new ObjectId(id)}
            const options = { upsert: true };
            const updatedCoffe = {

                $set:{
                    name: coffe.name,
                    quantity:coffe.quantity,
                    supplier:coffe.supplier,
                    taste:coffe.taste,
                    category:coffe.category,
                    details: coffe.details,
                    photo: coffe.photo
                }
            }
            const result = await coffiesCollection.updateOne(filter, updatedCoffe, options)
            res.send(result)
        })

        app.delete('/coffe/:id', async(req, res)=>{
            const id = req.params.id;
            console.log("deleted", id);
            const query = {_id: new ObjectId(id)}
            const result = await coffiesCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('bitter coffee is coming soooooooooooooooon ')
})

app.listen(port, () => {
    console.log(`My server is running on port:${port}`);
})