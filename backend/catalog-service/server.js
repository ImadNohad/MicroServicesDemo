const express = require("express");
const mongoose = require("mongoose");
const amqp = require("amqplib/callback_api");
var cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://mongodb:27017/catalog", {});

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  stock: Number,
});

const Book = mongoose.model("Book", bookSchema);

amqp.connect("amqp://rabbitmq:5672", (err, connection) => {
  if (err) {
    throw err;
  }
  connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }
    channel.assertQueue("catalog_changed", { durable: true });

    app.get("/books", async (req, res) => {
      const books = await Book.find();
      res.json(books);
    });

    // Get a single book by ID
    app.get("/books/:id", async (req, res) => {
      try {
        const book = await Book.findById(req.params.id);
        if (book == null) {
          return res.status(404).json({ message: "Book not found" });
        }
        res.json(book);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    app.post("/books", async (req, res) => {
      const newBook = new Book(req.body);
      await newBook.save();
      channel.sendToQueue(
        "catalog_changed",
        Buffer.from(JSON.stringify({ action: "added", book: newBook }))
      );
      res.status(201).json(newBook);
    });

    // Update a book by ID
    app.put("/books/:id", async (req, res) => {
      try {
        const book = await Book.findById(req.params.id);
        if (book == null) {
          return res.status(404).json({ message: "Book not found" });
        }

        if (req.body.title != null) {
          book.title = req.body.title;
        }
        if (req.body.author != null) {
          book.author = req.body.author;
        }
        if (req.body.price != null) {
          book.price = req.body.price;
        }
        if (req.body.stock != null) {
          book.stock = req.body.stock;
        }

        const updatedBook = await book.save();
        channel.sendToQueue(
          "catalog_changed",
          Buffer.from(JSON.stringify({ action: "updated", book: updatedBook }))
        );
        res.json(updatedBook);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });

    // Delete a book by ID
    app.delete("/books/:id", async (req, res) => {
      try {
        const book = await Book.findById(req.params.id);
        if (book == null) {
          return res.status(404).json({ message: "Book not found" });
        }

        await book.deleteOne();
        channel.sendToQueue(
          "catalog_changed",
          Buffer.from(JSON.stringify({ action: "deleted", book: book }))
        );
        res.json({ message: "Book deleted" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    app.listen(3000, () => {
      console.log("Catalog service listening on port 3000");
    });
  });
});
