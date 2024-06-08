import React, { useEffect, useState } from "react";
import "./OrderList.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  return (
    <div className="order-list">
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            Order ID: {order._id}, Book ID: {order.bookId}, Quantity:{" "}
            {order.quantity}, Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
