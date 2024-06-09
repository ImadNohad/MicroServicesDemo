const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const amqp = require("amqplib/callback_api");
const mongoose = require("mongoose");
var cors = require("cors");

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://mongodb:27017/notifications", {});

const notificationSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

amqp.connect("amqp://rabbitmq:5672", (err, connection) => {
  if (err) {
    throw err;
  }
  connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }
    channel.assertQueue("order_placed", { durable: true });
    channel.assertQueue("catalog_changed", { durable: true });

    channel.consume(
      "order_placed",
      async (msg) => {
        const order = JSON.parse(msg.content.toString());
        const message = `New order placed with ID: ${order._id}`;

        // Save the notification to the database
        const notification = new Notification({ message });
        await notification.save();

        // Emit the notification via WebSocket
        io.emit("order_notification", message);
      },
      { noAck: true }
    );

    channel.consume(
      "catalog_changed",
      async (msg) => {
        const change = JSON.parse(msg.content.toString());
        const message = `Book ${change.action}: ${change.book.title}`;

        // Save the notification to the database
        const notification = new Notification({ message });
        await notification.save();

        // Emit the notification via WebSocket
        io.emit("catalog_notification", message);
      },
      { noAck: true }
    );

    app.get("/notifications", async (req, res) => {
      const notifications = await Notification.find().sort({ timestamp: -1 });
      res.json(notifications);
    });

    app.listen(3002, () => {
      console.log("Notification service listening on port 3002");
    });
  });
});

server.listen(3003, () => {
  console.log("WebSocket server listening on port 3003");
});
