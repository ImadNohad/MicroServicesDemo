import React, { useEffect, useState } from "react";
import "./OrderList.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await fetch("http://localhost:3001/orders");
    const data = await response.json();
    setOrders(data);
  };

  return (
    <div className="order-list">
      <h1>Orders</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Book ID</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.bookId}</td>
              <td>{order.quantity}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
