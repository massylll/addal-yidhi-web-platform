import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ConnectWithoutContactOutlinedIcon from '@mui/icons-material/ConnectWithoutContactOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Item from "./Item"; // Assuming Item component is in a separate file
import "./leftBar.scss";

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);
const [selected, setSelected] = useState(""); // assuming you are using useState hook

  return (
  <div className="leftBar">
    <div className="container">
        <div className="menu">
          <Item
            title="Home"
            to="/"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Messages"
            to="/messages"
            icon={<SendOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Profile"
            to={`/profile/${currentUser.id}`} 
            icon={<Person2OutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Partner Up"
            to="/myrequests"
            icon={<ConnectWithoutContactOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Explore Requests"
            to="/community"
            icon={<SearchOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Feedback"
            to="/feedback"
            icon={<FeedbackOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Reports"
            to="/reports"
            icon={<ReportGmailerrorredOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
      </div>
</div>
  );
};

export default LeftBar;


