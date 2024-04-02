import React from "react";
import { Button } from "@mui/material";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios.js";
import "./navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Display a confirmation dialog
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try {
        // Call the logout API endpoint using POST method
        await makeRequest.post("/auth/logout");

        // Redirect the user to the login page after logout
        navigate("/login"); // Using useNavigate to navigate
      } catch (error) {
        console.error("Error logging out:", error);
        // Handle error
      }
    }
  };

  return (
    <div className="navbar">
<div className="left">
        <span>PlayPals</span>
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
    </div>
    <div className="right">
        <Button onClick={handleLogout}><LogoutOutlinedIcon/></Button>
</div>
    </div>
  );
};

export default Navbar;

