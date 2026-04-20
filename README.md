# Egyptian Museum Web App

## Overview
Production-ready MVC web app using Node.js, Express, MongoDB (Mongoose), EJS, and vanilla CSS/JS.

## Setup
1) Install dependencies: npm install
2) Create .env from .env.example and set values.
3) Run MongoDB locally or use MongoDB Atlas.
4) Seed sample data: npm run seed
5) Start server: npm run dev

## Local HTTPS + LAN Access (Phone / VR)

This project supports local HTTPS with self-signed certificates and LAN binding.

- Server host binding is configurable with HOST (default: 0.0.0.0).
- HTTPS is enabled with HTTPS=true.
- SSL cert/key paths are configurable using SSL_CERT_PATH and SSL_KEY_PATH.
- When started on 0.0.0.0, the server logs LAN URLs (for example: https://192.168.x.x:3000).

### 1) Generate certificates (recommended: mkcert)

Find your computer LAN IP on Windows:

- ipconfig

Example LAN IP: 192.168.1.23

Install mkcert (one-time, internet required):

- choco install mkcert -y

Install and trust local CA on your computer:

- mkcert -install

Generate certs for localhost + your LAN IP:

- mkdir certs
- mkcert -key-file certs/lan-key.pem -cert-file certs/lan-cert.pem localhost 127.0.0.1 ::1 192.168.1.23

Replace 192.168.1.23 with your actual LAN IP.

### 2) Configure environment

In .env set:

- HOST=0.0.0.0
- HTTPS=true
- PORT=3000
- SSL_KEY_PATH=certs/lan-key.pem
- SSL_CERT_PATH=certs/lan-cert.pem

### 3) Run the server (exact commands)

Option A (recommended, using .env):

- npm run dev

Option B (PowerShell one-liner):

- $env:HTTPS="true"; $env:HOST="0.0.0.0"; $env:SSL_KEY_PATH="certs/lan-key.pem"; $env:SSL_CERT_PATH="certs/lan-cert.pem"; npm run dev

Open on computer:

- https://localhost:3000

Open on phone (same Wi-Fi):

- https://192.168.1.23:3000

### 4) Trust the certificate on phone

To avoid browser blocking on mobile, trust the mkcert root CA on the phone.

Get CA folder path:

- mkcert -CAROOT

Copy rootCA.pem from that folder to your phone.

iOS:

- Open rootCA.pem on iPhone and install profile.
- Go to Settings > General > About > Certificate Trust Settings.
- Enable full trust for the installed root certificate.

Android:

- Rename/copy to rootCA.crt if needed.
- Install from Settings > Security > Encryption & credentials > Install a certificate > CA certificate.
- Confirm trust prompt.

### 5) WebXR / VR secure-context notes

WebXR and device sensors require a secure context.

- HTTPS with a trusted certificate is required when opening from phone IP.
- localhost is secure by default on desktop, but phone access by IP must use trusted HTTPS.
- For headset browser testing, always use the HTTPS LAN URL (https://192.168.x.x:PORT).

### 6) Offline behavior

After initial setup (dependencies + cert generation), the app can run offline on local network.

- Local HTTPS, VR experience scripts, and local assets work without internet.
- Features that embed external services (for example Google Maps embed pages) still require internet.

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
