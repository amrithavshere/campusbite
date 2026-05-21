# CampusBite

CampusBite is a MERN stack college canteen ordering system. It allows students and staff to choose from multiple canteens, view menus, place orders, select payment mode, track billing details, and receive real-time notifications when orders are ready. Canteen employees can manage menus and orders, while admins can manage employee accounts.

## Features

### Student and Staff
- Register and login
- View canteens and menus
- Add items to bill summary
- Select payment mode: Cash at Counter or UPI
- Place orders
- View order history and bill details
- View UPI QR code for UPI orders
- Receive real-time order-ready notification

### Canteen Employee
- Login with employee account
- Manage only assigned canteen
- Add, edit, delete, and update menu item availability
- View orders in table format
- Update order status
- Mark bill as Paid or Pending

### Admin
- Create employee accounts
- Assign employees to canteens
- View and delete employees

## Tech Stack

**Frontend:** React, Vite, React Router, Axios, Bootstrap, Socket.IO Client  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Socket.IO

## User Roles

| Role | Access |
|---|---|
| Student | View canteens, place orders, track orders |
| Staff | View canteens, place orders, track orders |
| Employee | Manage assigned canteen menu and orders |
| Admin | Manage employee accounts |

## Project Structure

```text
campusbite/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run backend:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:5000
```

## Seed Data

Run these commands from the `backend` folder:

```bash
node seed/seedCanteens.js
node seed/updateCanteenQr.js
node seed/seedEmployees.js
node seed/seedAdmin.js
```

## Default Login Credentials
> These credentials are for local/demo use only. Change them before deployment.

### Admin

```
Email: admin@campusbite.com
Password: admin123
```

### Main Canteen Employee

```
Email: maincanteen@example.com
Password: 123456
```

### Mini Canteen Employee

```
Email: minicanteen@example.com
Password: 123456
```

Students and staff can register from the Register page.

## Main Pages

| Page | Path |
|---|---|
| Login | `/login` |
| Register | `/register` |
| Canteens | `/canteens` |
| Menu | `/menu/:canteenId` |
| My Orders | `/my-orders` |
| Employee Orders | `/employee/orders` |
| Manage Menu | `/employee/menu` |
| Admin Employees | `/admin/employees` |

## Security Notes

- `.env` is ignored using `.gitignore`
- Passwords are hashed using bcryptjs
- JWT authentication is used
- Role-based access control is implemented
- Employees can manage only their assigned canteen
- Employees cannot self-register; admin creates employee accounts

## Project Status

CampusBite is a functional MERN stack multi-canteen ordering and billing system with role-based access, UPI QR-assisted payment, employee menu/order management, admin employee management, and real-time order-ready notifications.
