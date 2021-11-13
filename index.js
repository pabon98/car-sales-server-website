const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzm3u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri)
async function run(){
  try{
    await client.connect()
    // console.log('Database connected successfully')
    const database = client.db("car_shop")
    const carCollection = database.collection("cars")
    const orderCollection = database.collection("orders");
    
    //Get cars API
    app.get('/cars', async(req,res)=>{
    const cursor = carCollection.find({})
    const cars = await cursor.toArray()
    res.send(cars)
    
    })
    //Get orders API
    app.get('/myOrders/:email', async(req,res)=>{
      const email = req.params.email
      const query = {email:email}
      const cursor = await orderCollection.find(query)
      const myOrders = await cursor.toArray()
      res.send(myOrders)

    })
    //Get single car
    app.get("/cars/:id", async(req,res)=>{
      const id = req.params.id
      const query = {_id: ObjectId(id)};
      const car = await carCollection.findOne(query)
      res.json(car)
    })
    //POST API
    app.post('/purchase', async(req,res)=>{
      const orderDetails = req.body
      const result = await orderCollection.insertOne(orderDetails)
      res.send(result)

    })

  }
  finally{
    // await client.close()
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Cars Portal!')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})