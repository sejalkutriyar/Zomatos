# Zomato Ops Pro – Smart Kitchen + Delivery Hub (MERN Backend)

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### Installation
1. Open a terminal in the `Zomato/backend` directory.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start MongoDB locally (or set your Atlas URI in `.env` as `MONGO_URI`).
4. Start the backend server:
   ```sh
   npm run dev
   ```
   The backend will run on `http://localhost:5000` by default.

## API Endpoints

### Auth
- `POST /api/login` — `{ username, password }` → `{ username, role, partnerId? }`

### Orders (Manager)
- `POST /api/orders` — Add order `{ orderId, items, prepTime }`
- `GET /api/orders` — List all orders
- `PUT /api/orders/:orderId/assign` — Assign delivery partner `{ partnerId }`

### Orders (Partner)
- `GET /api/partner/:partnerId/order` — Get assigned order for partner
- `PUT /api/orders/:orderId/status` — Update order status `{ nextStatus }`

## Business Logic
- Prevent assigning same rider twice
- Validate prep time and partner availability
- Enforce sequential status flow: PREP → PICKED → ON_ROUTE → DELIVERED
- Mark partner available after delivery

## Users (for demo)
- Manager: `manager` / `manager123`
- Rider 1: `rider1` / `rider123`
- Rider 2: `rider2` / `rider123`
- Rider 3: `rider3` / `rider123`

---

You can now connect your React frontend to these endpoints for full-stack coordination.
