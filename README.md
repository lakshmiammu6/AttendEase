# AttendEase – Attendance Management System

AttendEase is a MERN Stack-based Attendance Management System designed for college students, faculty, and administrators.

The project aims to simplify attendance tracking, faculty management, subject management, and attendance monitoring through a centralized web application.

## 🚀 Features

### Admin
- Manage faculty members.
- Manage departments and sections.
- Manage subjects.
- Assign faculty to subjects and sections.
- View attendance reports.

### Faculty
- Mark student attendance.
- View attendance history.
- Manage attendance correction requests.

### Student
- View attendance records.
- Track attendance percentage.
- View attendance analytics.
- Submit attendance correction requests.

## 🛠️ Technologies Used

**Frontend**
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## 📁 Project Structure

```text
AttendEase/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/lakshmiammu6/AttendEase.git
cd AttendEase
```

### 2. Backend setup

```bash
cd backend
npm install
```

Configure your backend environment variables using the provided `.env.example` file.

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## 🎯 Project Objective

To develop a centralized attendance management platform that reduces manual attendance work, improves attendance monitoring, and makes attendance information accessible to students, faculty, and administrators.

---

**AttendEase – Making Attendance Management Easier!**