import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Notification.css";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch("http://localhost:3002/notifications");
      const data = await response.json();
      setNotifications(data);
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3003");

    socket.on("catalog_notification", (message) => {
      setNotifications((prevNotifications) => [
        { message },
        ...prevNotifications,
      ]);
      setUnreadCount((prevCount) => prevCount + 1);
    });

    socket.on("order_notification", (message) => {
      setNotifications((prevNotifications) => [
        { message },
        ...prevNotifications,
      ]);
      setUnreadCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    setUnreadCount(0);
  };

  return (
    <div className="notification">
      <div className="bell-icon" onClick={handleBellClick}>
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
      </div>
      {showNotifications && (
        <div className="notifications-list">
          <h2>Notifications</h2>
          <ul className="scrollable-list">
            {notifications.map((notification, index) => (
              <li key={index}>{notification.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;
