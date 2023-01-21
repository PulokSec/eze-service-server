const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iyt5e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(express.json());
app.use(cors());

// const port = 5000;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = client.connect()
connection.then(err => {
  
    const adminCollection = client.db("ezeService").collection("admin");
    const customerOrderCollection = client.db("ezeService").collection("ordered");
    const serviceCollection = client.db("ezeService").collection("services");
    const reviewCollection = client.db("ezeService").collection("review");
    const teamCollection = client.db("ezeService").collection("team");

    app.get('/', (req, res) => {
      res.send("WELCOME to EZE Service DB it's online")
  })
  console.log('EZE Service DB Connected');

    app.post('/addService', (req, res) => {
        const newService = req.body;
        serviceCollection.insertOne(newService)
        .then(result => {
            res.send(result.insertedCount > 0)
        })

      })
      
      app.post('/addReview', (req, res) => {
        const newReview = req.body;
        reviewCollection.insertOne(newReview)
        .then(result => {
            res.send(result.insertedCount > 0)
        })

      })

      app.get('/allReviews',(req,res)=>{
        reviewCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
      })  

      app.delete('/deleteService/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        serviceCollection.findOneAndDelete({_id: id})
        .then(result => {
          res.send(result.deletedCount > 0);
        })
      })

      app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        adminCollection.insertOne(newAdmin)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
      })
      
      app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        customerOrderCollection.insertOne(newOrder)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
      })
      app.post('/addTeam', (req, res) => {
        const newTeam = req.body;
        teamCollection.insertOne(newTeam)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
      })
      
      app.get('/teams', (req, res) => {
        teamCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
      })      
      app.get('/services', (req, res) => {
        serviceCollection.find()
        .toArray((err, items) => {
          res.send(items)
        })
        
      })  
      app.get('/allOrders', (req, res) => {
        customerOrderCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
      }) 

      app.patch('/update/:id', (req, res) => {
        customerOrderCollection.updateOne({_id: ObjectID(req.params.id)},
        {
          $set: {status: req.body.status}
        }
        )
        .then(result=>{
          res.send(result.modifiedCount > 0);
        })
      })

      app.get('/orders', (req, res) => {
        customerOrderCollection.find({email: req.query.email})
        .toArray((err, items) => {
            res.send(items)
        })
      })


    app.get('/isAdmin', (req, res) => {
        adminCollection.find({ email: req.query.email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })

});


const port = process.env.PORT || 5000;
app.listen(port, (err) => (err ? console.log('Filed to Listen on Port', port) : console.log('Listing for Port', port)));