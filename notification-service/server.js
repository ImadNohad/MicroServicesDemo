const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const amqp = require("amqplib/callback_api");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

mongoose.connect("mongodb://mongodb:27017/notifications", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const notificationSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

amqp.connect("amqp://rabbitmq", (err, connection) => {
  if (err) {
    throw err;
  }
  connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }
    channel.assertQueue("order_placed", { durable: false });

    channel.consume(
      "order_placed",
      async (msg) => {
        const order = JSON.parse(msg.content.toString());
        console.log(`Received order placed message: ${JSON.stringify(order)}`);

        const message = `New order placed with ID: ${order._id}`;

        // Save the notification to the database
        const notification = new Notification({ message });
        await notification.save();

        // Emit the notification via WebSocket
        io.emit("order_notification", message);
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
