# Assistly: AI-Powered Ticket Management System

Welcome to **Assistly**, an AI-powered ticket management system!  
This project is a full-stack web application that uses **AI** to automatically analyze, categorize, and assign support tickets to the right moderators.  
Built with **Node.js, MongoDB, Inngest, Google Gemini AI, and React (Vite frontend)**.

---

## 🚀 Features

### 🎯 AI-Powered Ticket Processing
- Automatic ticket categorization
- Smart priority assignment
- AI-generated helpful notes for moderators
- AI-based moderator matching (skill-based)

### 👨‍💼 Smart Moderator Assignment
- Assign tickets to moderators based on skills
- Fallback to admin if no moderator matches

### 🔐 User Management
- Role-based access (User, Moderator, Admin)
- JWT-based authentication
- Admin dashboard: view all users
- Moderator dashboard: view assigned tickets

### ⚡ Background Processing
- Event-driven workflow using **Inngest**
- Automated AI ticket analysis
- Email notifications (Nodemailer + Mailtrap)

---

## 🛠️ Tech Stack

- **Backend:** Node.js (Express)
- **Frontend:** React + Vite + TailwindCSS
- **Database:** MongoDB
- **Authentication:** JWT
- **Background Jobs:** Inngest
- **AI Integration:** Google Gemini API
- **Email:** Nodemailer + Mailtrap

---

## 📋 Prerequisites

- Node.js
- MongoDB Atlas or local instance  
- Google Gemini API Key  
- Mailtrap account (for email testing)  

---
## 📂 Project Structure

```bash
ASSISTLY
├─ README.md
├─ ai-ticket-assistant
│  ├─ controllers
│  │  ├─ ticket.js
│  │  └─ user.js
│  ├─ createAdmin.js
│  ├─ createAdmin.sample.js
│  ├─ index.js
│  ├─ inngest
│  │  ├─ client.js
│  │  └─ functions
│  │     ├─ on-signup.js
│  │     └─ on-ticket-create.js
│  ├─ middlewares
│  │  └─ auth.js
│  ├─ models
│  │  ├─ ticket.js
│  │  └─ user.js
│  ├─ package-lock.json
│  ├─ package.json
│  └─ utils
│     ├─ ai.js
│     └─ mailer.js
└─ ai-ticket-frontend
   ├─ README.md
   ├─ eslint.config.js
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   ├─ public
   │  └─ vite.svg
   ├─ src
   │  ├─ assets
   │  │  └─ react.svg
   │  ├─ components
   │  │  └─ CheckAuth.jsx
   │  ├─ index.css
   │  ├─ main.jsx
   │  └─ pages
   │     ├─ Admin.jsx
   │     ├─ Login.jsx
   │     ├─ Signup.jsx
   │     ├─ Ticket.jsx
   │     └─ Tickets.jsx
   └─ vite.config.js
   ```
   ---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd ASSISTLY
```

### 2. Backend Setup
```bash
cd ai-ticket-assistant
npm install
```

Create a `.env` file in `ai-ticket-assistant/` with:

```env
# MongoDB
MONGO_URI=your_mongodb_uri

# JWT
JWT_SECRET=your_jwt_secret

# Email (Mailtrap)
MAILTRAP_SMTP_HOST=your_mailtrap_host
MAILTRAP_SMTP_PORT=your_mailtrap_port
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_password

# AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key

# App
APP_URL=http://localhost:3000
```

### createAdmin.js
- Create a `createAdmin.js` file in `ai-ticket-assistant/` sample given in `createAdmin.sample.js`
- This will create an Admin in the databse.


Start backend:
```bash
npm run dev
```

Start Inngest dev server:
```bash
npm run inngest-dev
```

### 3. Frontend Setup
```bash
cd ../ai-ticket-frontend
npm install
```

Create `.env` in `ai-ticket-frontend/`:
```env
VITE_SERVER_URL=http://localhost:3000/api
```

Run frontend:
```bash
npm run dev
```

---

## 📝 API Endpoints

### 🔑 Authentication
- `POST /api/auth/signup` → Register new user  
- `POST /api/auth/login` → Login & get JWT  
- `POST /api/auth/logout` → Logout

### 🎫 Tickets
- `POST /api/tickets` → Create a ticket  
- `GET /api/tickets` → Get all tickets of logged-in user  
- `GET /api/tickets/:id` → Get ticket details  

### 👑 Admin
- `GET /api/auth/users` → Get all users (Admin only)  
- `POST /api/auth/update-user` → Update user role/skills (Admin only)  

---

## 🔄 Ticket Processing Flow

1. **User creates a ticket** → enters title & description  
2. **Ticket saved in DB** with `TODO` status  
3. **Inngest event triggers AI analysis**:
   - Categorizes ticket
   - Suggests priority & skills
   - Generates helpful notes
   - Change the status to `IN_PROGRESS` 
4. **System assigns moderator**:
   - Match skills → assign moderator  
   - Else → assign admin  
5. **Moderator notified by email**  

---

## 📚 Dependencies

### Backend:
- express
- mongoose
- jsonwebtoken
- bcrypt
- inngest
- nodemailer

### Frontend:
- react(vite)
- tailwindcss

---


## Contributing

Contributions and suggestions are welcome!  
Please open an issue or submit a pull request.

---

## Author
**Pratham Dangaich**
<br>
**GitHub:** [prathamdangaich](https://github.com/prathamdangaich)

---
