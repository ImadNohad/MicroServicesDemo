import React from "react";
import OrderList from "./components/OrderList";
import Notification from "./components/Notification";
import "./App.css"; // You can add your own styles here

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Notification />
      </header>
      <main>
        <OrderList />
      </main>
    </div>
  );
}

export default App;
