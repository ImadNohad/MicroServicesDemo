import React, { useEffect, useState } from "react";
import BookForm from "./BookForm";
import "./BookList.css";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await fetch("http://localhost:3000/books");
    const data = await response.json();
    setBooks(data);
  };

  const deleteBook = async (id) => {
    await fetch(`http://localhost:3000/books/${id}`, {
      method: "DELETE",
    });
    fetchBooks();
  };

  const editBook = (book) => {
    setEditingBook(book);
  };

  return (
    <div className="book-list">
      <h1>Books</h1>
      <BookForm
        fetchBooks={fetchBooks}
        editingBook={editingBook}
        setEditingBook={setEditingBook}
      />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>${book.price}</td>
              <td>{book.stock}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => editBook(book)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteBook(book._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
