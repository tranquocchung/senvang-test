require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const { Kafka } = require("kafkajs");
const { Client: ESClient } = require("@elastic/elasticsearch");
const redisClient = require("./config/redis");
const { sequelize } = require("./models");
const routers = require("./routers");
const bodyParser = require("body-parser");
require('./config/consumer');//Consumer kafka


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

sequelize.sync({ alter: true })
    .then(() => console.log("✅ Database synced"))
    .catch(err => console.error("❌ Sync error:", err));

app.use("/api", routers);

app.listen(port, () => {
    console.log(`🚀 Backend running at http://localhost:${port}`);
});
