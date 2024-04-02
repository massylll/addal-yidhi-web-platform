import db from "../connect.js";//we import the database connection
import jwt from "jsonwebtoken";//we import the jsonwebtoken for the jwt verification
import moment from "moment";// we import moment.js for date and time formatting/manipulation


//===========================================>>>>>>>>>>>>>>>>>>>>GET POSTS<<<<<<<<<<<<<<<<<<<<<<=================================================================================================
export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Not logged in!" });
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json({ error: "Token is not valid!" });
    }

    console.log("User ID:", userInfo.id);

    let query;
    let values;

    if (userId !== undefined) {
      query = `SELECT p.*, u.id AS userId, username, profilePicture 
               FROM posts AS p 
               JOIN users AS u ON (u.id = p.userId) 
               WHERE p.userId = ? 
               ORDER BY p.createdAt DESC`;
      values = [userId];
    } else {
      query = `SELECT p.*, u.id AS userId, username, profilePicture 
               FROM posts AS p 
               JOIN users AS u ON (u.id = p.userId)
               LEFT JOIN follow AS f ON (p.userId = f.followedId) 
               WHERE f.followerId = ? OR p.userId = ?
               ORDER BY p.createdAt DESC`;
      values = [userInfo.id, userInfo.id];
    }

    db.query(query, values, (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (data.length === 0) {
        return res.status(404).json({ error: "No posts found" });
      }

      return res.status(200).json(data);
    });
  });
};

//============================================>>>>>>>>>>>>>> ADD POST <<<<<<<<<<<<<<<<<<<<<<<<<========================================================================================================

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;// we retrieve the JWT token from request cookies
  if (!token) return res.status(401).json("Not logged in!"); //we handle unauthorized access

  jwt.verify(token, "secretkey", (err, userInfo) => {// Verifying the JWT token
    if (err) return res.status(403).json("Token is not valid!");// we handle the invalid token case

    const q =
  "INSERT INTO posts(`description`, `img`, `createdAt`, `userId`) VALUES (?)";// SQL query in order to insert a new post
const values = [
  req.body.description,// the description of the post
  req.body.img, // the image URL of the post
  moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),// using moment.js we format and have the current date and time
  userInfo.id,// this represents the user ID of the logged-in user
];


    db.query(q, [values], (err, data) => {//we execute the query
      if (err) return res.status(500).json(err);//status 500 : we are handling the db error : internal server error
      return res.status(200).json("Post has been created.");// status 200 : successfull request : the post has been created
    });
  });
};


//============================>>>>>>>>>>>>>>>>>>>> DELETE THE POST <<<<<<<<<<<<<<<<<<<<<<<<<<=============================================================================

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;// we retrieve the JWT token from the request cookies
  if (!token) return res.status(401).json("Not logged in!"); // we handle unauthorized access

  jwt.verify(token, "secretkey", (err, userInfo) => {// we verify the JWT token
    if (err) return res.status(403).json("Token is not valid!");//we handle the case where the token is invalid

    const q =
      "DELETE FROM posts WHERE `id`=? AND `userId` = ?";//query to delete the post by getting the postId and the userId from the posts table

    db.query(q, [req.params.id, userInfo.id], (err, data) => {//we execute the query defined
      if (err) return res.status(500).json(err);// handling the db error : status 500 : internal server error
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");//success message : status 200 : deletion of the post done
      return res.status(403).json("You can delete only your post") // Handling unauthorized delete attempt
    });
  });
};