const express = require('express');
const jobs = require('./fakeDB.json');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors')
const app = express();
const port = 3000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@career-club-server.jvwbqky.mongodb.net/?retryWrites=true&w=majority`;


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

    // const database = client.db("demoNoticeDB");
    const noticeCollection = client.db("demoNoticeDB").collection("notice");

    app.get('/notice', async (req, res) => {
      const cursor = noticeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/notice/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await noticeCollection.findOne(query);
      res.send(result);
    })

    app.get('/update/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await noticeCollection.findOne(query);
      res.send(result);
    })

    app.put('/notice/:id', async (req, res) => {
      const id = req.params.id;
      const pastNotice = req.body;
      console.log(id, pastNotice)
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedNotice = {
        $set: {
          title: pastNotice.title,
          company: pastNotice.company,
          location: pastNotice.location,
          experience: pastNotice.experience,
          responsibility: pastNotice.responsibility,
          requirments: pastNotice.requirments,
          type: pastNotice.type,
          duration: pastNotice.duration,
          description: pastNotice.description,
          salary: pastNotice.salary,
          payment: pastNotice.payment,
          notice: pastNotice.notice,
          amount: pastNotice.amount,
          quantity: pastNotice.quantity,
          phone: pastNotice.phone,
          img: pastNotice.img,
        }
      }
      const result = await noticeCollection.updateOne(filter, updatedNotice, options);
      res.send(result);
    })

    app.post('/notice', async (req, res) => {
      const notice = req.body;
      // console.log(notice);
      const result = await noticeCollection.insertOne(notice);
      res.send(result);
    })


    app.delete('/notice/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await noticeCollection.deleteOne(query);
      res.send(result);
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
  res.send('Career Club server site is comming soon')
})

app.get('/selectedjobs', (req, res) => {
  res.send(jobs)
})

app.get('/selectedjobs/:id', (req, res) => {
  const jobinfo = parseInt(req.params.id);
  const selectedJob = jobs.find(jobs => jobs.id === jobinfo);
  // console.log(jobinfo);
  res.send(selectedJob)
})

app.listen(port, () => {
  console.log(`The port is running on ${port}`)
})