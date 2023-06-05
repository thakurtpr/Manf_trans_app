import React, {  useState } from 'react';
import { createContext } from "react";

import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles/app.css"
export const server = "https://nodejs-manf-trans.onrender.com"
const root = ReactDOM.createRoot(document.getElementById('root'));

export const Context = createContext({ isAuthenticated: false });


const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState("Transporter");



  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userType, setUserType
        
      }}
    >
      <App />
    </Context.Provider>
  );
};

root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
