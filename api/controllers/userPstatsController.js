import jwt from 'jsonwebtoken';
import db from "../connect.js";


// Function to get the number of posts for a user
export const getNumberOfPosts = (req, res) => {
  const userId = req.params.userId;
  
      // Query to count the number of posts for the user
      const query = `
        SELECT COUNT(*) AS postCount
        FROM posts
        WHERE userId = ?
      `;
      db.query(query, [userId], (err, result) => {
        if (err) {
          console.error("Error getting number of posts:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.json({ postCount: result[0].postCount });
      });

  };
  





// Function to get the number of followers for a user
export const getNumberOfFollowers = (req, res) => {
  const userId = req.params.userId;
  

    // Query to count the number of followers for the user
    const query = `
      SELECT COUNT(*) AS followerCount
      FROM follow
      WHERE followedId = ?
    `;
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error("Error getting number of followers:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({ followerCount: result[0].followerCount });
    });
  
};

// Function to get the number of following for a user
export const getNumberOfFollowing = (req, res) => {
  const userId = req.params.userId;
 

    // Query to count the number of following for the user
    const query = `
      SELECT COUNT(*) AS followingCount
      FROM follow
      WHERE followerId = ?
    `;
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error("Error getting number of following:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({ followingCount: result[0].followingCount });
    });
  
};
