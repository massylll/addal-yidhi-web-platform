# Addal Yidhi: A Secure Social Platform for Sports Matchmaking

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-black?logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?logo=socket.io&badgeColor=010101)](https://socket.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://mysql.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Bcrypt](https://img.shields.io/badge/Hashing-Bcrypt-blue)](https://www.npmjs.com/package/bcrypt)

Addal Yidhi is an end-to-end encrypted web-based social platform designed to connect individuals interested in physical and sports activities across Algeria. Developed as a final graduation project for the Bachelor's Degree (Licence) in Computer Science at the University of Sciences and Technology Houari Boumediene (USTHB).

The platform addresses the lack of community coordination and information visibility for sports practitioners while guaranteeing absolute data privacy and protection against unauthorized interception.

---

## Technical Stack

* **Frontend:** React.js, CSS, Figma (UI/UX Prototyping)
* **Backend:** Node.js, Express.js, Socket.io (Real-time events)
* **Database:** MySQL Server, MySQL Workbench
* **Security & Cryptography:** Crypto.js, Node-forge, Bcrypt, JsonWebToken (JWT)

---

## Key Features

### 1. Community and Sports Coordination

* **Partner Matchmaking:** Users can post and browse localized announcements to find training partners based on sports categories, age ranges, skill levels, and gender preferences.
* **Social Engagement:** Features include profile customization, timeline posts, user-submitted thoughts, rating/evaluation systems, and stories.
* **Admin Dashboard:** Centralized panel for managing user access, monitoring moderation reports, handling community feedback, and inspecting graphical usage statistics.

### 2. Multi-Layered Cryptographic Architecture

To enforce maximum confidentiality and protect against Man-in-the-Middle (MITM) and padding oracle attacks, the platform implements custom security workflows:

* **Password Protection:** Transmitted using asymmetric RSA-OAEP encryption with the server's public key. Passwords are programmatically decrypted on the server, salted, hashed via Blowfish (Bcrypt with a cost factor of 10), and securely stored.
* **Session Authentication:** Handled via stateless JSON Web Tokens (JWT) signed with HMAC-SHA256, secured using `httpOnly`, `sameSite: none`, and `secure: true` cookie configurations to prevent XSS and CSRF.
* **End-to-End Encrypted Messaging:** Messages are encrypted directly on the client side using the recipient's public RSA key (RSA-OAEP).
* **Cryptographic Key Exchange:** Real-time key distribution uses the Diffie-Hellman key exchange protocol over unsecure networks to allow safe client-side derivation of local AES session keys used to decrypt historical private data.
* **Brute-Force Mitigation:** Built-in rate limiting (`authLimiter`) restricting connection routes to 5 attempts per 15 minutes per IP address.

---

## Architectural Diagrams and Modeling

The system was statically and dynamically modeled using UML 2.0 standards:

* **Use Case Modeling:** Explicit behavioral paths mapped out for both the End-User and the Platform Administrator.
* **Static Schema:** Mapped out via a 17-class UML relational database schema handling users, encrypted keys, messages, notifications, and reports.
* **Sequential Workflows:** Comprehensive sequence diagrams tracking real-time message broadcasting, cryptographic key exchanges, and user reporting functions.

---

## Getting Started

### Prerequisites

* Node.js (v18+)
* MySQL Server

### Installation and Setup

1. **Database Setup:**
   Import the SQL schema file into your local MySQL server instance using MySQL Workbench or the command line.

2. **Backend Installation:**
   ```bash
   cd path/to/backend
   npm install
   npm start
   ```

3. **Frontend Installation:**
   ```bash
   cd path/to/frontend
   npm install
   npm start
   ```

---

## Authors

* **BENARAB Massyl** — Graduate in Telecommunications and Networks Engineering — USTHB
* **ALLAG Younes** — Graduate in Telecommunications and Networks Engineering — USTHB
* **Advisors:** Mr. BENHOURIA Abdelmonaam and AMANI Ferhat

---

## License

This project is licensed under the **MIT License** — see the badge above.

```
MIT License

Copyright (c) 2026 BENARAB Massyl and ALLAG Younes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
