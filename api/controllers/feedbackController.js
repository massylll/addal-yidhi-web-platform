import db from "../connect.js";//we import the database connection
import jwt from "jsonwebtoken";//we import jsonwebtoken for the jwt verification


//==============================>>>>>>>>>>>>>>>SUBMIT FEEDBACK<<<<<<<<<<<<==================================================

export const submitFeedback = (req, res) => {
    const token = req.cookies.accessToken; // Retrieve the JWT token from the request cookies

    // Check if the token is missing
    if (!token) {
        return res.status(401).json({ error: "Not logged in" });
    }

    // Verify the JWT token
    jwt.verify(token, "secretkey", (err, userInfo) => {
        // If there's an error while verifying the token
        if (err) {
            return res.status(403).json({ error: "Token is not valid" });
        }

        // At this point, the token is valid and the user is authenticated
        // Proceed with your logic here

        const userId = userInfo.id; // Retrieve the user ID from the decoded JWT token

        const { message } = req.body; // Extract the feedback message from the request body

        // Retrieve username and email from users table based on user ID
        const userQuery = `
            SELECT username, email
            FROM users
            WHERE id = ?
        `;
        db.query(userQuery, [userId], (userErr, userResult) => {
            if (userErr) {
                console.error("Error fetching user details:", userErr);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (userResult.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            const { username, email } = userResult[0];

            // Insert the feedback into the database
            const query = `
                INSERT INTO feedbacks (userId, username, email, message, createdAt)
                VALUES (?, ?, ?, ?, NOW())
            `;
            db.query(query, [userId, username, email, message], (dbErr, result) => {
                if (dbErr) {
                    console.error("Error submitting feedback:", dbErr);
                    return res.status(500).json({ error: "Internal server error" });
                }

                res.json({ message: "Feedback submitted successfully" });
            });
        });
    });
};


export const submitUserThoughts = (req, res) => {
    const token = req.cookies.accessToken; // Extract the JWT token from the request cookies

    // Check if the token is missing
    if (!token) {
        return res.status(401).json("Not logged in!"); // Return 401 Unauthorized status
    }

    // Verify the JWT token
    jwt.verify(token, "secretkey", (err, userInfo) => {
        // If there's an error while verifying the token
        if (err) {
            return res.status(403).json("Token is not valid!"); // Return 403 Forbidden status
        }

        // At this point, the token is valid and the user is authenticated
        // Proceed with your logic here

        // For example, you can access user information from userInfo
        const userId = userInfo.id;

        // Now you can continue with your logic, such as submitting user thoughts
        const { commentsThoughts, postsThoughts, requestsThoughts, storiesThoughts } = req.body;

        const query = `
            INSERT INTO users_thoughts (userId, commentsThoughts, postsThoughts, requestsThoughts, storiesThoughts)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            commentsThoughts = VALUES(commentsThoughts),
            postsThoughts = VALUES(postsThoughts),
            requestsThoughts = VALUES(requestsThoughts),
            storiesThoughts = VALUES(storiesThoughts)
        `;
        db.query(query, [userId, commentsThoughts, postsThoughts, requestsThoughts, storiesThoughts], (dbErr, result) => {
            if (dbErr) {
                console.error("Error submitting user thoughts:", dbErr);
                return res.status(500).json({ error: "Internal server error" });
            }

            res.json({ message: "User thoughts submitted successfully" });
        });
    });
};

