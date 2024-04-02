import db from "../connect.js";//we import the db connection
import jwt from "jsonwebtoken";//we import the jsonwebtoken for jwt verification
import moment from "moment";//we import moment.js for date and time manipulation and formatting

//=================================>>>>>>>>>>>>>>GET STORIES<<<<<<<<<<<<<<<<<<<<<<================================================================

export const getStories = (req, res) => {
  const token = req.cookies.accessToken;//we extract the jwt token from request cookies
  if (!token) return res.status(401).json("Not logged in!");// we check here if the user is authenticated

  jwt.verify(token, "secretkey", (err, userInfo) => {//we verify the jwt token
    if (err) return res.status(403).json("Token is not valid!");//we handle then the invalid token case

    const userId = userInfo.id;
    console.log(userId);
    

    const q = `SELECT s.*, username FROM stories AS s JOIN users AS u ON (u.id = s.userId)
    LEFT JOIN follow AS r ON (s.userId = r.followedId AND r.followerId= ?) LIMIT 4`;//we go to retrieve the information about stories and their respective user's username, while also indicating whether the current user is following the users who posted the stories, limited to a maximum of 4 results.

    db.query(q, [userInfo.id], (err, data) => {//we execute the sql query
      if (err) return res.status(500).json(err);//we handle the db error
      return res.status(200).json(data);// status 200 successful request : sending stories data as a response
    });
  });
};

//==============================>>>>>>>>>>>>>>>>>> ADD STORY <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<=================================================================================================

export const addStory = (req, res) => {
  const token = req.cookies.accessToken;//we extract the jwt token from request cookies
  if (!token) return res.status(401).json("Not logged in!");//we check if the user is authenticated

  jwt.verify(token, "secretkey", (err, userInfo) => {//verifying the jwt token
    if (err) return res.status(403).json("Token is not valid!");//we handle the invalid token

    const q = "INSERT INTO stories(`img`, `createdAt`, `userId`) VALUES (?)";// SQL query to insert the story into db
    const values = [
      req.body.img,//we extract the image url from request body
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),//using moment that we imported to format the current date and time
      userInfo.id,// we extract user ID from JWT token
    ];

    db.query(q, [values], (err, data) => {//we execute the sql query to add a story
      if (err) return res.status(500).json(err);//we handle the db error returning a status 500 : internal server error
      return res.status(200).json("Story posted!!");//we send a success message : status 200 : story posted
    });
  });
};

export const deleteStory = (req, res) => {
  const token = req.cookies.accessToken;//we extract the jwt token from request cookies
  if (!token) return res.status(401).json("Not logged in!");//we check if the user is authenticated

  jwt.verify(token, "secretkey", (err, userInfo) => {//we verify the jwt token
    if (err) return res.status(403).json("Token is not valid!");//we handle the invalid token

    const q = "DELETE FROM stories WHERE `id`=? AND `userId` = ?";// SQL query to delete a story by getting the story's id and userId in the stories table

    db.query(q, [req.params.id, userInfo.id], (err, data) => {//we execute the sql query
      if (err) return res.status(500).json(err);//we handle the db error
      if (data.affectedRows > 0)//we check if the story has been deleted
        return res.status(200).json("Story has been deleted."); //status 200 : returning a success message saying the story has been deleted.
      return res.status(403).json("You can delete only your story!");// handling unauthorized deletion attempt
    });
  });
};