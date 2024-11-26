const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express() ;
require('dotenv').config()
const port = process.env.PORT || 5000 ;

//  middleware
app.use(cors()) ;
app.use(express.json()) ;


app.get("/", (req, res) => {
    res.send("coffee server is ready to serve") ;
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ohdc4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

const coffeeExpress = client.db("coffeeExpress").collection("coffee")


    // add a new coffee 
    app.post('/coffee', async(req, res) => {
        const newCoffee = req.body ;
        console.log(newCoffee) ;
        const result = await coffeeExpress.insertOne(newCoffee) ;
        res.send(result) ;
    })


    // get all data 
    app.get("/coffee", async(req, res) => {
        const cursor = coffeeExpress.find() ;
        const result = await cursor.toArray() ;
        res.send(result) ; 
    })


    // get one data 
    app.get("/coffee/:id", async(req, res) => {
        const id = req.params.id ;
        const query = {_id: new ObjectId(id)} ;
        const result = await coffeeExpress.findOne(query)
        res.send(result)
    })


    // delete one data 
    app.delete("/coffee/:id", async(req, res) => {
        const id = req.params.id ;
        console.log(id) ;
        const query = {_id : new ObjectId(id)} ;
        const result = await coffeeExpress.deleteOne(query) ;
        res.send(result) ;
    })


    // update one data 
    app.put("/coffee/:id", async(req,res) => {
        const id = req.params.id ;
        console.log(id) ;
        const filter = {_id : new ObjectId(id)} ;
        const updatedCoffee = req.body ;
        const options = { upsert : true} ;
        const updatedDoc = {
            $set : {
                name: updatedCoffee.name ,
                photo: updatedCoffee.photo ,
                details: updatedCoffee.details ,
                taste: updatedCoffee.taste ,
                quantity: updatedCoffee.quantity ,
                supplier: updatedCoffee.supplier ,
                category: updatedCoffee.category ,
            }
        }
        const result = await coffeeExpress.updateOne(filter,updatedDoc,options)
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



app.listen(port, () => {
    console.log("coffee server is running on port : ", port)
})