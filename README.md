# Egyptian Museum Web App

## Overview
Production-ready MVC web app using Node.js, Express, MongoDB (Mongoose), EJS, and vanilla CSS/JS.

## Setup
1) Install dependencies: npm install
2) Create .env from .env.example and set values.
3) Run MongoDB locally or use MongoDB Atlas.
4) Seed sample data: npm run seed
5) Start server: npm run dev

## HTTPS (Bonus)
Option A (local self-signed)
- Generate a certificate using OpenSSL:
  - openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
- Update app.js to use https.createServer with the key/cert.

Option B (Hosting)
- Use your provider's TLS/SSL settings (e.g., Render, Railway, Vercel, or Nginx).
- Set secure cookies and trust proxy when behind a load balancer.

## Deployment Notes
- Set MONGODB_URI to MongoDB Atlas connection string.
- If your network blocks SRV lookups (`querySrv ECONNREFUSED`), set `MONGODB_URI_DIRECT` to Atlas's standard (non-SRV) connection string.
- Configure SESSION_SECRET and enable HTTPS in production.
- Set NODE_ENV=production for best performance.
