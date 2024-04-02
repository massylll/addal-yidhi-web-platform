import "./rightBar.scss";
import {makeRequest} from "../../axios.js";
import { useEffect, useState } from "react";
import StarHalfOutlinedIcon from '@mui/icons-material/StarHalfOutlined';
import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
import SentimentVeryDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import TagFacesOutlinedIcon from '@mui/icons-material/TagFacesOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import AssistantOutlinedIcon from '@mui/icons-material/AssistantOutlined';


const RightBar = () => {

  //=======================>>>>>>>>>>>>>>>>> GET SUGGESTIONS <<<<<<<<<<<<<<======================================================
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    // Fetch suggestions from the backend
    makeRequest.get('/follow/suggestions')
      .then(response => {
        setSuggestedUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching suggestions:', error);
      });
  }, []);


  const followUser = (followedId) => {
    makeRequest.post("/follow", { followedId })
      .then(response => {
        console.log(response.data); // Log the success message or handle it as needed

        // After following the user, we remove them from the list of suggestions
        setSuggestedUsers(prevUsers => prevUsers.filter(user => user.id !== followedId));
      })
      .catch(error => {
        console.error('Error following user:', error);
      });
  };

  const dismissSuggestion = (dismissedId) => {
    // here we remove the dismissed user from the list of suggestions
    setSuggestedUsers(prevUsers => prevUsers.filter(user => user.id !== dismissedId));
  };


//========================>>>>>>>>>>>>>>>>>>> GET NOTIFICATIONS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<===================================================
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from the backend
    makeRequest.get('/notifications')
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  }, []);

//============================>>>>>>>>>>>>>>>>>>>>>>> GET MY AVERAGE RATING <<<<<<<<<<<<<<<<<<==================================
const [averageRating, setAverageRating] = useState(null);

useEffect(() => {
  // Fetch average rating from the backend
  makeRequest.get('/ratings/')
    .then(response => {
      setAverageRating(response.data.averageRating);
    })
    .catch(error => {
      console.error('Error fetching average rating:', error);
    });
}, []);

let ratingComponent;
if (averageRating === null) {
  ratingComponent = "Loading...";
} else if (averageRating === 0) {
  ratingComponent = "Nobody rated you yet";
} else if (averageRating < 3) {
  ratingComponent = (
    <span>
      {averageRating} <SentimentVeryDissatisfiedOutlinedIcon />
    </span>
  );
} else if (averageRating >= 3 && averageRating < 5) {
  ratingComponent = (
    <span>
      {averageRating} <SentimentDissatisfiedOutlinedIcon />
    </span>
  );
} else if (averageRating >= 5 && averageRating < 8) {
  ratingComponent = (
    <span>
      {averageRating} <TagFacesOutlinedIcon />
    </span>
  );
} else if (averageRating >= 8 && averageRating <= 10) {
  ratingComponent = (
    <span>
      {averageRating} <SentimentVerySatisfiedOutlinedIcon />
    </span>
  );
}





  return (
    <div className="rightBar">
      <div className="container">

      <div className="item">
      <span>My Average Rating <StarHalfOutlinedIcon /></span><br></br>
      <span>{ratingComponent}</span>
    </div>

    <div className="item">
      <span>Notifications <NotificationsActiveOutlinedIcon/></span>
      {notifications.map((notification, index) => (
        <div className="user" key={index}>
          <div className="userInfo">
            <p>{notification}</p>
          </div>
         
          { /*<span>{notification.createdAt}</span>*/}
        </div>
      ))}
    </div>

      <div className="item">
      <span>Suggestions For You <AssistantOutlinedIcon/></span>
      {suggestedUsers.map(user => (
        <div className="user" key={user.id}>
          <div className="userInfo">
            <img src={user.profilePicture} alt={user.username} />
            <span>{user.username}</span>
          </div>
          <div className="buttons">
          <button onClick={() => { followUser(user.id) }}>Follow</button>
                <button onClick={() => { dismissSuggestion(user.id) }}>Dismiss</button>
          </div>
        </div>
      ))}
    </div>





   







    
      </div>
    </div>
  );
};

export default RightBar;
