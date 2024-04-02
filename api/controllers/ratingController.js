import db from "../connect.js";//we import the db connection created
import jwt from "jsonwebtoken";//we import jsonwebtoken for jwt verification

//========================>>>>>>>>>>>> submit a rating <<<<<<<<<<<<<<<<<<<<==========================================================
export const submitRating = (req, res) => {
    const { ratedId, rating } = req.body;//we extract the ratedId and rating from the request body

    // we retrieve the JWT token from the request cookies
    const token = req.cookies.accessToken;

    // we verify the JWT token to ensure authentication
    jwt.verify(token, "secretkey", async (err, userInfo) => {
        if (err) {
            return res.status(403).json("Token is not valid!");// handling the invalid token case
        } else {
            // Insert the rating into the database
            const query = `
                INSERT INTO ratings (ratedId, ratingId, rating)
                VALUES (?, ?, ?)
            `;
            db.query(query, [ratedId, userInfo.id, rating], async (err, result) => {
                if (err) {
                    console.error("Error submitting rating:", err);//logging error
                    return res.status(500).json({ error: "Internal server error" });//we handle the db error
                }

                try {
                    // we calculate the average rating dynamically : sub-query
                    const averageRating = await calculateAverageRating(ratedId);// we call the function defined calculateAverageRating
                    res.json({ message: "Rating submitted successfully", averageRating });//success response with the average rating
                } catch (error) {
                    console.error("Error calculating average rating:", error);// the logging error
                    return res.status(500).json({ error: "Internal server error" });//we handle calculation error
                }
            });
        }
    });
};

// we set a function to calculate average rating for a user "dynamically"
const calculateAverageRating = (ratingId) => {
    return new Promise((resolve, reject) => {
        // Query to calculate average rating using a subquery
        const query = `
            SELECT AVG(rating) AS averageRating
            FROM ratings
            WHERE ratedId = ?
        `;
        db.query(query, [ratingId], (err, result) => {
            if (err) {
                console.error("Error calculating average rating:", err);
                reject(err);//rejecting promise with an error
            }

            // we resolve with average rating
            const averageRating = result[0].averageRating || 0; // Default to 0 if no ratings found/submitted
            resolve(averageRating);
        });
    });
};

// get my average rating :
export const getMyAverageRating = (req, res) => {
    const token = req.cookies.accessToken; // Assuming the token is in cookies, adjust as needed
  
    // Verify JWT token
    jwt.verify(token, 'secretkey', (err, userInfo) => {
      if (err) {
        return res.status(403).json({ error: 'Token is not valid' });
      }
  
      const userId = userInfo.id; // Get the user ID from the decoded token
  
      // Query to calculate the average rating for the logged-in user
      const averageRatingQuery = `
        SELECT AVG(rating) AS averageRating
        FROM ratings
        WHERE ratedId = ?`;
  
      db.query(averageRatingQuery, [userId], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        const averageRating = result[0].averageRating;
  
        if (averageRating === null) {
          return res.status(200).json({ averageRating: 0 }); // Return 0 if no ratings found
        }
  
        return res.status(200).json({ averageRating });
      });
    });
  };
  
