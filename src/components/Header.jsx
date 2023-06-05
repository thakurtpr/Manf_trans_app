import React from "react";
import "../styles/home.css";

const Header = ({
  searchOrderID,
  searchTo,
  searchFrom,
  setSearchOrderID,
  setSearchTo,
  setSearchFrom,
}) => {
  return (
    <>
      <div>
        <form>
          <div className="inputsearch">
            <div>Search:</div>
            <input
              type="text"
              placeholder="OrderId"
              onChange={(e) => setSearchOrderID(e.target.value)}
            />
            <input
              type="text"
              placeholder="To"
              onChange={(e) => setSearchTo(e.target.value)}
            />
            <input
              type="text"
              placeholder="From"
              onChange={(e) => setSearchFrom(e.target.value)}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Header;
