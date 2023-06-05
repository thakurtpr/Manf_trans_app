import { useContext, useState } from "react";
import "../styles/login.css";

import { Context, server } from "../index";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, setIsAuthenticated, setUserType } =
    useContext(Context);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/user/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setIsAuthenticated(true);
      toast.success(data.message);
      setUserType(data.userType);
    } catch (error) {
      setIsAuthenticated(false);
      toast.error("Invalid Email Or Password");
    }
  };

  if (isAuthenticated) return <Navigate to={"/"} />;
  else
    return (
      <div className="login_form_container">
        <h2>Login</h2>
        <form onSubmit={submitHandler} className="login_form">
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
          <button className="btn_login" type="submit">
            Login
          </button>
          <p id="log">
            Don't have account? <Link to={"/register"}>Sign Up</Link>
          </p>
        </form>
      </div>
    );
};

export default Login;
