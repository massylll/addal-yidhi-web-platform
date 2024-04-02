import  db  from "../connect.js";// we import the database connection we created
import jwt from "jsonwebtoken";//we import jsonwebtoken for the jwt verification



//===============================>>>>>>GET FOLLOWERS<<<<<<<============================================================================================================

export const getFollow = (req,res)=>{
    const q = "SELECT followerId FROM follow WHERE followedId = ?"; // SQL query to select followers of a user

    db.query(q, [req.query.followedId], (err, data) => {// we execute the query defined previously
      if (err) return res.status(500).json(err);// we implement a handling case for db error
      return res.status(200).json(data.map(follow=>follow.followerId));// status 200 : successfull request which means sending the follower IDs as a response
    });
}


//==================================>>>>>>>>>ADD FOLLOW<<<<<<<<<<<<<<<<<=========================================================================================================

export const addFollow = (req, res) => {
  const token = req.cookies.accessToken;//we extract jwt token from the request cookies
  if (!token) return res.status(401).json("Not logged in!");// here we check if user is authenticated

  jwt.verify(token, "secretkey", (err, userInfo) => {// we verify the jwt token
    if (err) return res.status(403).json("Token is not valid!");// we handle invalid token

    const followedUserId = req.body.followedId; //we extract the followed user id from the request body

    // we insert a follow record into the follow table
    const followQuery = "INSERT INTO follow (followerId, followedId) VALUES (?, ?)";
    const followValues = [userInfo.id, followedUserId];//userInfo.id is the authenticated user which means he is the followerId

    db.query(followQuery, followValues, (followErr, followResult) => {
      if (followErr) {// here we handle the database error with a status 500 : internal server error
        console.error("Error adding follow:", followErr);
        return res.status(500).json("Error adding follow.");
      }

      // we retrieve the username of the follower from users table depending on the id
      db.query("SELECT username FROM users WHERE id = ?", [userInfo.id], (userErr, userResult) => {
        if (userErr || userResult.length === 0) {// we also handle the database error with a status 500
          console.error("Error retrieving follower username:", userErr || "User not found");
          return res.status(500).json("Error adding follow notification.");
        }

        const followerUsername = userResult[0].username;// if no errors we extract the follower's username

        // we go then to construct the notification message which is going to be stored in the notifications table after the notification gets triggered
        const message = `${followerUsername} followed you`;

        // we insert follow notification (type) into the notifications table
        const notificationQuery = "INSERT INTO notifications (userId, type, message, relatedUserId, createdAt) VALUES (?, ?, ?, ?, NOW())";
        const notificationValues = [followedUserId, 'follow', message, userInfo.id];

        db.query(notificationQuery, notificationValues, (notificationErr, notificationResult) => {
          if (notificationErr) {//here we handle the notification insertion error responding with a status 500 : internal server error
            console.error("Error adding follow notification:", notificationErr);
            return res.status(500).json("Error adding follow notification.");
          }

          // Returning a success message : it means that the follow request worked and the notification is triggered so the followedId can see it
          return res.status(200).json("Following!");
        });
      });
    });
  });
};


//======================================>>>>>>>>>>>>> DELETE FOLLOW<<<<<<<<<<<<<<<<<<<<<<<====================================================================================================

export const deleteFollow = (req, res) => {

  const token = req.cookies.accessToken;// we extract the jwt token from request cookies
  if (!token) return res.status(401).json("Not logged in!");// checking if user is authenticated

  jwt.verify(token, "secretkey", (err, userInfo) => {// we verify the jwt token 
    if (err) return res.status(403).json("Token is not valid!");//we handle the invalid token case

    const q = "DELETE FROM follow WHERE `followerId` = ? AND `followedId` = ?";//we here execute the SQL query to delete the follow

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {//we execute the SQL query defined previously in order for the user to delete the follow
      if (err) return res.status(500).json(err);// we handle the db error returning a status 500 : internal server error
      return res.status(200).json("Unfollowed!");//sending a status 200 : successfull request which gives a "unfollowed!"
    });
  });
};

//===================================>>>>>>>>>>>>>SUGGESTIONS<<<<<<<<<<<<<<<===============================================================================================
export const getFollowSuggestions = (req, res) => {
  const token = req.cookies.accessToken; // Assuming the token is in cookies, adjust as needed

  // Verify JWT token
  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) {
      return res.status(403).json({ error: 'Token is not valid' });
    }

    const userId = userInfo.id; // Get the user ID from the decoded token

    // Query to fetch users followed by the followed users of the logged-in user
    const followedByFollowedQuery = `
      SELECT f.followedId
      FROM follow AS f
      WHERE f.followerId IN (
        SELECT followedId
        FROM follow
        WHERE followerId = ?
      ) AND f.followedId != ?
      GROUP BY f.followedId`;

    db.query(followedByFollowedQuery, [userId, userId], (err, suggestedUsers) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (suggestedUsers.length === 0) {
        return res.status(404).json({ message: 'No follow suggestions found' });
      }

      // Fetch the IDs of the suggested users
      const suggestedUserIds = suggestedUsers.map(user => user.followedId);

      // Query to fetch users that are suggested and not already followed by the logged-in user
      const suggestedUsersQuery = `
        SELECT id, username, profilePicture
        FROM users
        WHERE id IN (${suggestedUserIds.map(() => '?').join(',')})
        AND id NOT IN (
          SELECT followedId
          FROM follow
          WHERE followerId = ?
        )`;

      // Add the userId to the array of parameters
      const queryParams = [...suggestedUserIds, userId];

      db.query(suggestedUsersQuery, queryParams, (err, suggestedUsersData) => {
        if (err) {
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json(suggestedUsersData);
      });
    });
  });
};
