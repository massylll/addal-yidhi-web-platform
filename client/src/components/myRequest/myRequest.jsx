import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import "./myRequest.css";
import { Button } from "@mui/material";

const Request = () => {
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch user requests from backend
    const fetchRequests = async () => {
      try {
        const response = await makeRequest.get("/users/myrequests");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching user requests:", error);
      }
    };

    fetchRequests();
  }, []);

  // Function to handle deleting the request
  const handleDelete = async (requestId) => {
    try {
      await makeRequest.delete(`/requests/${requestId}`);
      // Remove the deleted request from the state
      setRequests(requests.filter((request) => request.id !== requestId));
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  return (
    <div>
      {requests.map((request) => (
        <div className="request" key={request.id}>
          <div className="container">
            <div className="user">
              <div className="userInfo">
                <img src={"/upload/" + request.profilePicture} alt="" />
                <div className="details">
                  <Link
                    to={`/profile/${request.userId}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="name">{request.username}</span>
                  </Link>
                  <span className="date">
                    {moment(request.createdAt).fromNow()}
                  </span>
                </div>
              </div>
            </div>
            <div className="content">
              <p>{request.description}</p>
              <div className="category">{request.category}</div>
            </div>
            {currentUser.id === request.userId && (
              <div className="options">
                <Button onClick={() => handleDelete(request.id)} style={{color:"#f44336"}}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Request;
