import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import BookList from "./components/BookList";
import OrderList from "./components/OrderList";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="books" element={<BookList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="/" element={<h1>Welcome to the Bookstore Admin</h1>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
