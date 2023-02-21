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



    //   app.get("/service/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const service = await serviceCollection.findOne(query);
    //   res.send(service);
    // });

    // POST

    app.post("/posts", async (req, res) => {
      const updateProfile = req.body;
      const result = await postCollection.insertOne(updateProfile);
      res.send(result);
    });

    // PUT Admin Role
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
    // // DELETE

    // app.delete("/service/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await serviceCollection.deleteOne(query);
    //   res.send(result);
    // });

    // //order collection
    // app.get("/order", async (req, res) => {
    //   const email = req.query.email;
    //   if (email) {
    //     const query = { email: email };
    //     const cursor = orderCollection.find(query);
    //     const orders = await cursor.toArray();
    //     res.send(orders);
    //   } else {
    //     res.status(403).send({ message: "Forbidden access" });
    //   }
    // });

    // app.post("/order", async (req, res) => {
    //   const order = req.body;
    //   const result = await orderCollection.insertOne(order);
    //   res.send(result);
    // });

    // //auth JWT
    // app.post("/login", async (req, res) => {
    //   const user = req.body;
    //   const accessToken = jwt.sign(user, process.env.ACCESS_KEY_ID, {
    //     expiresIn: "1d",
    //   });
    //   res.send(accessToken);
    // });
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
