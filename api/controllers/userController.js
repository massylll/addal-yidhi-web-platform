import db from "../connect.js";//we import the database connection we created in connect.js
import jwt from "jsonwebtoken";//we import the jsonwebtoken for the jwt verification

export const getMe = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateMe = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `username`=?,`coverPicture`=?,`profilePicture`=?,`location`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.username,
        req.body.coverPicture,
        req.body.profilePicture,
        req.body.location,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};


//=====================>>>>>>>>>>>>>>>>>>>>>>>>> GETTING MY REQUESTS <<<<<<<<<<<<<<<<<<==================================================================

export const getMyRequests = (req, res) => {
  // Extract the user ID from the JWT token
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json({ error: "Token is not valid" });
    }

    const userId = userInfo.id;

    // Fetch requests submitted by the logged-in user with additional user information
    const query = `
      SELECT r.*, u.username, u.profilePicture
      FROM requests r
      INNER JOIN users u ON r.userId = u.id
      WHERE r.userId = ?
      ORDER BY r.createdAt DESC
    `;
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error("Error fetching requests:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Send back the fetched requests with additional user information as a JSON response
      res.json(result);
    });
  });
};
