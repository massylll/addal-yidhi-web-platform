import db from "../connect.js";// we import the db connection
import jwt from "jsonwebtoken";// we import the jsonwebtoken for jwt verification

//===================================>>>>>>>>>>>>> GET LIKES <<<<<<<<=======================================================

export const getLikes = (req,res)=>{
    const q = "SELECT userId FROM likes WHERE postId = ?"; // SQL query to select user IDs who liked a certain post depending on its ID

    db.query(q, [req.query.postId], (err, data) => {//we execute the query defined
      if (err) return res.status(500).json(err);//we return a status 500 : internal server error if any db error occurs
      return res.status(200).json(data.map(like=>like.userId));//status 200 : success message : we send the user IDS who liked the post as a response
    });
}


//====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ADD LIKES <<<<<<<<<<======================================================

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;// we retrieve the jwt token from the request cookies 
  if (!token) return res.status(401).json("Not logged in!");// we here handle the unauthorized access

  jwt.verify(token, "secretkey", (err, userInfo) => {//we verify the jwt token
      if (err) return res.status(403).json("Token is not valid!");//we handle the invalid token case

      const q = "INSERT INTO likes (`userId`, `postId`) VALUES (?, ?)"; //sql query which handles the insertion of a like
      const values = [userInfo.id, req.body.postId];//we here provide values for the query execution

      db.query(q, values, (err, data) => {//we execute the query
          if (err) return res.status(500).json(err);// we here handle any db error : returning a status 500 : internal server error

          // we generate a notification for the user who owns the post with a type of 'Like'
          generateLikeNotification(userInfo.id, req.body.postId);

          return res.status(200).json("Post has been liked.");// status 200 :success message : post been liked
      });
  });
};


//===================================================>>>>GENERATE LIKE NOTIFICATION <<<<<<<<<===================================================================================

const generateLikeNotification = (likerUserId, postId) => {
  // we retrieve the username of the user who liked the post
  const getUsernameQuery = "SELECT username FROM users WHERE id = ?";
  db.query(getUsernameQuery, [likerUserId], (err, result) => {
      if (err) {
          console.error("Error retrieving username:", err);
          return;
      }
       //we handle the case where the user isn't found
      if (result.length === 0) {
          console.error("User not found:", likerUserId);
          return;
      }

      const likerUsername = result[0].username;

      // we retrieve the userId of the owner of the post
      const getUserQuery = "SELECT userId FROM posts WHERE id = ?";
      db.query(getUserQuery, [postId], (err, result) => {
          if (err) {
              console.error("Error retrieving post owner:", err);
              return;
          }
            // we handle the case where the post isn't found
          if (result.length === 0) {
              console.error("Post not found:", postId);
              return;
          }

          const postOwnerUserId = result[0].userId;

          // we construct the notification message
          const message = `${likerUsername} liked your post!`;

          // we insert like notification into the notifications table with a type of 'Like'
          const notificationQuery = "INSERT INTO notifications (userId, type, message, relatedUserId, createdAt) VALUES (?, ?, ?, ?, NOW())";
          const notificationValues = [postOwnerUserId, 'like', message, likerUserId];

          db.query(notificationQuery, notificationValues, (notificationErr, notificationResult) => {
              if (notificationErr) {
                  console.error("Error adding like notification:", notificationErr);// we handle when there's an error triggering a like notification
                  return;
              }

              console.log("Like notification added successfully.");
          });
      });
  });
};


//================================================>>>>>>>>>>>>>>> DELETE LIKES <<<<<<<<<<===============================================================================================


export const deleteLike = (req, res) => {

  const token = req.cookies.accessToken;//we retrieve the JWT token from the request cookies.
  if (!token) return res.status(401).json("Not logged in!");//we handle the unauthorized access

  jwt.verify(token, "secretkey", (err, userInfo) => {//we verify the JWT token
    if (err) return res.status(403).json("Token is not valid!");//we handle the invalid token case

    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";//sql query to delete a like

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {//we execute the query defined 
      if (err) return res.status(500).json(err);// we handle any possible db error : status 500 : internal server error
      return res.status(200).json("Post has been disliked.");// status 200 : success message : deletion of the like
    });
  });
};