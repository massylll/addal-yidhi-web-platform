import "./profile.scss";

import PlaceIcon from "@mui/icons-material/Place";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { useEffect } from "react";
import { Box } from "@mui/material";
import MaleOutlinedIcon from '@mui/icons-material/MaleOutlined';
import FemaleOutlinedIcon from '@mui/icons-material/FemaleOutlined';
import { Button } from "@mui/material";

const Profile = () => {



  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);




  const userId = parseInt(useLocation().pathname.split("/")[2]);




  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );





  const { isLoading: fIsLoading, data: followData } = useQuery(
    ["follow"],
    () =>
      makeRequest.get("/follow?followedId=" + userId).then((res) => {
        return res.data;
      })
  );




  const queryClient = useQueryClient();





  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/follow?userId=" + userId);
      return makeRequest.post("/follow", { followerId: currentUser.id, followedId: userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["follow"]);
      },
    }
  );
  





  const handleFollow = () => {
    mutation.mutate(followData.includes(currentUser.id));
  };


  const [profileStats, setProfileStats] = useState({
    numberOfPosts: 0,
    numberOfFollowers: 0,
    numberOfFollowing: 0,
  });

  // Fetch number of posts, followers, and following
  const fetchProfileStats = async () => {
    try {
      const [postsRes, followersRes, followingRes] = await Promise.all([
        makeRequest.get(`/profilestats/numberposts/${userId}`),
        makeRequest.get(`/profilestats/numberfollowers/${userId}`),
        makeRequest.get(`/profilestats/numberfollowing/${userId}`),
      ]);
  
      setProfileStats({
        numberOfPosts: postsRes.data.postCount,
        numberOfFollowers: followersRes.data.followerCount,
        numberOfFollowing: followingRes.data.followingCount,
      });
    } catch (error) {
      console.error("Error fetching profile stats:", error);
    }
  };
  

  useEffect(() => {
    fetchProfileStats();
  }, [userId]);


 


  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={"/upload/"+data.coverPicture} alt="" className="cover" />
            <img src={"/upload/"+data.profilePicture} alt="" className="profilePicture" />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              
              <div className="center">
                <span>{data.username}</span>
                
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.location}</span>
                  </div>
                  <div className="item">
                   
                    {data.gender === "Male" ? (
                      <MaleOutlinedIcon /> // we render Male icon if gender is Male
                    ) : (
                      <FemaleOutlinedIcon /> // er render Female icon if gender is Female
                    )}
                    <span>{data.gender}</span>
                  </div>
                  <div className="item">
                    <LocalPhoneOutlinedIcon />
                    <span>{data.phoneNumber}</span>
                  </div>
                  
                </div>
                <Box className="stats">
                 
          <p>Posts:</p> <p>{profileStats.numberOfPosts}</p>
        
        
          <p>Followers:</p> <p> {profileStats.numberOfFollowers}</p>
          
         
          <p>Following:</p> <p> {profileStats.numberOfFollowing}</p>
        
        </Box>
                {fIsLoading ? (
                  "loading"
                ) : userId === currentUser.id ? (
                  <Button onClick={() => setOpenUpdate(true)}>update</Button>
                ) : (
                  <button onClick={handleFollow}>
                    {followData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <SendOutlinedIcon/>
                
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
      
    </div>
  );
};

export default Profile;
