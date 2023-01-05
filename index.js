const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// MiddleWares
app.use(cors());
app.use(express.json());

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
};

// Database Connect 
const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const usersCollection = client.db("food-delivery-db").collection("users");
    const foodsCollection = client.db("food-delivery-db").collection("foods");

     app.get("/foods", async (req, res) => {
       const query = {};
       const cursor = await foodsCollection.find(query).toArray();
       res.send(cursor);
     });

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5h",
      });
      res.send({ accessToken: token });
    });
  } finally {
  }}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Food delivery server is running!!!");
});

app.listen(port, () => {
  console.log(`Food delivery app listening on port ${port}`);
});
