import db from "../connect.js"; // we import the database connection
import jwt from "jsonwebtoken"; // we also import jsonwebtoken for JWT verification
import moment from "moment"; // we then import moment.js for date/time manipulation that we're going to need in createdAt attribut


//=======================>><<<<<<<<<>>>>GET COMMENTS <<<<<<<<=============================================
export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userId, username, profilePicture FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC
    `; //SQL query to retrieve comments for a post and order them in a descending order

  db.query(q, [req.query.postId], (err, data) => { // we execute the sql query
    if (err) return res.status(500).json(err);// we handle the database error
    return res.status(200).json(data); // successfull request which basically will send comments data as a response to the request
  });
};

//===============================>>>>>>POST COMMENT<<<<<<=================================


export const addComment = (req, res) => {
  const token = req.cookies.accessToken; //we extract the jwt token from the request cookies
  if (!token) return res.status(401).json("Not logged in!");// we here have to check if the user is authenticated

  jwt.verify(token, "secretkey", (err, userInfo) => {// we then verify the jwt token
    if (err) return res.status(403).json("Token is not valid!");// here we implemented a status 403 when there's an error in handling the invalid token

    const { content, postId } = req.body; // we go then to extract the comment content and post ID from request body

    const q = "INSERT INTO comments (`content`, `userId`, `postId`, `createdAt`) VALUES (?, ?, ?, ?)";// SQL query in order to insert comment into database in comments table
    const values = [
      content,
      userInfo.id,
      postId,
      moment().format("YYYY-MM-DD HH:mm:ss")// using moment to format the current date and time so we can store it in the db
    ];

    db.query(q, values, (err, data) => {//we execute the sql query to add the comment 
      if (err) { // we implemented a way to handle databse error with a status 500 
        console.error("Error adding comment:", err);
        return res.status(500).json("Error adding comment.");
      }

      // we go then to retrieve the post owner's ID based on the postId
      db.query("SELECT userId FROM posts WHERE id = ?", [postId], (postErr, postResult) => {
        if (postErr || postResult.length === 0) {
          console.error("Error retrieving post owner ID:", postErr || "Post not found");// we handle the error when perhaps the post is not found
          return res.status(500).json("Error adding comment notification.");// error handling the case when the notification couldnt be triggered
        }

        const postOwnerId = postResult[0].userId;// here if no errors occured, we extract the commenter's username

        // we retrieve the commenter's username
        db.query("SELECT username FROM users WHERE id = ?", [userInfo.id], (userErr, userResult) => {
          if (userErr || userResult.length === 0) {
            console.error("Error retrieving commenter username:", userErr || "User not found");
            return res.status(500).json("Error adding comment notification.");
          }

          const commenterUsername = userResult[0].username;

          // we set how to construct the notification message the user is going to receive
          const message = `${commenterUsername} commented on your post`;

          // we then insert the comment notification into the notifications table
          const notificationQuery = "INSERT INTO notifications (userId, type, message, relatedUserId, createdAt) VALUES (?, ?, ?, ?, NOW())";
          const notificationValues = [postOwnerId, 'comment', message, userInfo.id];

          db.query(notificationQuery, notificationValues, (notificationErr, notificationResult) => {
            if (notificationErr) {// we handle here the database error
              console.error("Error adding comment notification:", notificationErr);
              return res.status(500).json("Error adding comment notification.");
            }

            // Return success response which is a status 200 : means that the comment is posted and the notification is triggered
            return res.status(200).json("Comment posted and notification sent!");
          });
        });
      });
    });
  });
};





//============================>>>>>>>>>>>>>>>DELETE COMMENT<<<<<<===================================
export const deleteComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id

    const commentId = req.params.id;

    const q = "DELETE FROM comments WHERE `id` = ? AND `userId` = ?";
    db.query(q, [commentId, userId], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json("Internal server error");
      }

      if (data.affectedRows > 0) {
        return res.json("Comment has been deleted!");
      } else {
        return res.status(403).json("You can delete only your comment!");
      }
    });
  });
};
