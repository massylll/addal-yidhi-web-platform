import db from "../connect.js"
import jwt from 'jsonwebtoken';

//======================================>>>>>>>>>>>>>>>>>>>>>>>>> SUBMIT REQUEST <<<<<<<<<<<<<<<<<<<<=================================================================
export const submitRequest = (req, res) => {
    const { category, description } = req.body;
    
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

        // Ensure required fields are provided
        if (!category) {
            return res.status(400).json({ error: "Category is required" });
        }

        // Inserting the request into the database
        const query = `
            INSERT INTO requests (userId, category, description)
            VALUES (?, ?, ?)
        `;
        db.query(query, [userId, category, description], (err, result) => {
            if (err) {
                console.error("Error submitting request:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            // Send back response with user details
            res.json({
                message: "Request submitted successfully",
                userId,
                category,
                description
            });
        });
    });
};


//=========================>>>>>>>>>>>>>>>>>>>>>> DELETE MY REQUESTS <<<<<<<<<<<<<<<<==========================================================================================
// Delete request function
export const deleteRequest = (req, res) => {
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
      const requestId = req.params.id; // Assuming request ID is passed as a parameter
  
      // Check if the request exists
      db.query("SELECT * FROM requests WHERE id = ? AND userId = ?", [requestId, userId], (err, result) => {
        if (err) {
          console.error("Error checking request:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
  
        if (result.length === 0) {
          return res.status(404).json({ error: "Request not found or user is not authorized" });
        }
  
        // Delete the request from the database
        db.query("DELETE FROM requests WHERE id = ?", [requestId], (err, result) => {
          if (err) {
            console.error("Error deleting request:", err);
            return res.status(500).json({ error: "Internal server error" });
          }
  
          res.json({ message: "Request deleted successfully" });
        });
      });
    });
  };






  


//===========================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FORMAT LOCATION <<<<<<<<<<<<<<<<<<<<<<<<<<<<============================================================
const formatRequestsByLocation = (requests) => {
    const formattedResult = [];
    let currentLocation = null;
    let locationRequests = [];

    requests.forEach(request => {
        if (request.location !== currentLocation) {
            // If a new location is encountered, add the previous location's requests to the formatted result
            if (currentLocation !== null) {
                formattedResult.push({ location: currentLocation, requests: locationRequests });
            }
            // Update the current location and reset the locationRequests array
            currentLocation = request.location;
            locationRequests = [];
        }
        // Add the request to the current location's requests
        locationRequests.push(request);
    });

    // Add the last location's requests to the formatted result
    if (currentLocation !== null) {
        formattedResult.push({ location: currentLocation, requests: locationRequests });
    }

    return formattedResult;
};



//========================================>>>>>>>>>>> GET REQUESTS <<<<<<<<<<<<<<<<<<<<<<<====================================================================

export const getRequests = (req, res) => {
    const { category, location } = req.params; 

    // Retrieve the JWT token from the request cookies
    const token = req.cookies.accessToken;

    // Verify the JWT token to get user information
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(403).json("Token is not valid!");
        } else {
            const userId = userInfo.id; // Extract the user ID from the decoded JWT token

            // Determine if the user provided specific locations for the search
            const selectedLocations = location ? location.split(',') : null;

            // Construct the SQL query dynamically based on the scenario
            let query = `
                SELECT r.*, u.username, u.profilePicture, 
                (SELECT AVG(rating) FROM ratings WHERE ratedId = u.id) AS averageRating,
                u.location
                FROM requests r
                INNER JOIN users u ON r.userId = u.id
            `;

            let queryParams = [];

            // If specific locations are provided, adjust the query to fetch requests for those locations
            if (selectedLocations) {
                // Prepare placeholders for the IN clause
                const locationPlaceholders = selectedLocations.map(() => '?').join(',');

                query += `
                    WHERE u.location IN (${locationPlaceholders}) AND r.category = ? AND r.userId != ?
                    ORDER BY u.location ASC, averageRating DESC
                `;

                // Add the category, selected locations, and user ID to the query parameters
                queryParams = [...selectedLocations, category, userId];
            } else {
                // Fetch the user's location from the users table
                const locationQuery = "SELECT location FROM users WHERE id = ?";
                db.query(locationQuery, [userId], (locationErr, locationResult) => {
                    if (locationErr) {
                        console.error("Error fetching user's location:", locationErr);
                        return res.status(500).json({ error: "Internal server error" });
                    }

                    // Extract the user's location from the query result
                    const userLocation = locationResult[0]?.location;

                    // Add the user's location to the main query
                    query += `
                        WHERE u.location = ? AND r.category = ? AND r.userId != ?
                        ORDER BY averageRating DESC
                    `;

                    // Add the user's location, category, and user ID to the query parameters
                    queryParams = [userLocation, category, userId];

                    // Execute the main query with the updated parameters
                    db.query(query, queryParams, (err, result) => {
                        if (err) {
                            console.error("Error fetching requests:", err);
                            return res.status(500).json({ error: "Internal server error" });
                        }

                        // Send back the ordered requests with location names preceding each block of requests
                        const formattedResult = formatRequestsByLocation(result);
                        res.json(formattedResult);
                    });
                });

                // Return here to prevent the main query from executing outside of the else block
                return;
            }

            // Execute the main query with the updated parameters
            db.query(query, queryParams, (err, result) => {
                if (err) {
                    console.error("Error fetching requests:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }

                // Send back the ordered requests with location names preceding each block of requests
                const formattedResult = formatRequestsByLocation(result);
                res.json(formattedResult);
            });
        }
    });
};


