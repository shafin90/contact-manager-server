const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://mashrafiahnam:IOwrG4DoOlIGCD3G@cluster0.yhuz2xd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Declare the array variable outside the run() function
let array = [];

async function run() {
  try {





    const userCollection = client.db("contact-manager-app").collection('all_contacts');






    app.get('/api/contacts', async (req, res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })










    app.post('/api/contacts', async (req, res) => {
      const user = req.body;
      console.log('new user', user);
      const result = await userCollection.insertOne(user);
      array.push(user);
      res.send(result);
    });

    app.put('/api/contacts/:id', async (req, res) => {
      const id = req.params.id;
      const contact = req.body;
      console.log(contact)

      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedUser = {
        $set: {
          name: contact.updatedName,
          phoneNumber: contact.updatedPhoneNumber,
          email: contact.updatedEmail
        }
      }

      const result = await userCollection.updateOne(filter, updatedUser, options);
      res.send(result);

    })



    app.delete('/api/contacts/:id', async (req, res) => {
      const id = req.params.id;
      
      console.log('vai database theke etare delete koren', id);
      const query = { _id: new ObjectId(id) }




      // Remove the item from the array based on _id
      array = array.filter(item => item._id.toString() !== new ObjectId(id).toString());




      const result = await userCollection.deleteOne(query);
      res.send(result);
    })




    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);



app.get('/hi', (req, res) => {
  res.send('shafin,,,your server is running...')
})

app.listen(port, () => {
  console.log(`${port}`)
})