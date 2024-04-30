const express = require("express");
const cors = require("cors");

require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

//  middleware
app.use(cors({
  origin:["http://localhost:5173/","https://b9a10-my-dream-country-client.web.app/"]
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bomlehy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const touristCollection = client.db("countryDB").collection("country");
    // ------------------------------------------------------
    //  client commenter
    // const clientComment = client.db("countryDB").collection("comment");
    // -------------------------------------------------------
    //  database data add
    app.post("/tourist", async (req, res) => {
      const newTourist = req.body;
      // console.log(newTourist);
      const result = await touristCollection.insertOne(newTourist);
      res.send(result);
    });
    app.get("/tourist", async (req, res) => {
      const cursor = touristCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //update id get
    app.get("/tourist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristCollection.findOne(query);
      res.send(result);
    });

    // details
    app.get("/newtourist/:id", async (req, res) => {
      // const id = req.params.id;
      // console.log(id);
      // const query = {_id: new ObjectId(id)};
      const result = await touristCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      // console.log(result);
      res.send(result);
    });
    // ---------------email apis ---------------
    app.get("/myList/:email", async (req, res) => {
      const result = await touristCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
    //  update
    app.put("/tourist/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedTourist = req.body;
      const tourist = {
        $set: {
          image: updatedTourist.image,
          country_Name: updatedTourist.country_Name,
          tourists_spot_name: updatedTourist.tourists_spot_name,
          seasonality: updatedTourist.seasonality,
          location: updatedTourist.location,
          email: updatedTourist.email,
          userName: updatedTourist.userName,
          totaVisitorsPerYear: updatedTourist.totaVisitorsPerYear,
          travel_time: updatedTourist.travel_time,
          average_cost: updatedTourist.average_cost,
          description: updatedTourist.description,
        },
      };
      const result = await touristCollection.updateOne(
        filter,
        tourist,
        options
      );
      res.send(result);
    });
    app.delete("/myList/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristCollection.deleteOne(query);
      res.send(result);
    });

    // ----------------------optional----------------
    // app.post("/comment", async (req, res) => {
    //   const newComment = req.body;
    //   // console.log(newTourist);
    //   const result = await clientComment.insertOne(newComment);
    //   res.send(result);
    // });
    // app.get("/comment", async (req, res) => {
    //   const cursor = clientComment.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
    // ----------------------------------------------

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("B9A10-my-dream-country-server id RUNNING");
});

app.listen(port, () => {
  console.log(`B9A10 server is running on Port :${port}`);
});
