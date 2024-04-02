import db from "../connect.js";// Importing the database connection that we created 
import bcrypt from "bcryptjs";//Importing bcrypt for the password hashing functionality that we defined
import jwt from "jsonwebtoken";// Importing jsonwebtoken for JWT generation to handle authentification functionality that we defined


// Register function with RSA public key generation
export const register = async (req, res) => {
    const { fullname, username, email, password, publicKey } = req.body;

    try {
        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Insert user data into the database
        const insertUserQuery = "INSERT INTO users (fullname, username, email, password) VALUES (?, ?, ?, ?)";
        db.query(insertUserQuery, [fullname, username, email, hashedPassword], async (userErr, userData) => {
            if (userErr) {
                console.error("Error registering user:", userErr);
                return res.status(500).json("Internal server error.");
            }

            const userId = userData.insertId;

            // Insert RSA public key into the database
            const insertRSAKeyQuery = "INSERT INTO rsa_keys (userId, publicKey) VALUES (?, ?)";
            db.query(insertRSAKeyQuery, [userId, publicKey], (rsaErr) => {
                if (rsaErr) {
                    console.error("Error inserting RSA public key:", rsaErr);
                    return res.status(500).json("Internal server error.");
                }

                res.status(200).json("User has been created.");
            });
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json("Internal server error.");
    }
};


// Simplified login function without RSA key retrieval

export const login = (req, res) => {
    const { username, password } = req.body;

    const checkUserQuery = "SELECT * FROM users WHERE username = ?";
    db.query(checkUserQuery, [username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found!");

        const checkPassword = bcrypt.compareSync(password, data[0].password);
        if (!checkPassword) return res.status(400).json("Wrong password or username!");

        const token = jwt.sign({ id: data[0].id }, "secretkey");

        const { password: _, ...userData } = data[0]; // Change 'password' to '_', as it's being used in destructuring
        res.cookie("accessToken", token, { httpOnly: true });
        res.status(200).json(userData);
    });
};


//==================================>>>>>>>>>>>>LOGOUT FUNCTION <<<<<<<<<<<<<<<=========================================
export const logout = (req, res) => {
  res.clearCookie("accessToken",{ //with clearCookie as its name indicates, we clear access token cookie
    secure:true, // we also ensure a secure cookie transmission with setting secure to true
    sameSite:"none"// we also allow cross-site cookies i.e mitigate the risk of cross-site request forgery (CSRF) attacks by preventing cookies from being sent along with certain types of cross-origin requests. 
  }).status(200).json("User has been logged out.")// responding with a status 200 meaning that it is a successfull request which means that the user has been logged out.
};