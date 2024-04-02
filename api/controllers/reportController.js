import db from "../connect.js";
import jwt from 'jsonwebtoken';

//=========================>>>>>>>>> SUBMITTING A REPORT <<<<<<<<<<<<<<<<<<<=============================================
export const submitReport = (req, res) => {
    // we extract necessary information from the request body : the user can report a post, comment or a request then set a reason why which is a select because the reason is ENUM
    const { postId, commentId, requestId, reason } = req.body;

    // we then validate at least one item ID is provided
    if (!postId && !commentId && !requestId) {
        return res.status(400).json({ error: "At least one item ID must be provided" });
    }

    // we go determine the reported item type
    let itemType;
    let itemId;

    if (postId) {
        itemType = 'post';
        itemId = postId;
    } else if (commentId) {
        itemType = 'comment';
        itemId = commentId;
    } else if (requestId) {
        itemType = 'request';
        itemId = requestId;
    }

    // w extract the user ID from the JWT token
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ error: "Not logged in" });
    }

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(403).json({ error: "Token is not valid" });
        }

        const userId = userInfo.id;

        // w validate input parameters
        if (!itemId || !reason) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        // w insert the reported item into the database in reported_items table
        const insertReportedItemQuery = `
            INSERT INTO reported_items (${itemType}Id)
            VALUES (?)
        `;
        db.query(insertReportedItemQuery, [itemId], (insertErr, insertResult) => {
            if (insertErr) {
                console.error("Error inserting reported item:", insertErr);
                return res.status(500).json({ error: "Internal server error" });
            }

            // Insert the report into the reports table
            const reportedItemId = insertResult.insertId;
            const insertReportQuery = `
                INSERT INTO reports (userId, reportedItemId, reportedItemType, reason, submittedAt)
                VALUES (?, ?, ?, ?, NOW())
            `;
            db.query(insertReportQuery, [userId, reportedItemId, itemType, reason], (reportErr, reportResult) => {
                if (reportErr) {
                    console.error("Error inserting report:", reportErr);
                    return res.status(500).json({ error: "Internal server error" });
                }

                // Send back success response
                res.json({ message: "Report submitted successfully" });
            });
        });
    });
};




// Function to retrieve reports submitted by the user
export const getUserReports = (req, res) => {
    // Extract user ID from the JWT token
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ error: "Not logged in" });
    }

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(403).json({ error: "Token is not valid" });
        }

        const userId = userInfo.id;

        // Query to fetch reports submitted by the user along with reported item details
        const query = `
            SELECT reports.*, reports.reportedItemType,
                   CASE
                       WHEN reports.reportedItemType = 'post' THEN posts.userId
                       WHEN reports.reportedItemType = 'comment' THEN comments.userId
                       WHEN reports.reportedItemType = 'request' THEN requests.userId
                   END AS ownerId
            FROM reports
            JOIN reported_items ON reports.reportedItemId = reported_items.id
            LEFT JOIN posts ON reported_items.postId = posts.id
            LEFT JOIN comments ON reported_items.commentId = comments.id
            LEFT JOIN requests ON reported_items.requestId = requests.id
            WHERE reports.userId = ?
        `;
        db.query(query, [userId], async (err, results) => {
            if (err) {
                console.error("Error fetching user reports:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            // Construct the messages with owner usernames
            const reportsWithOwners = [];
            for (const report of results) {
                const { submittedAt, reportedItemType, reason, ownerId } = report;
                let ownerUsername;

                switch (reportedItemType) {
                    case 'post':
                    case 'comment':
                    case 'request':
                        // Fetch owner's username from users table based on ownerId
                       
                       try {
                        const userQuery = 'SELECT username FROM users WHERE id = ?';
                        const [userData] = await db.query(userQuery, [ownerId]);
                    
                        if (Array.isArray(userData) && userData.length > 0) {
                            ownerUsername = userData[0].username;
                        } else {
                            console.error(`Owner with ID ${ownerId} not found.`);
                            ownerUsername = 'Unknown';
                        }
                    } catch (error) {
                        console.error('Error fetching owner username:', error);
                        ownerUsername = 'Unknown';
                    }

                        break;
                    default:
                        ownerUsername = 'Unknown';
                }

                reportsWithOwners.push({
                    submittedAt,
                    reportedItemType,
                    ownerUsername,
                    reason
                });
            }

            res.json({ reports: reportsWithOwners });
        });
    });
};