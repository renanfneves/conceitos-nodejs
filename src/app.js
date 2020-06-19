const express = require("express");
const cors = require("cors");

const controller = require("./controller");

const app = express();

app.use(express.json());
app.use(cors());


app.get("/repositories", controller.read);

app.post("/repositories", controller.create);

app.put("/repositories/:id", controller.update);

app.delete("/repositories/:id", controller.remove);

app.post("/repositories/:id/like", controller.likeIt);

module.exports = app;
