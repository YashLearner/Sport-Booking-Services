# 🏟️ Sports Court Booking System — Backend API

A robust, production-style **RESTful API** for booking sports courts (badminton, football turf, tennis, etc.), built with **Node.js, Express.js, and MongoDB**. It supports secure authentication, role-based access control, conflict-free slot booking, a credit-based wallet system, waitlists, and full audit logging.

---

## 📌 Overview

Sports Court Booking Services is a backend system designed to power a real-world court reservation platform. Users can browse available courts, book time slots, join a waitlist when a slot is full, and manage their bookings — while admins manage courts and view all bookings. The system ensures **data consistency** using MongoDB transactions, preventing race conditions like double-booking or inconsistent credit deductions.

---

## ✨ Features

- 🔐 **JWT Authentication & Authorization** — Secure register/login with hashed passwords (bcrypt) and role-based access (`user` / `admin`)
- 🏸 **Court Management (CRUD)** — Admins can create, update, delete, and list courts with pricing and capacity
- 📅 **Smart Slot Booking** — Time-overlap validation algorithm prevents double-booking of the same court
- 🔁 **Recurring Bookings** — Book the same slot on a weekly recurring basis
- ❌ **Booking Cancellation** — Cancel bookings with automatic credit refund
- 💳 **Credit/Wallet System** — Users book with credits; every transaction (debit/credit/refund) is tracked in a `CreditLedger`
- ⏳ **Waitlist System** — Join a waitlist for full slots; the oldest waiting user is promoted when a slot opens up
- 🧾 **Audit Logging** — Every critical action (booking created/cancelled, waitlist joined) is logged for traceability
- 🔔 **Notifications** — In-app notifications generated on booking events
- ⚙️ **ACID-Compliant Transactions** — MongoDB sessions/transactions ensure booking + credit + audit updates succeed or fail together
- 🧱 **Clean MVC Architecture** — Organized into Controllers, Services, Models, Routes, and Middleware for maintainability

---

## 🛠️ Tech Stack

| Category       | Technology                          |
|----------------|--------------------------------------|
| Runtime        | Node.js                              |
| Framework      | Express.js 5                         |
| Database       | MongoDB with Mongoose ODM            |
| Authentication | JSON Web Token (JWT), bcrypt         |
| Architecture   | MVC (Model-View-Controller)          |
| Others         | dotenv, cors, express-async-handler, nodemon |

---

## 📂 Project Structure

```
Sport-Booking-Services/
├── config/
│   └── db.js                  # MongoDB connection setup
├── controller/
│   ├── authController.js      # Register/Login logic
│   ├── bookingController.js   # Booking endpoints
│   ├── courtController.js     # Court CRUD endpoints
│   └── waitlistController.js  # Waitlist endpoints
├── middleware/
│   ├── authMiddleware.js      # JWT verification
│   ├── authorizeRoles.js      # Role-based access guard
│   ├── adminMiddleware.js     # Admin-only guard
│   └── errorMiddleware.js     # Centralized error handling
├── models/
│   ├── User.js
│   ├── Court.js
│   ├── Booking.js
│   ├── WaitList.js
│   ├── CreditLedger.js
│   ├── Notification.js
│   └── AuditLog.js
├── routes/
│   ├── authRoutes.js
│   ├── courtRoutes.js
│   ├── bookingRoutes.js
│   └── waitlistRoutes.js
├── services/
│   ├── bookingServices.js     # Core booking business logic + transactions
│   ├── courtService.js
│   └── waitlistServices.js
├── utils/
│   ├── asyncHandler.js
│   ├── createAuditLog.js
│   ├── createNotification.js
│   └── timeUtils.js
├── server.js                  # App entry point
└── package.json
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint             | Description         | Access |
|--------|----------------------|----------------------|--------|
| POST   | `/api/auth/register`  | Register a new user  | Public |
| POST   | `/api/auth/login`     | Login and get JWT    | Public |

### Courts
| Method | Endpoint             | Description              | Access       |
|--------|-----------------------|---------------------------|--------------|
| POST   | `/api/courts`          | Create a new court        | Admin        |
| GET    | `/api/courts`          | Get all courts            | Public       |
| GET    | `/api/courts/:id`      | Get a single court        | Public       |
| PUT    | `/api/courts/:id`      | Update a court            | Admin        |
| DELETE | `/api/courts/:id`      | Delete a court            | Admin        |

### Bookings
| Method | Endpoint                     | Description                        | Access      |
|--------|-------------------------------|-------------------------------------|-------------|
| POST   | `/api/bookings`               | Create a new booking                | Authenticated |
| GET    | `/api/bookings/my`            | Get logged-in user's bookings       | Authenticated |
| GET    | `/api/bookings`               | Get all bookings                    | Admin       |
| PATCH  | `/api/bookings/:id/cancel`    | Cancel a booking                    | Authenticated |
| POST   | `/api/bookings/recurring`     | Create a recurring weekly booking   | Authenticated |

### Waitlist
| Method | Endpoint            | Description               | Access        |
|--------|-----------------------|----------------------------|---------------|
| POST   | `/api/waitlist`        | Join the waitlist for a slot | Authenticated |

### Misc
| Method | Endpoint         | Description                 |
|--------|-------------------|------------------------------|
| GET    | `/`                | Health check                |
| GET    | `/api/profile`     | Get logged-in user's profile |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/Sport-Booking-Services.git
cd Sport-Booking-Services

# Install dependencies
npm install

# Create a .env file in the root directory
```

### Environment Variables

Create a `.env` file with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Run the server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will start at `http://localhost:5000`

---

## 🧠 Key Design Decisions

- **Transactional Integrity:** Booking creation/cancellation touches multiple collections (Booking, User credits, CreditLedger, AuditLog). MongoDB transactions ensure all of these succeed or roll back together, avoiding partial/inconsistent states.
- **Slot Overlap Algorithm:** Instead of relying only on database uniqueness constraints, booking times are converted to minutes and checked for overlap (`start1 < end2 && end1 > start2`), allowing flexible, minute-level slot validation.
- **Credit Ledger Pattern:** Rather than just storing a `credits` number on the user, every change is recorded as a ledger entry — similar to double-entry accounting — making the system auditable.

---

## 🚀 Future Improvements

- Payment gateway integration
- Real-time slot availability via WebSockets
- Email/SMS notifications
- Admin analytics dashboard
- Rate limiting & request validation (Joi/Zod)
- Automated test suite (Jest/Supertest)

---

## 👤 Author

Built and maintained by **[Your Name]**.

---

## 📄 License

This project is licensed under the ISC License.
