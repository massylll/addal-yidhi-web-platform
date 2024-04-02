

import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Select, MenuItem, Button, FormControl, InputLabel } from "@mui/material";
import { makeRequest } from "../../axios.js";
import { AuthContext } from "../../context/authContext.js";
import moment from "moment";
import { Link } from "react-router-dom";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import "./Community.css"; // Importing the CSS file




const reasons = [
  "Inappropriate language",
  "Spam",
  "Harassment",
  "Hate speech",
  "Violent content",
  "False information",
  "Irrelevant content",
];

const Community = () => {



  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [category, setCategory] = useState("");
  const [locations, setLocations] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    fetchData();
  }, [category, locations]);

  const fetchData = async () => {
    console.log("Fetching data...");
    try {
      const locationParam = locations.length > 0 ? locations.join(',') : currentUser ? currentUser.location : "user_location";
      const response = await makeRequest.get(`/requests/${category}/${locationParam}`);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocations(event.target.value);
  };

  const submitReport = async (postId, reportReason) => {
    try {
      await makeRequest.post("/reports", { postId, reason: reportReason });
      // Optionally, you can show a success message or update the UI
    } catch (error) {
      console.error("Error submitting report:", error);
      // Handle error (display error message, etc.)
    }
  };

  return (
    <Box className="community-container">
      <Box mb={2} className="form-control">
        <FormControl>
          <InputLabel id="category-label" style={{ width: '150px' }}>Category</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            onChange={handleCategoryChange}
          >
             <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Archery">Archery</MenuItem>
            <MenuItem value="Athletics">Athletics</MenuItem>
            <MenuItem value="Basketball">Basketball</MenuItem>
            <MenuItem value="Baseball">Baseball</MenuItem>
            <MenuItem value="Boxing">Boxing</MenuItem>
            <MenuItem value="Cycling">Cycling</MenuItem>
            <MenuItem value="Football">Football</MenuItem>
            <MenuItem value="Golf">Golf</MenuItem>
            <MenuItem value="Gymnastics">Gymnastics</MenuItem>
            <MenuItem value="Handball">Handball</MenuItem>
            <MenuItem value="Hockey">Hockey</MenuItem>
            <MenuItem value="Martial Arts">Martial Arts</MenuItem>
            <MenuItem value="Rugby">Rugby</MenuItem>
            <MenuItem value="Sailing">Sailing</MenuItem>
            <MenuItem value="Skiing">Skiing</MenuItem>
            <MenuItem value="Snowboarding">Snowboarding</MenuItem>
            <MenuItem value="Surfing">Surfing</MenuItem>
            <MenuItem value="Swimming">Swimming</MenuItem>
            <MenuItem value="Table Tennis">Table Tennis</MenuItem>
            <MenuItem value="Tennis">Tennis</MenuItem>
            <MenuItem value="Volleyball">Volleyball</MenuItem>
            <MenuItem value="Weightlifting">Weightlifting</MenuItem>
            <MenuItem value="Wrestling">Wrestling</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="location-label">Location</InputLabel>
          <Select
            labelId="location-label"
            multiple
            value={locations}
            onChange={handleLocationChange}
            renderValue={(selected) => selected.join(', ')}
          >
            <MenuItem value="">All Locations</MenuItem>
            <MenuItem value="Adrar">Adrar</MenuItem>
            <MenuItem value="Algiers">Algiers</MenuItem>
            <MenuItem value="Annaba">Annaba</MenuItem>
            <MenuItem value="Béchar">Béchar</MenuItem>
            <MenuItem value="Béjaïa">Béjaïa</MenuItem>
            <MenuItem value="Blida">Blida</MenuItem>
            <MenuItem value="Bordj Bou Arréridj">Bordj Bou Arréridj</MenuItem>
            <MenuItem value="Bouira">Bouira</MenuItem>
            <MenuItem value="Boumerdès">Boumerdès</MenuItem>
            <MenuItem value="Chlef">Chlef</MenuItem>
            <MenuItem value="Constantine">Constantine</MenuItem>
            <MenuItem value="Djelfa">Djelfa</MenuItem>
            <MenuItem value="El Bayadh">El Bayadh</MenuItem>
            <MenuItem value="El Oued">El Oued</MenuItem>
            <MenuItem value="El Taref">El Taref</MenuItem>
            <MenuItem value="Ghardaïa">Ghardaïa</MenuItem>
            <MenuItem value="Guelma">Guelma</MenuItem>
            <MenuItem value="Illizi">Illizi</MenuItem>
            <MenuItem value="Jijel">Jijel</MenuItem>
            <MenuItem value="Khenchela">Khenchela</MenuItem>
            <MenuItem value="Laghouat">Laghouat</MenuItem>
            <MenuItem value="Mascara">Mascara</MenuItem>
            <MenuItem value="Médéa">Médéa</MenuItem>
            <MenuItem value="Mila">Mila</MenuItem>
            <MenuItem value="Mostaganem">Mostaganem</MenuItem>
            <MenuItem value="M'Sila">M'Sila</MenuItem>
            <MenuItem value="Naâma">Naâma</MenuItem>
            <MenuItem value="Oran">Oran</MenuItem>
            <MenuItem value="Ouargla">Ouargla</MenuItem>
            <MenuItem value="Oum El Bouaghi">Oum El Bouaghi</MenuItem>
            <MenuItem value="Relizane">Relizane</MenuItem>
            <MenuItem value="Saïda">Saïda</MenuItem>
            <MenuItem value="Sétif">Sétif</MenuItem>
            <MenuItem value="Sidi Bel Abbès">Sidi Bel Abbès</MenuItem>
            <MenuItem value="Skikda">Skikda</MenuItem>
            <MenuItem value="Souk Ahras">Souk Ahras</MenuItem>
            <MenuItem value="Tamanghasset">Tamanghasset</MenuItem>
            <MenuItem value="Tébessa">Tébessa</MenuItem>
            <MenuItem value="Tiaret">Tiaret</MenuItem>
            <MenuItem value="Tindouf">Tindouf</MenuItem>
            <MenuItem value="Tipaza">Tipaza</MenuItem>
            <MenuItem value="Tissemsilt">Tissemsilt</MenuItem>
            <MenuItem value="Tizi Ouzou">Tizi Ouzou</MenuItem>
          </Select>
        </FormControl>
        
      </Box>
      {requests.map((locationData) => (
        <Box key={locationData.location}>
          <Typography variant="h4" className="location-heading">{locationData.location}</Typography>
          {locationData.requests.map((request) => (
            <Box key={request.id} className="post-box" border={1} m={2} p={2}>
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
                    <span className="date">{moment(request.createdAt).fromNow()}</span>
                  </div>
                </div>
                 
                {request.userId !== currentUser.id && (
                  <Button variant="outlined" color="error" onClick={() => submitReport(request.id, '')}>Report</Button>
                )}
              </div>
              <div className="content">
                <Typography variant="body1">{request.description}</Typography>
              </div>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default Community;
