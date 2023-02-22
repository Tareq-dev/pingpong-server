const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

// user - tareq
// pass - STVMbgNLHprbExuc

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://tareq:STVMbgNLHprbExuc@cluster0.zw6y76r.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const postCollection = client.db("pingpong").collection("posts");
    const profileCollection = client.db("pingpong").collection("profile");

    app.get("/posts", async (req, res) => {
      const query = {};
      const cursor = postCollection.find(query);
      const posts = await cursor.toArray();
      res.send(posts);
    });

    // indivisual profile

    app.get("/profile/:email", async (req, res) => {
      const email = req.params.email;
      const user = await profileCollection.findOne({ email: email });
      res.send(user);
    });

    // get
    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const post = await postCollection.findOne(query);
      res.send(post);
    });

    //Put Reaction

    app.patch("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const post = req.body;
      const filter = { _id: id };
      const updateDoc = {
        $set: {
          love: post.love,
        },
      };
      const result = await postCollection.updateOne(filter, updateDoc);
      res.send({ result });
    });
    // POST

    app.post("/posts", async (req, res) => {
      const updateProfile = req.body;
      const result = await postCollection.insertOne(updateProfile);
      res.send(result);
    });

    // PUT
    app.put("/profile/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: profile.name,
          address: profile.address,
          course: profile.course,
          picture: profile.picture,
          subject: profile.subject,
          university: profile.university,
        },
      };
      const result = await profileCollection.updateMany(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
  } finally {
    //
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running pingpong");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
