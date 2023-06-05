import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { Context, server } from "..";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import "../styles/home.css";

const Transporter = ({ userType }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [replyPrice, setReplyPrice] = useState("");
  const [searchOrderID, setSearchOrderID] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchFrom, setSearchFrom] = useState("");
  const [orders, setOrders] = useState([]);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${server}/api/v1/messages/my`, {
        withCredentials: true,
      });
      setOrders(response.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReplySubmit = async () => {
    try {
      await axios.post(
        `${server}/api/v1/tran/message`,
        {
          orderId: selectedOrder.orderID,
          price: replyPrice,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setReplyPrice("");
      setShowModal(false);
      toast.success("Reply Sent Successfully");
    } catch (error) {
      toast.error("Already Replied");
      setShowModal(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    setReplyPrice("");
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleClick = async () => {
    try {
      await axios.get(`${server}/logout`, {
        withCredentials: true,
      });

      setIsAuthenticated(false);

      toast.success("Logged Out Successfully");
    } catch (error) {
      setIsAuthenticated(true);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="container">
      <div className="header_section_home">
        <div className="header" id="header_section_Trans">
          <h2>{userType} Dashboard</h2>
          <button className="btn_logout_trans" onClick={handleClick}>
            Logout
          </button>
        </div>
        <Header
          searchOrderID={searchOrderID}
          searchTo={searchTo}
          searchFrom={searchFrom}
          setSearchOrderID={setSearchOrderID}
          setSearchTo={setSearchTo}
          setSearchFrom={setSearchFrom}
        />
      </div>
      <div className="body_container">
        <div className="orders_container">
          <div className="ordersheadingtrans">
            <h2>Orders:</h2>
          </div>
          <div className="lists_container">
            <ul className="lists_trans">
              {orders.length > 0 ? (
                orders
                  .filter((order) => {
                    return (
                      order.orderID.includes(searchOrderID) &&
                      order.to.toLowerCase().includes(searchTo.toLowerCase()) &&
                      order.from
                        .toLowerCase()
                        .includes(searchFrom.toLowerCase())
                    );
                  })
                  .map((order) => (
                    <li
                      key={order._id}
                      onClick={() => handleOrderClick(order)}
                      style={{ cursor: "pointer" }}
                    >
                      Order ID: {order.orderID}
                      <p>To: {order.to}</p>
                      <p>From: {order.from}</p>
                      <p></p>
                    </li>
                  ))
              ) : (
                <li>No orders available</li>
              )}
            </ul>
          </div>
        </div>
        {showModal && selectedOrder && (
          <div className="modal">
            <div className="modal_content">
              <div className="modal_header">
                <h2>Selected Order Details:</h2>
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
              </div>
              <p>Order ID: {selectedOrder.orderID}</p>
              <p>From: {selectedOrder.from}</p>
              <p>To: {selectedOrder.to}</p>
              <p>Quantity: {selectedOrder.quantity}</p>
              <p>Address: {selectedOrder.address}</p>
              <div className="replydiv">
                <label>
                  Price:
                  <input
                    type="text"
                    value={replyPrice}
                    placeholder="Float Value"
                    onChange={(e) => setReplyPrice(e.target.value)}
                  />
                </label>
                <button onClick={handleReplySubmit}>Reply</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transporter;
