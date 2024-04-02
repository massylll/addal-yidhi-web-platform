import jwt from 'jsonwebtoken';
import db from "../connect.js";

//==================================>>>>> GET NOTIFICATIONS <<<<<<<<<<<<<<<<<<<<<<================================================================================

export const getNotifications = (req, res) => {
    const token = req.cookies.accessToken;//we retrieve the jwt token from the request cookies
    if (!token) return res.status(401).json("Not logged in!");//we handle unauthorized access

    jwt.verify(token, "secretkey", (err, userInfo) => {//we verify the jwt token
        if (err) return res.status(403).json("Token is not valid!");// we handle invalid token case

        const userId = userInfo.id; // we retrieve the user ID from the jwt payload

        // we defined query to fetch notifications for the logged-in user
        const sql = "SELECT message FROM notifications WHERE userId = ?";

        db.query(sql, [userId], (err, results) => {//we excute the query defined
            if (err) {// we handle db error returning a status 500 : internal server error
                console.error("Error retrieving notifications:", err);
                return res.status(500).json("Internal Server Error");
            }

            if (results.length === 0) {// handling the case when there are no notifications for the user.
                return res.status(404).json("No notifications!");
            }

            const notifications = results.map(notification => notification.message);// we extract the message from the results to show it
            return res.status(200).json(notifications);//we send the notifications as a response
        });
    });
};

 //=============================>>>>>>>>>>>>>>>>>>>>>>> MARK NOTIFICATIONS AS READ <<<<<<<<<<<<<<<<<<<========================================================================== 

export const markNotificationAsRead = async (req, res) => {
    const token = req.cookies.accessToken;//we retrieve jwt token from the request cookies
    if (!token) return res.status(401).json("Not logged in!");// we also handle the unauthorized access
  
    jwt.verify(token, "secretkey", async (err, userInfo) => {//we verify the jwt token
      if (err) return res.status(403).json("Token is not valid!");//we handle the invalid token
  
      const notificationId = req.params.notificationId; //we retrieve the notificationId from the request parameters 
  
      try {
        // we define a query to mark a notification as read.... isRead is TINYINT set to 0 by DEFAULT, when the user reads it it sets itself to 1.(same concept of BOOLEAN false/true)
        const query = "UPDATE notifications SET isRead = 1 WHERE id = ? AND userId = ?";
        await db.query(query, [notificationId, userInfo.id]);//we execute the query defined
        return res.status(200).json("Notification marked as read.");// we send a success message : status 200 : notification marked as read 
      } catch (error) {//this is for handling any database error 
        console.error("Error marking notification as read:", error);
        return res.status(500).json("Error marking notification as read.");//returning a status 500 : internal server error.
      }
    });
  };