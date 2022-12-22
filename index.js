const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4cil93r.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const postCollection = client.db('profile').collection('posts')
    app.get('/post', async (req, res) => {
      let query = {};
      const result = await postCollection.find(query).toArray()
      res.send(result)
    })
    app.post('/posts', async (req, res) => {
      const posts = req.body;
      const result = await postCollection.insertOne(posts);
      res.send(result)
    });

    app.get('/posts', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const result = await postCollection.find(query).toArray();
      res.send(result)
    });

    app.put('/posts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const option = { upsert: true }
      const data = req.body;
      const updatedDoc = {
        $set: {
          data
        }
      }
      const result = await postCollection.updateOne(filter, updatedDoc, option);
      res.send(result);
    });



    app.delete('/posts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await postCollection.deleteOne(query);
      res.send(result)
    });


  }
  finally {

  }
}
run().catch(error => console.error(error))


app.get('/', (req, res) => {
  res.send('profile server is running')
})
app.listen(port, () => {
  console.log(`profile server is running on port ${port}`)
})