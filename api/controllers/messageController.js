import jwt from 'jsonwebtoken';
import db from '../connect.js';
import io  from '../server.js';

//====================================>>>>>>>>>>>>>>>>>>>>>>GETTING THE INBOX <<<<<<<<<<<<<=======================================

export const getConversations = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        try {
            // Fetch all unique users with whom the authenticated user has exchanged messages
            const conversationsQuery = `
                SELECT DISTINCT u.id AS userId, u.username, u.profilePicture, m.content AS lastMessage, m.createdAt AS lastMessageTimestamp
                FROM users u
                LEFT JOIN messages m ON (u.id = m.senderId OR u.id = m.receiverId)
                WHERE (m.senderId = ? OR m.receiverId = ?) AND u.id != ?
                ORDER BY m.createdAt DESC
            `;
            const conversationsValues = [userInfo.id, userInfo.id, userInfo.id];

            db.query(conversationsQuery, conversationsValues, async (err, conversationRows) => {
                if (err) {
                    console.error("Error fetching conversations:", err);
                    return res.status(500).json("Internal server error.");
                }

                // Group conversations by userId and keep only the latest message for each user
                const conversationsMap = new Map();
                conversationRows.forEach(row => {
                    const userId = row.userId;
                    if (!conversationsMap.has(userId)) {
                        conversationsMap.set(userId, row);
                    }
                });

                // Convert map values to an array of conversations
                const conversations = Array.from(conversationsMap.values());

                return res.status(200).json(conversations);
            });
        } catch (error) {
            console.error("Error fetching conversations:", error);
            return res.status(500).json("Internal server error.");
        }
    });
};



//===================================>>>>>>>>>>>>>>>>>>>>>>> SEND MESSSAGE <<<<<<<<<<<<<<<<<=============================================
export const sendMessage = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const { receiverId, content } = req.body;

        try {
            // Insert the message into the database
            const insertMessageQuery = "INSERT INTO messages (senderId, receiverId, content, createdAt) VALUES (?, ?, ?, NOW())";
            db.query(insertMessageQuery, [userInfo.id, receiverId, content], async (err, result) => {
                if (err) {
                    return res.status(500).json("Error storing message in the database");
                }

                // Emit the message to the recipient using Socket.IO
                io.to(receiverId).emit('newMessage', { senderId: userInfo.id, content, createdAt: new Date() });

                return res.status(200).json("Message sent successfully.");
            });
        } catch (error) {
            console.error("Error sending message:", error);
            return res.status(500).json("Internal server error.");
        }
    });
};





//========================>>>>>>>>>>>>>>>>>>>>>>>>GET MESSAGES HISTORY <<<<<<<<<<===============================================
export const getMessageHistory = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const receiverId = req.params.receiverId;

        try {
            // Check if the sender has exchanged messages with the receiver
            const exchangeQuery = `
                SELECT COUNT(*) AS messageCount
                FROM messages
                WHERE (senderId = ? AND receiverId = ?)
            `;
            const exchangeValues = [userInfo.id, receiverId];
            db.query(exchangeQuery, exchangeValues, async (err, result) => {
                if (err) {
                    return res.status(500).json("Error checking message exchange");
                }

                if (result[0].messageCount === 0) {
                    return res.status(200).json("No messages exchanged");
                }

                // Query database for message history between sender and receiver
                const q = `
                SELECT *
                FROM messages
                WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
                ORDER BY createdAt ASC
                
                `;
                const values = [userInfo.id, receiverId, receiverId, userInfo.id];

                db.query(q, values, async (err, messageRows) => {
                    if (err) {
                        return res.status(500).json("Error fetching message history");
                    }

                    return res.status(200).json(messageRows);
                });
            });
        } catch (error) {
            console.error("Error fetching message history:", error);
            return res.status(500).json("Internal server error.");
        }
    });
};

