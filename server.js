const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const gqlResolvers = require("./graphql/resolvers/index");
const gqlSchema = require("./graphql/schema/index");
const authMiddle = require("./middleware/authMiddle");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-ALlow-Headers", "Content-Type, Authorization");
  if ((req.method === "OPTIONS")) {
    return res.sendStatus(200);
  }
  next();
});

app.use(authMiddle);


app.use(
  "/graphql",
  graphqlHTTP({
    schema: gqlSchema,
    rootValue: gqlResolvers,
    graphiql: true
  })
);

app.get("/", (req, res, next) => {
  res.send("hi ✋");
});

mongoose
  .connect(
    `mongodb+srv://john:${process.env.MONGO_PW}@cluster0-6g6x4.mongodb.net/event-gql?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("db connected on mongodb atlas");
  })
  .catch(err => {
    console.dir(err);
  });

app.listen(3030);
