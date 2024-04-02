import React from "react";
import { NavLink } from "react-router-dom";

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <NavLink
      to={to}
      className={`menu-item ${selected === title ? "selected" : ""}`}
      onClick={() => setSelected(title)}
    >
      <div className="icon">{icon}</div>
      <span>{title}</span>
    </NavLink>
  );
};

export default Item;
