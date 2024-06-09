import React, { useState, useEffect } from "react";
import "./BookForm.css";

const BookForm = ({ fetchBooks, editingBook, setEditingBook }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setPrice(editingBook.price);
      setStock(editingBook.stock);
    }
  }, [editingBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const book = { title, author, price, stock };

    if (editingBook) {
      await fetch(`http://localhost:3000/books/${editingBook._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
      setEditingBook(null);
    } else {
      await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
    }

    setTitle("");
    setAuthor("");
    setPrice("");
    setStock("");
    fetchBooks();
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h2>{editingBook ? "Edit Book" : "Add Book"}</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
      />
      <button type="submit">{editingBook ? "Update" : "Add"}</button>
    </form>
  );
};

export default BookForm;
