const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crceb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try{
    await client.connect();
    console.log('database connected');

    const database = client.db('tourBooking');
    const destinationCollection = database.collection('destination');
    const bookingCollection = database.collection('booking');

    // GET API
    app.get('/tours', async (req, res) => {
      const cursor = destinationCollection.find({});
      const destination = await cursor.toArray();
      res.send(destination);
  });



    // get tour booking
    app.get('/tourBooking/:id', async(req, res) => {
      const result = await destinationCollection.find({_id: ObjectId(req.params.id)}).toArray();
      res.send(result[0]);
    })



     // POST API
     app.post('/tours', async (req, res) => {
      const service = req.body;
      console.log('hitting the post api', service);

      const result = await destinationCollection.insertOne(service);
      console.log(result);
      res.json(result);
  });



  // confirm order
  app.post("/confirmOrder", async(req, res) => {
    const query = req.body;
    const result = await bookingCollection.insertOne(req.body);
    res.send(result);
  })

  // All Booking
  app.get("/booking", async(req, res) => {
    const query = bookingCollection.find({});
    const result = await query.toArray();
    res.send(result);
})



  // My Booking
  app.get("/booking/:email", async (req, res) => {
    const query = bookingCollection.find({email:req.params.email})
    const result = await query.toArray();
    res.send(result);
  })



  // Delete API

  app.delete('/booking/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await bookingCollection.deleteOne(query);
    res.json(result);
  })

  }
  finally{
    // await client.close();
  }
  

}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Tour booking server is running');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});