import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Context, server } from "../index";
import "../styles/home.css";
import "../styles/modal.css";
import Header from "../components/Header";
import { toast } from "react-hot-toast";
import Transporter from "./Transporter";

const generateAlphanumericCode = () => {
  const length = 5; // Length of the alphanumeric code
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Allowed characters
  let code = "";

  // Generate a random alphanumeric code
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
};

const TheHome = () => {
  const [messages, setMessages] = useState([]);
  const [searchOrderID, setSearchOrderID] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchFrom, setSearchFrom] = useState("");
  const [orderID, setOrderID] = useState(generateAlphanumericCode());
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [quantity, setQuantity] = useState("");
  const [address, setAddress] = useState("");
  const [transporter, setTransporter] = useState("");
  const [gettransporters, setGettransporters] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reply, setReply] = useState([]);

  const { isAuthenticated, setIsAuthenticated, userType, setUserType } =
    useContext(Context);
  useEffect(() => {
    fetchIsAuth();
    fetchMyAddress();
    fetchSentMessages();
    fetchTransporters();
  }, [refresh]);
  const fetchIsAuth = async () => {
    try {
      const response = await axios.get(`${server}/checkAuth`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        setIsAuthenticated(true);
        setUserType(response.data.userType);
      }
    } catch (error) {
      toast.error("Login First");
    }
  };
  const fetchMyAddress = async () => {
    try {
      const response = await axios.get(`${server}/user/manufacturer/address`, {
        withCredentials: true,
      });
      setIsAuthenticated(true);
      setAddress(response.data.address);
    } catch (error) {}
  };

  const fetchSentMessages = async () => {
    try {
      const response = await axios.get(
        `${server}/api/v1/getmysentmessages`,
        {
          withCredentials: true,
        },
        {}
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.log("error");
    }
  };
  const fetchReceivedMessages = async (order) => {
    try {
      setSelectedOrder(order);
      const fOrder = order;
      const response = await axios.get(
        `${server}/api/v1/getTransReply?term=${fOrder.orderID}`,

        {
          withCredentials: true,
        },
        {}
      );
      setReply(response.data.Reply);
    } catch (error) {
      console.log("error");
      setReply("");
    }
  };

  const fetchTransporters = async () => {
    try {
      const response = await axios.get(`${server}/api/v1/gettransporters`, {
        withCredentials: true,
      });
      setGettransporters(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${server}/api/v1/man/message`,
        {
          orderID,
          to,
          from,
          quantity,
          address,
          transporter,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTo("");
      setFrom("");
      setQuantity("");
      setTransporter("");
      setOrderID(generateAlphanumericCode());
      setRefresh(!refresh);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrderClick = (order) => {
    fetchReceivedMessages(order);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setReply("");
  };
  const handleClick = async () => {
    try {
      const response = await axios.get(`${server}/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setIsAuthenticated(false);
    } catch (error) {
      setIsAuthenticated(true);
    }
  };
  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <>
      {userType === "Manufacturer" ? (
        <>
          <div className="container">
            <div className="header_section_home">
              <div className="header">
                <h2>{userType} Dashboard</h2>
                <button
                  className="btn_logout"
                  id="bt_log"
                  onClick={handleClick}
                >
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
            <div className="container_home">
              <div className="container_section">
                <div className="messages_container">
                  <div className="messages">
                    <ul className="lists">
                      {messages.length > 0 ? (
                        messages
                          .filter((i) => {
                            return (
                              i.orderID.includes(searchOrderID) &&
                              i.to
                                .toLowerCase()
                                .includes(searchTo.toLowerCase()) &&
                              i.from
                                .toLowerCase()
                                .includes(searchFrom.toLowerCase())
                            );
                          })
                          .map((i) => (
                            <li
                              key={i._id}
                              onClick={() => handleOrderClick(i)}
                              style={{ cursor: "pointer" }}
                            >
                              Order ID:{i.orderID}
                              <p>To: {i.to}</p>
                              <p>From: {i.from}</p>
                            </li>
                          ))
                      ) : (
                        <li>No orders Availbale</li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="manf_send_section">
                  <form className="container_form" onSubmit={handleSubmit}>
                    <div className="input-box">
                      <div className="inputheading">Order ID:</div>
                      <input
                        type="text"
                        value={orderID}
                        onChange={(e) => setOrderID(e.target.value)}
                        placeholder={orderID}
                        required
                      />
                    </div>
                    <div className="input-box">
                      <div className="inputheading">To:</div>
                      <input
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-box">
                      <div className="inputheading">From:</div>
                      <input
                        type="text"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-box">
                      <div className="inputheading">Quantity:</div>
                      <select
                        id="mySelect"
                        value={quantity}
                        required
                        onChange={(e) => setQuantity(e.target.value)}
                      >
                        <option className="selectq" value="">
                          Select quantity in Tons
                        </option>
                        <option className="selectq" value="1">
                          1
                        </option>
                        <option className="selectq" value="2">
                          2
                        </option>
                        <option className="selectq" value="3">
                          3
                        </option>
                      </select>
                    </div>
                    <div className="input-box">
                      <div className="inputheading">Address:</div>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-box">
                      <div className="inputheading">Transporter:</div>
                      <select
                        id="mySelect"
                        value={transporter}
                        required
                        onChange={(e) => setTransporter(e.target.value)}
                      >
                        <option value="">Select transporter</option>
                        {gettransporters.map((i) => (
                          <option key={i._id} value={i.username}>
                            {i.username}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button onClick={handleSubmit} type="submit">
                      Send
                    </button>
                  </form>
                </div>
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
                  <div className="sentdiv">
                    <p>Order ID: {selectedOrder.orderID}</p>
                    <p>From: {selectedOrder.from}</p>
                    <p>To: {selectedOrder.to}</p>
                    <p>Quantity: {selectedOrder.quantity}</p>
                    <p>Address: {selectedOrder.address}</p>
                  </div>
                  <div className="replytrans">
                    Reply from Transporter<br></br>
                    Price:
                    {reply == "" ? "No Reply Yet" : reply[0].price}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <Transporter userType={userType} />
      )}
    </>
  );
};

export default TheHome;
