import React, { useContext, useState } from "react";
import { Context, server } from "../index";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";

const Register = () => {
  const [userType, setUserType] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/user/new`,
        { username, email, password, address, userType },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setIsAuthenticated(true);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthenticated(false);
      console.log("eroor", error);
    }
  };

  if (isAuthenticated) return <Navigate to={"/"} state={{ userType }} />;
  return (
    <div className="login_form_container">
      <h2>Register</h2>
      <form onSubmit={submitHandler} className="login_form">
        <div className="form_group">
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            id="email"
            placeholder="Username"
            required
          />
        </div>
        <div className="form_group">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="form_group">
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            placeholder="Password"
            required
          />
        </div>
        <div className="form_group">
          <input
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            id="address"
            placeholder="Address"
            required
          />
        </div>
        <select
          id="registerSelect"
          className="selection_element"
          //   value={selectedOption}
          required
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="">Select an option</option>
          <option value="Manufacturer">Manufacturer</option>
          <option value="Transporter">Transporter</option>
        </select>
        <button type="submit">Register</button>
        <p id="reg">
          Already Registerd?
          <Link to={"/login"}>Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
