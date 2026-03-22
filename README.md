# Daily Wallet

## 📖 What is this project used for?
Daily Wallet is a personal finance tracker and virtual wallet application. It allows users to manage their daily expenses, track their current balance, easily deposit virtual funds, and view a comprehensive history of their transactions in a beautifully designed dashboard.

https://github.com/user-attachments/assets/f2c5f51c-c084-4392-86ce-27dec5c97089

## 🤔 Why this project?
Managing daily expenses can often be tedious and unnecessarily complex. The goal of this project is to provide a fast, secure, and visually appealing interface to track spending and income in real-time. By providing a clean dashboard, it helps users stay on top of their financial health effortlessly.

## ⚙️ How it works?
The application features a secure, full-stack architecture built entirely with Next.js:
1. **Authentication**: Users can register and log in securely. Passwords are encrypted before saving to the database.
2. **Session Management**: Once authenticated, the user's session is securely managed on the server side using encrypted cookies, ensuring that their data remains private and secure.
3. **Wallet Operations**: From the dashboard, users can perform two main actions:
   - **Deposit**: Securely add funds to their balance.
   - **Spend**: Deduct funds when they make an expense.
4. **Data Persistence**: Every transaction and balance update is communicated directly to the backend API routes and reliably stored in a relational database.

## 💻 Tech Stack
This project operates on a modern, robust, and full-stack web ecosystem. Here is what is actually used:
- **Frontend UI & Components**: [React 19] and [Next.js 16.1+] (App Router).
- **Styling & Design**: [Tailwind CSS v4] for a premium, minimalistic, and highly responsive user interface with dynamic animations.
- **Backend API**: Next.js Route Handlers (API Routes) acting as the server-side backend.
- **Database**: **MySQL** (Relational Database). We use the `mysql2` package to execute fast and secure database queries directly from the Next.js backend.
- **Session Management**: `iron-session` (v8+). This library is used to manage secure, encrypted, and stateless cookie-based sessions.
- **Security**: `bcrypt` for securely hashing user passwords before they enter the database.
- **Local Architecture & Tools**:
  - **Laragon**: Used as the local development environment, providing a fast and isolated local web server and MySQL database server.
  - **phpMyAdmin**: Used alongside Laragon for a clean, visual web interface to manage the MySQL database, tables, and records.
- **Language**: **TypeScript** for strict type-checking and robust code across both frontend and backend.

---

## 🚀 Setup & Installation

### 1. Prerequisites
- **Node.js** (v18 or higher) installed on your system.
- **Laragon** installed and running (with MySQL enabled).
- **phpMyAdmin** accessible via Laragon.

### 2. Database Preparation
1. Open **Laragon** and click **Start All** to spin up the MySQL server.
2. Open **phpMyAdmin** (usually accessible by clicking "Database" in Laragon or going to `http://localhost/phpmyadmin`).
3. Create a new database named `daily_wallet`.

### 3. Environment Variables (IMPORTANT!)
> [!IMPORTANT]
> You **must** create a `.env.local` file in the root of the project to connect to the database and secure the sessions.

Create a `.env.local` file at the root of the project and ensure it contains the following exactly:

```env
DB_HOST=localhost
DB_USER=root
# Leave DB_PASSWORD empty if you haven't set a password for root in Laragon
DB_PASSWORD=
DB_NAME=daily_wallet

# This must be a randomly generated key entirely of at least 32 characters!
SESSION_SECRET=your_random_generated_key_of_32_characters_here
```

**Note regarding `SESSION_SECRET`**: You must replace the placeholder with a key generated of 32 characters randomly. This is crucial for `iron-session` to properly encrypt and decrypt the session cookies. Without a 32+ character string, the session will fail to initialize.

### 4. Installation
Install the project dependencies using npm:
```bash
npm install
```

### 5. Running the Application
Start the development server:
```bash
npm run dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to start using the Daily Wallet!
