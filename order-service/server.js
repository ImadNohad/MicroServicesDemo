const express = require("express");
const mongoose = require("mongoose");
const amqp = require("amqplib/callback_api");
var cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://mongodb:27017/orders", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const orderSchema = new mongoose.Schema({
  bookId: String,
  quantity: Number,
  status: String,
  email: String,
});

const Order = mongoose.model("Order", orderSchema);

amqp.connect("amqp://rabbitmq", (err, connection) => {
  if (err) {
    throw err;
  }
  connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }
    channel.assertQueue("order_placed", { durable: false });

    app.post("/orders", async (req, res) => {
      const newOrder = new Order({ ...req.body, status: "Pending" });
      await newOrder.save();

      channel.sendToQueue(
        "order_placed",
        Buffer.from(JSON.stringify(newOrder))
      );
      res.status(201).json(newOrder);
    });

    app.get("/orders", async (req, res) => {
      const orders = await Order.find();
      res.json(orders);
    });

    app.get("/orders/:id", async (req, res) => {
      const order = await Order.findById(req.params.id);
      res.json(order);
    });

    app.listen(3001, () => {
      console.log("Order service listening on port 3001");
    });
  });
});
