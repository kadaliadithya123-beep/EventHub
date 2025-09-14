# 🌐 EventHub

EventHub is a simple **front-end demo web app** built with **HTML, CSS, JavaScript, and Firebase**.  
It allows users to **register, login, create/update profiles, search for others, connect, and view dashboards**.  
The design follows a **glassmorphism + glowing background animation** style inspired by Skillswap-Hub.  

---

## 📂 Project Structure
EventHub/
├── assets/ 
│   ├── logo.png 
│   ├── google.png 
│   └── images/ 
│       ├── event1.png 
│       ├── event2.png 
│       └── event3.png 
├── index.html        # Homepage (search users + featured events) ├── users.html        # Search users & view profiles (with modal popup)
├── profile.html      # Update user profile (skills offered & wanted)
├── dashboard.html    # My Events + My Connections 
├── login.html        # User login (Email/Password + Google login) 
├── register.html     # User registration 
├── style.css         # Global styles (glassmorphism + animations) 
├── script.js         # App logic (Firebase auth, Firestore, UI) ├── firebase-config.js # Firebase project configuration 
└── README.md
---

## 🚀 Features
- 🔑 **Authentication**  
  - Email/Password login & register  
  - Google login (via Firebase Auth)  

- 👤 **Profile Management**  
  - Update name, email, bio, and skills (offered & wanted)  
  - Upload avatar  

- 🔍 **User Search**  
  - Search by name or skills  
  - Modal popup for user details with glowing blue overlay  

- 🖼 **Home Page**  
  - Featured events with hover glow  
  - Search bar for quick filtering  

- 📊 **Dashboard**  
  - My Events (demo placeholder)  
  - My Connections (demo placeholder)  

- 🎨 **Design**  
  - Glassmorphism cards  
  - Glowing buttons & hover effects  
  - Animated gradient background  

---

## ⚡ Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Auth & Database:** Firebase Authentication + Firestore  
- **Hosting:** Can be deployed via Netlify / Vercel / Firebase Hosting  

---

## 🛠 How to Run Locally
1. Clone this repo:
   ```bash
   git clone https://github.com/yourusername/EventHub.git